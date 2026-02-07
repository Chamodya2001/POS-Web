from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

from src.utils.extensions import db
from src.models.candidate.candidate_model import Candidate, CandidateSchema
from src.utils.namespace import NameSpace
from ...helper.base_responce import base_response

candidate_bp = Blueprint(NameSpace.CANDIDATE_BP,__name__)

candidate_schema = CandidateSchema()
candidates_schema = CandidateSchema(many=True)


@candidate_bp.route("/save", methods=["POST"])
def create_candidate():
    json_data = request.get_json()

    if not json_data:
        return base_response(
            status_code=400,
            success=False,
            message="No input data provided",
            data=None
        )

    errors = candidate_schema.validate(json_data)
    if errors:
        return base_response(
            status_code=422,
            success=False,
            message="Validation failed",
            data=errors
        )

    try:
        # Check duplicate candidate
        existing_candidate = Candidate.query.filter(
            (func.lower(func.trim(Candidate.email)) == json_data["email"].strip().lower()) |
            (Candidate.nic == json_data["nic"].strip())
        ).first()


        if existing_candidate:
            return base_response(
                status_code=409,
                success=False,
                message="Candidate already exists",
                data=None
            )

        # Extract password
        password = json_data.pop("password")

        # 🚫 DO NOT accept shop_id from frontend
        json_data.pop("shop_id", None)

        # Create candidate
        candidate = Candidate(**json_data)
        candidate.set_password(password)

        # 1️⃣ First commit (get candidate_id)
        db.session.add(candidate)
        db.session.commit()

        # 2️⃣ Generate shop_id
        candidate.shop_id = f"SHOP-{candidate.shop_name}-{candidate.candidate_id}"

        # 3️⃣ Second commit
        db.session.commit()

        return base_response(
            status_code=201,
            success=True,
            message="Candidate created successfully",
            data=candidate_schema.dump(candidate)
        )

    except Exception as e:
        db.session.rollback()
        return base_response(
            status_code=500,
            success=False,
            message="Failed to create candidate",
            data=str(e)
        )



@candidate_bp.route("/get", methods=["GET"])
def get_all_candidates():
    try:
        candidates = Candidate.query.all()
        return base_response(
            status_code=200,
            success=True,
            message="Candidates retrieved successfully",
            data=candidates_schema.dump(candidates)
        )
    except Exception as e:
        return base_response(
            status_code=500,
            success=False,
            message="Failed to retrieve candidates",
            data=str(e)
        )



@candidate_bp.route("/get-by-id/<int:candidate_id>", methods=["GET"])
def get_candidate(candidate_id):
    candidate = Candidate.query.get(candidate_id)

    if not candidate:
        return base_response(
            status_code=404,
            success=False,
            message="Candidate not found",
            data=None
        )

    return base_response(
        status_code=200,
        success=True,
        message="Candidate retrieved successfully",
        data=candidate_schema.dump(candidate)
    )



@candidate_bp.route("/update-by-id/<int:candidate_id>", methods=["PUT"])
def update_candidate(candidate_id):
    candidate = Candidate.query.get(candidate_id)

    if not candidate:
        return base_response(
            status_code=404,
            success=False,
            message="Candidate not found",
            data=None
        )

    json_data = request.get_json()
    if not json_data:
        return base_response(
            status_code=400,
            success=False,
            message="No input data provided",
            data=None
        )

    # Allow partial updates
    errors = candidate_schema.validate(json_data, partial=True)
    if errors:
        return base_response(
            status_code=422,
            success=False,
            message="Validation failed",
            data=errors
        )

    try:
        for key, value in json_data.items():
            if key == "password":
                candidate.set_password(value)
            elif hasattr(candidate, key):
                setattr(candidate, key, value)

        db.session.commit()

        return base_response(
            status_code=200,
            success=True,
            message="Candidate updated successfully",
            data=candidate_schema.dump(candidate)
        )

    except Exception as e:
        db.session.rollback()
        return base_response(
            status_code=500,
            success=False,
            message="Failed to update candidate",
            data=str(e)
        )



@candidate_bp.route("delete-by-id/<int:candidate_id>", methods=["DELETE"])
def delete_candidate(candidate_id):
    candidate = Candidate.query.get(candidate_id)

    if not candidate:
        return base_response(
            status_code=404,
            success=False,
            message="Candidate not found",
            data=None
        )

    try:
        db.session.delete(candidate)
        db.session.commit()

        return base_response(
            status_code=200,
            success=True,
            message="Candidate deleted successfully",
            data=None
        )

    except Exception as e:
        db.session.rollback()
        return base_response(
            status_code=500,
            success=False,
            message="Failed to delete candidate",
            data=str(e)
        )
@candidate_bp.route("/login", methods=["POST"])
def login():
    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    email = json_data.get("email")
    password = json_data.get("password")

    if not email or not password:
        return base_response(400, False, "Email and password are required", None)

    try:
        candidate = Candidate.query.filter(
            func.lower(func.trim(Candidate.email)) == email.strip().lower()
        ).first()

        if not candidate:
            return base_response(401, False, "Invalid email or password", None)

        # Check if account is active (assuming status_id 1 is active)
        if hasattr(candidate, 'status_id') and candidate.status_id == 0:
            return base_response(403, False, "Your account is disabled. Please contact support.", None)

        # Check hashed password
        is_valid = candidate.check_password(password)
        
        # Fallback for plain text (for initial setup convenience as requested)
        if not is_valid and candidate.password_hash == password:
            print(f"DEBUG: Plain text password match for {email}. Re-hashing...")
            candidate.set_password(password)
            db.session.commit()
            is_valid = True

        if not is_valid:
            return base_response(401, False, "Invalid email or password", None)

        # Update last login
        candidate.last_login = func.now()
        db.session.commit()

        dumped_data = candidate_schema.dump(candidate)
        print(f"DEBUG: Login successful for {email}. Dumped data: {dumped_data}")

        return base_response(
            status_code=200,
            success=True,
            message="Login successful",
            data={
                "user": dumped_data,
                "role": "super_admin" # Hardcoding for now as requested
            }
        )

    except Exception as e:
        return base_response(500, False, "Internal server error", str(e))
