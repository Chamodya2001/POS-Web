from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

from src.utils.extensions import db
from src.models.candidate.candidate_model import Candidate, CandidateSchema
from src.utils.namespace import NameSpace
from ...helper.base_responce import base_response

candidate_bp = Blueprint(NameSpace.CANDIDATE_BP, __name__)

candidate_schema = CandidateSchema()
candidates_schema = CandidateSchema(many=True)

# ---------------------------------------------------------
# AUTHENTICATION
# ---------------------------------------------------------
@candidate_bp.route("/login", methods=["POST"])
def login():
    """
    Super Admin Authenticator - Targets candidate.candidate table.
    Supports login via Email or NIC.
    """
    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No authentication data provided", None)

    identity = json_data.get("email") # Serves as Email or NIC
    password = json_data.get("password")

    if not identity or not password:
        return base_response(400, False, "Email/NIC and password are required", None)

    try:
        # Professional Identity Lookup (Email or NIC)
        login_id = identity.strip()
        candidate = Candidate.query.filter(
            (func.lower(func.trim(Candidate.email)) == login_id.lower()) |
            (func.lower(func.trim(Candidate.nic)) == login_id.lower())
        ).first()

        if not candidate:
            return base_response(401, False, "Invalid credentials. Identity not found in candidate registry.", None)

        # Accountability Check (status_id 1 = Active)
        if hasattr(candidate, 'status_id') and candidate.status_id == 0:
            return base_response(403, False, "Terminal access denied. This Super Admin account is currently inactive.", None)

        # Cryptographic Validation
        is_valid = candidate.check_password(password)
        
        # Security Transition: Support for plain-text migration if applicable
        if not is_valid and candidate.password_hash == password:
            print(f"SECURITY ALERT: Transitioning legacy password for {candidate.email} to secure hash.")
            candidate.set_password(password)
            db.session.commit()
            is_valid = True

        if not is_valid:
            return base_response(401, False, "Invalid credentials. Password mismatch.", None)

        # Audit: Log successful entry
        candidate.last_login = func.now() # Casting handled by Postgres for TIME column
        db.session.commit()

        # Contextual Payload Construction
        candidate_data = candidate_schema.dump(candidate)
        
        return base_response(
            status_code=200,
            success=True,
            message="Super Admin Authentication Successful",
            data={
                "user": candidate_data,
                "role": "super_admin"
            }
        )

    except Exception as e:
        print(f"CRITICAL SYSTEM ERROR during Super Admin login: {str(e)}")
        return base_response(500, False, "An internal protocol error occurred. Please contact system engineering.", str(e))

# ---------------------------------------------------------
# REGISTRY MANAGEMENT
# ---------------------------------------------------------

@candidate_bp.route("/save", methods=["POST"])
def create_candidate():
    json_data = request.get_json()

    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = candidate_schema.validate(json_data)
    if errors:
        return base_response(422, False, "Registry validation failed", errors)

    try:
        # Check duplicate candidate
        existing_candidate = Candidate.query.filter(
            (func.lower(func.trim(Candidate.email)) == json_data["email"].strip().lower()) |
            (Candidate.nic == json_data["nic"].strip())
        ).first()

        if existing_candidate:
            return base_response(409, False, "Conflict: Candidate already exists in the global registry.", None)

        # Extract password
        password = json_data.pop("password")
        json_data.pop("shop_id", None) # Do not accept shop_id if calculated server-side

        # Instantiate
        candidate = Candidate(**json_data)
        candidate.set_password(password)

        # Persistence Sequence
        db.session.add(candidate)
        db.session.commit()

        # Dynamic Identity Generation
        candidate.shop_id = f"SHOP-{candidate.shop_name}-{candidate.candidate_id}".replace(" ", "-").upper()
        db.session.commit()

        return base_response(
            status_code=201,
            success=True,
            message="Candidate successfully onboarded to the registry.",
            data=candidate_schema.dump(candidate)
        )

    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Registry persistence error.", str(e))


@candidate_bp.route("/get", methods=["GET"])
def get_all_candidates():
    try:
        candidates = Candidate.query.all()
        return base_response(200, True, "Registry retrieval complete.", candidates_schema.dump(candidates))
    except Exception as e:
        return base_response(500, False, "Failed to connect to candidate registry.", str(e))


@candidate_bp.route("/get-by-id/<int:candidate_id>", methods=["GET"])
def get_candidate(candidate_id):
    candidate = Candidate.query.get(candidate_id)

    if not candidate:
        return base_response(404, False, "Candidate record not found.", None)

    return base_response(200, True, "Record retrieval complete.", candidate_schema.dump(candidate))


@candidate_bp.route("/update-by-id/<int:candidate_id>", methods=["PUT"])
def update_candidate(candidate_id):
    candidate = Candidate.query.get(candidate_id)

    if not candidate:
        return base_response(404, False, "Modification target not found.", None)

    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No update data provided.", None)

    errors = candidate_schema.validate(json_data, partial=True)
    if errors:
        return base_response(422, False, "Update validation failed.", errors)

    try:
        for key, value in json_data.items():
            if key == "password":
                candidate.set_password(value)
            elif hasattr(candidate, key):
                setattr(candidate, key, value)

        db.session.commit()

        return base_response(200, True, "Candidate record updated successfully.", candidate_schema.dump(candidate))

    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to apply modifications to registry.", str(e))


@candidate_bp.route("/delete-by-id/<int:candidate_id>", methods=["DELETE"])
def delete_candidate(candidate_id):
    candidate = Candidate.query.get(candidate_id)

    if not candidate:
        return base_response(404, False, "Deletion target not found.", None)

    try:
        db.session.delete(candidate)
        db.session.commit()
        return base_response(200, True, "Candidate record successfully purged from registry.", None)

    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Deletion protocol failure.", str(e))
