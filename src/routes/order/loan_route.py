from flask import Blueprint, request
from src.models.order.loan_model import Loan, LoanSchema
from src.models.candidate.candidate_model import Candidate
from src.models.customer.customer_model import Customer
from src.helper.base_responce import base_response
from src.utils.extensions import db
from ...utils.namespace import NameSpace

loan_bp = Blueprint(NameSpace.LOAN_BP, __name__)

loan_schema = LoanSchema()
loans_schema = LoanSchema(many=True)

# ------------------------
# CREATE LOAN
# ------------------------
@loan_bp.route("/save", methods=["POST"])
def create_loan():
    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = loan_schema.validate(json_data)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    # FK validations
    if not Candidate.query.get(json_data["candidate_id"]):
        return base_response(404, False, "Candidate not found", None)

    if not Customer.query.get(json_data["customer_id"]):
        return base_response(404, False, "Customer not found", None)

    try:
        loan = Loan(**json_data)
        loan.save()

        return base_response(
            201, True,
            "Loan created successfully",
            loan_schema.dump(loan)
        )

    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to create loan", str(e))


# ------------------------
# GET ALL LOANS
# ------------------------
@loan_bp.route("/get", methods=["GET"])
def get_all_loans():
    try:
        loans = Loan.query.all()
        return base_response(
            200, True,
            "Loans retrieved successfully",
            loans_schema.dump(loans)
        )
    except Exception as e:
        return base_response(500, False, "Failed to retrieve loans", str(e))


# ------------------------
# GET LOAN BY ID
# ------------------------
@loan_bp.route("/<int:loan_id>", methods=["GET"])
def get_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if not loan:
        return base_response(404, False, "Loan not found", None)

    return base_response(
        200, True,
        "Loan retrieved successfully",
        loan_schema.dump(loan)
    )


# ------------------------
# UPDATE LOAN
# ------------------------
@loan_bp.route("/<int:loan_id>", methods=["PUT"])
def update_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if not loan:
        return base_response(404, False, "Loan not found", None)

    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = loan_schema.validate(json_data, partial=True)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    try:
        loan.update(json_data)
        return base_response(
            200, True,
            "Loan updated successfully",
            loan_schema.dump(loan)
        )
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to update loan", str(e))


# ------------------------
# DELETE LOAN
# ------------------------
@loan_bp.route("/<int:loan_id>", methods=["DELETE"])
def delete_loan(loan_id):
    loan = Loan.query.get(loan_id)
    if not loan:
        return base_response(404, False, "Loan not found", None)

    try:
        loan.delete()
        return base_response(
            200, True,
            "Loan deleted successfully",
            None
        )
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to delete loan", str(e))
