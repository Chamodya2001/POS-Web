from flask import Blueprint, request, json
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

# from ...auth.authentication import Auth
from ...helper.base_responce import base_response
from ...utils.namespace import NameSpace, success, error
from ...models.order.orderModel import OrderModel, OrderSchema

# =====================================================
# ROUTES
# =====================================================
order_bp = Blueprint(
    NameSpace.ORDER_BP, __name__
)

order_schema = OrderSchema()
order_list_schema = OrderSchema(many=True)

# ---------------- ADD ----------------
@order_bp.route("/add", methods=["POST"])
# @Auth.auth_required
def add_order():
    try:
        req_data = request.get_json(force=True)
        data = order_schema.load(req_data)

        order = OrderModel(data)
        order.save()

        return base_response(
            status_code=success.STATUS_CODE_201,
            success=True,
            message="Order created successfully",
            data=order_schema.dump(order)
        )

    except ValidationError as e:
        return base_response(
            status_code=error.STATUS_CODE_400,
            success=False,
            message=str(e),
            data=None
        )
    except SQLAlchemyError as e:
        return base_response(
            status_code=error.STATUS_CODE_500,
            success=False,
            message=str(e),
            data=None
        )


# ---------------- GET ALL ----------------
@order_bp.route("/getAll", methods=["GET"])
#@Auth.auth_required
def get_all_orders():
    orders = OrderModel.get_all()
    return base_response(
        status_code=success.STATUS_CODE_200,
        success=True,
        message="Orders retrieved successfully",
        data=order_list_schema.dump(orders)
    )


# ---------------- GET BY ID ----------------
@order_bp.route("/get/<int:order_id>", methods=["GET"])
#@Auth.auth_required
def get_order(order_id):
    order = OrderModel.get_by_id(order_id)
    if not order:
        return base_response(
            status_code=error.STATUS_CODE_404,
            success=False,
            message="Order not found",
            data=None
        )

    return base_response(
        status_code=success.STATUS_CODE_200,
        success=True,
        message="Order retrieved successfully",
        data=order_schema.dump(order)
    )


# ---------------- UPDATE ----------------
@order_bp.route("/update/<int:order_id>", methods=["PUT"])
#@Auth.auth_required
def update_order(order_id):
    order = OrderModel.get_by_id(order_id)
    if not order:
        return base_response(
            status_code=error.STATUS_CODE_404,
            success=False,
            message="Order not found",
            data=None
        )

    try:
        req_data = request.get_json(force=True)
        order.update(req_data)

        return base_response(
            status_code=success.STATUS_CODE_200,
            success=True,
            message="Order updated successfully",
            data=order_schema.dump(order)
        )

    except SQLAlchemyError as e:
        return base_response(
            status_code=error.STATUS_CODE_500,
            success=False,
            message=str(e),
            data=None
        )


# ---------------- DELETE ----------------
@order_bp.route("/delete/<int:order_id>", methods=["DELETE"])
#@Auth.auth_required
def delete_order(order_id):
    order = OrderModel.get_by_id(order_id)
    if not order:
        return base_response(
            status_code=error.STATUS_CODE_404,
            success=False,
            message="Order not found",
            data=None
        )

    order.delete()
    return base_response(
        status_code=success.STATUS_CODE_200,
        success=True,
        message="Order deleted successfully",
        data=None
    )
