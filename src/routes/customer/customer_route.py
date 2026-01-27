from flask import Blueprint, request
from src.utils.extensions import db
from src.models.customer.customer_model import Customer,CustomerSchema
from src.helper.base_responce import base_response
from ...utils.namespace import NameSpace

customer_bp = Blueprint(NameSpace.CUSTOMER_BP, __name__)

customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)

# ---------------- CREATE ----------------
@customer_bp.route("/save", methods=["POST"])
def create_customer():
    json_data = request.get_json()
    if not json_data:
        return base_response(
            400, False, "No input data provided", None
        )

    errors = customer_schema.validate(json_data)
    if errors:
        return base_response(
            422, False, "Validation failed", errors
        )

    try:
        customer = Customer(**json_data)
        customer.save()

        return base_response(
            201, True, "Customer created successfully",
            customer_schema.dump(customer)
        )

    except Exception as e:
        db.session.rollback()
        return base_response(
            500, False, "Failed to create customer", str(e)
        )


# ---------------- GET ALL ----------------
@customer_bp.route("/get-all", methods=["GET"])
def get_customers():
    try:
        customers = Customer.query.all()
        return base_response(
            200, True, "Customers retrieved successfully",
            customers_schema.dump(customers)
        )
    except Exception as e:
        return base_response(
            500, False, "Failed to fetch customers", str(e)
        )


# ---------------- GET ONE ----------------
@customer_bp.route("/<int:customer_id>", methods=["GET"])
def get_customer(customer_id):
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return base_response(
                404, False, "Customer not found", None
            )

        return base_response(
            200, True, "Customer retrieved successfully",
            customer_schema.dump(customer)
        )

    except Exception as e:
        return base_response(
            500, False, "Failed to fetch customer", str(e)
        )


# ---------------- UPDATE ----------------
@customer_bp.route("/<int:customer_id>", methods=["PUT"])
def update_customer(customer_id):
    json_data = request.get_json()
    if not json_data:
        return base_response(
            400, False, "No input data provided", None
        )

    errors = customer_schema.validate(json_data, partial=True)
    if errors:
        return base_response(
            422, False, "Validation failed", errors
        )

    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return base_response(
                404, False, "Customer not found", None
            )

        customer.update(json_data)

        return base_response(
            200, True, "Customer updated successfully",
            customer_schema.dump(customer)
        )

    except Exception as e:
        db.session.rollback()
        return base_response(
            500, False, "Failed to update customer", str(e)
        )


# ---------------- DELETE ----------------
@customer_bp.route("/<int:customer_id>", methods=["DELETE"])
def delete_customer(customer_id):
    try:
        customer = Customer.query.get(customer_id)
        if not customer:
            return base_response(
                404, False, "Customer not found", None
            )

        customer.delete()

        return base_response(
            200, True, "Customer deleted successfully", None
        )

    except Exception as e:
        db.session.rollback()
        return base_response(
            500, False, "Failed to delete customer", str(e)
        )
