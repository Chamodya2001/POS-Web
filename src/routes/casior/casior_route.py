from flask import Blueprint, request
from src.models.casior.casior_model import Casior,CasiorSchema
from src.models.candidate.candidate_model import Candidate
from src.helper.base_responce import base_response
from src.utils.extensions import db
from ...utils.namespace import NameSpace

casior_bp = Blueprint(NameSpace.CASIOR_BP, __name__)

# Single & multiple schemas
casior_schema = CasiorSchema()
casiors_schema = CasiorSchema(many=True)

# ------------------------
# CREATE CASIOR
# ------------------------
@casior_bp.route("/save", methods=["POST"])
def create_casior():
    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = casior_schema.validate(json_data)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    candidate = Candidate.query.get(json_data.get("candidate_id"))
    if not candidate:
        return base_response(404, False, "Candidate not found", None)

    existing = Casior.query.filter_by(
        nic=json_data.get("nic"),
        
    ).first()
    if existing:
        return base_response(409, False, "Casior already exists", None)

    # ✅ PASSWORD CHECK
    password = json_data.get("password")
    if not password:
        return base_response(400, False, "Password is required", None)

    json_data.pop("password")

    try:
        casior = Casior(**json_data)
        casior.set_password(password)
        casior.save()

        return base_response(
            201,
            True,
            "Casior created successfully",
            casior_schema.dump(casior)
        )

    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to create casior", str(e))

# ------------------------
# GET ALL CASIORS
# ------------------------
@casior_bp.route("/get", methods=["GET"])
def get_all_casiors():
    try:
        casiors = Casior.query.all()
        return base_response(200, True, "Casiors retrieved successfully", casiors_schema.dump(casiors))
    except Exception as e:
        return base_response(500, False, "Failed to retrieve casiors", str(e))

# ------------------------
# GET CASIOR BY ID
# ------------------------
@casior_bp.route("/<int:casior_id>", methods=["GET"])
def get_casior(casior_id):
    casior = Casior.query.get(casior_id)
    if not casior:
        return base_response(404, False, "Casior not found", None)
    return base_response(200, True, "Casior retrieved successfully", casior_schema.dump(casior))

# ------------------------
# UPDATE CASIOR
# ------------------------
@casior_bp.route("/<int:casior_id>", methods=["PUT"])
def update_casior(casior_id):
    casior = Casior.query.get(casior_id)
    if not casior:
        return base_response(404, False, "Casior not found", None)

    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = casior_schema.validate(json_data, partial=True)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    try:
        casior.update(json_data)
        return base_response(200, True, "Casior updated successfully", casior_schema.dump(casior))
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to update casior", str(e))

# ------------------------
# DELETE CASIOR
# ------------------------
@casior_bp.route("/<int:casior_id>", methods=["DELETE"])
def delete_casior(casior_id):
    casior = Casior.query.get(casior_id)
    if not casior:
        return base_response(404, False, "Casior not found", None)

    try:
        casior.delete()
        return base_response(200, True, "Casior deleted successfully", None)
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to delete casior", str(e))

@casior_bp.route("/login", methods=["POST"])
def login():
    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    email = json_data.get("email")
    password = json_data.get("password")

    if not email or not password:
        return base_response(400, False, "Email and password are required", None)

    try:
        casior = Casior.query.filter_by(email=email).first()
        if not casior:
            return base_response(401, False, "Invalid email or password", None)

        # Check hashed password
        is_valid = casior.check_password(password)
        
        # Fallback for plain text
        if not is_valid and casior.password == password:
            print(f"DEBUG: Plain text password match for casior {email}. Re-hashing...")
            casior.set_password(password)
            db.session.commit()
            is_valid = True

        if not is_valid:
            return base_response(401, False, "Invalid email or password", None)

        dumped_data = casior_schema.dump(casior)
        print(f"DEBUG: Casior login successful for {email}. Dumped data: {dumped_data}")

        return base_response(
            status_code=200,
            success=True,
            message="Login successful",
            data={
                "user": dumped_data,
                "role": "admin"
            }
        )

    except Exception as e:
        return base_response(500, False, "Internal server error", str(e))
