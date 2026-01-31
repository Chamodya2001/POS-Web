from flask import Blueprint, request
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from src.models.order.OrderProcessModel import OrderProcessModel,OrderProcessSchema
from src.models.order.orderModel import OrderModel,OrderSchema
from ...helper.base_responce import base_response
from ...utils.namespace import NameSpace, success, error
from src.utils.extensions import db


# =============================
# Blueprint
# =============================
order_process_bp = Blueprint(
    NameSpace.ORDER_PROCESS_BP, __name__
)

order_process_schema = OrderProcessSchema()
order_process_list_schema = OrderProcessSchema(many=True)

# ---------------- ADD ----------------
@order_process_bp.route("/add", methods=["POST"])
def add_order_process():
    try:
        req_data = request.get_json(force=True)

        items = req_data.pop("items", [])

        # 1️⃣ Save order_process (HEADER)
        order_process = OrderProcessModel(req_data)
        db.session.add(order_process)
        db.session.flush()  
        # 👆 IMPORTANT: gets order_process_id without commit

        order_process_id = order_process.order_process_id

        # 2️⃣ Save order items (DETAILS)
        for item in items:
            order_item_data = {
                "order_process_id": order_process_id,
                "candidate_id": order_process.candidate_id,
                "item_id": item["item_id"],
                "item_name": item.get("item_name"),
                "price": item["price"],
                "quantity": item["quantity"],
                "discount": item.get("discount", 0)
            }

            order_item = OrderModel(order_item_data)
            db.session.add(order_item)

        # 3️⃣ Commit everything
        db.session.commit()

        return base_response(
            status_code=success.STATUS_CODE_201,
            success=True,
            message="Order created successfully",
            data={
                "order_process_id": order_process_id
            }
        )

    except ValidationError as e:
        db.session.rollback()
        return base_response(
            status_code=error.STATUS_CODE_400,
            success=False,
            message=str(e),
            data=None
        )

    except SQLAlchemyError as e:
        db.session.rollback()
        return base_response(
            status_code=error.STATUS_CODE_500,
            success=False,
            message=str(e),
            data=None
        )

# ---------------- GET ALL ----------------
@order_process_bp.route("/getAll", methods=["GET"])
def get_all_order_processes():
    orders = OrderProcessModel.get_all()
    return base_response(
        status_code=success.STATUS_CODE_200,
        success=True,
        message="Order processes retrieved successfully",
        data=order_process_list_schema.dump(orders)
    )

# ---------------- GET BY ID ----------------
@order_process_bp.route("/get/<int:order_process_id>", methods=["GET"])
def get_order_process(order_process_id):
    order_process = OrderProcessModel.get_by_id(order_process_id)
    if not order_process:
        return base_response(
            status_code=error.STATUS_CODE_404,
            success=False,
            message="Order process not found",
            data=None
        )

    return base_response(
        status_code=success.STATUS_CODE_200,
        success=True,
        message="Order process retrieved successfully",
        data=order_process_schema.dump(order_process)
    )

# ---------------- UPDATE ----------------
@order_process_bp.route("/update/<int:order_process_id>", methods=["PUT"])
def update_order_process(order_process_id):
    order_process = OrderProcessModel.get_by_id(order_process_id)
    if not order_process:
        return base_response(
            status_code=error.STATUS_CODE_404,
            success=False,
            message="Order process not found",
            data=None
        )

    try:
        req_data = request.get_json(force=True)
        order_process.update(req_data)

        return base_response(
            status_code=success.STATUS_CODE_200,
            success=True,
            message="Order process updated successfully",
            data=order_process_schema.dump(order_process)
        )

    except SQLAlchemyError as e:
        return base_response(
            status_code=error.STATUS_CODE_500,
            success=False,
            message=str(e),
            data=None
        )

# ---------------- DELETE ----------------
@order_process_bp.route("/delete/<int:order_process_id>", methods=["DELETE"])
def delete_order_process(order_process_id):
    order_process = OrderProcessModel.get_by_id(order_process_id)
    if not order_process:
        return base_response(
            status_code=error.STATUS_CODE_404,
            success=False,
            message="Order process not found",
            data=None
        )

    order_process.delete()
    return base_response(
        status_code=success.STATUS_CODE_200,
        success=True,
        message="Order process deleted successfully",
        data=None
    )
