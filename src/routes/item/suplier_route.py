from flask import Blueprint, request
from src.models.item.supplier_model import Suplier, SuplierSchema
from src.models.candidate.candidate_model import Candidate
from src.helper.base_responce import base_response
from src.utils.extensions import db
from ...utils.namespace import NameSpace

suplier_bp = Blueprint(NameSpace.SUPLIER_BP, __name__)

suplier_schema = SuplierSchema()
supliers_schema = SuplierSchema(many=True)

# ------------------------
# CREATE SUPLIER
# ------------------------
@suplier_bp.route("/save", methods=["POST"])
def create_suplier():
    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = suplier_schema.validate(json_data)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    # Check candidate exists
    candidate = Candidate.query.get(json_data["candidate_id"])
    if not candidate:
        return base_response(
            404, False,
            f"Candidate {json_data['candidate_id']} not found",
            None
        )

    try:
        existing_suplier = Suplier.query.filter(
            Suplier.company_name.ilike(json_data.get("company_name", "").strip()),
            Suplier.candidate_id == json_data["candidate_id"]
        ).first()

        if existing_suplier:
            return base_response(
                409, False,
                "Supplier already exists for this candidate",
                None
            )

        suplier = Suplier(**json_data)
        suplier.save()

        return base_response(
            201, True,
            "Supplier created successfully",
            suplier_schema.dump(suplier)
        )

    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to create supplier", str(e))


# ------------------------
# GET ALL SUPLIERS
# ------------------------
@suplier_bp.route("/get", methods=["GET"])
def get_all_supliers():
    try:
        supliers = Suplier.query.all()
        return base_response(
            200, True,
            "Suppliers retrieved successfully",
            supliers_schema.dump(supliers)
        )
    except Exception as e:
        return base_response(500, False, "Failed to retrieve suppliers", str(e))


# ------------------------
# GET SUPLIER BY ID
# ------------------------
@suplier_bp.route("/<int:suplier_id>", methods=["GET"])
def get_suplier(suplier_id):
    suplier = Suplier.query.get(suplier_id)
    if not suplier:
        return base_response(404, False, "Supplier not found", None)

    return base_response(
        200, True,
        "Supplier retrieved successfully",
        suplier_schema.dump(suplier)
    )


# ------------------------
# UPDATE SUPLIER
# ------------------------
@suplier_bp.route("/<int:suplier_id>", methods=["PUT"])
def update_suplier(suplier_id):
    suplier = Suplier.query.get(suplier_id)
    if not suplier:
        return base_response(404, False, "Supplier not found", None)

    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = suplier_schema.validate(json_data, partial=True)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    try:
        suplier.update(json_data)
        return base_response(
            200, True,
            "Supplier updated successfully",
            suplier_schema.dump(suplier)
        )
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to update supplier", str(e))


# ------------------------
# DELETE SUPLIER
# ------------------------
@suplier_bp.route("/<int:suplier_id>", methods=["DELETE"])
def delete_suplier(suplier_id):
    suplier = Suplier.query.get(suplier_id)
    if not suplier:
        return base_response(404, False, "Supplier not found", None)

    try:
        suplier.delete()
        return base_response(200, True, "Supplier deleted successfully", None)
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to delete supplier", str(e))
