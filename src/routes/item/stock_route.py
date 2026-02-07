from flask import Blueprint, request
from src.models.item.stock_model import Stock,StockSchema
from src.models.candidate.candidate_model import Candidate
from src.models.item.item_model import Item
from src.models.item.supplier_model import Suplier
from src.helper.base_responce import base_response
from src.utils.extensions import db
from ...utils.namespace import NameSpace

stock_bp = Blueprint(NameSpace.STOCK_BP, __name__)

stock_schema = StockSchema()
stocks_schema = StockSchema(many=True)

# ------------------------
# CREATE STOCK
# ------------------------
@stock_bp.route("/save", methods=["POST"])
def create_stock():
    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = stock_schema.validate(json_data)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    # FK validations
    if not Candidate.query.get(json_data["candidate_id"]):
        return base_response(404, False, "Candidate not found", None)

    if not Item.query.get(json_data["item_id"]):
        return base_response(404, False, "Item not found", None)

    if not Suplier.query.get(json_data["suplier_id"]):
        return base_response(404, False, "Supplier not found", None)

    try:
        stock = Stock(**json_data)
        stock.save()
        return base_response(
            201, True,
            "Stock created successfully",
            stock_schema.dump(stock)
        )
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to create stock", str(e))


# ------------------------
# GET ALL STOCKS
# ------------------------
@stock_bp.route("/get", methods=["GET"])
def get_all_stocks():
    try:
        stocks = Stock.query.all()
        return base_response(
            200, True,
            "Stocks retrieved successfully",
            stocks_schema.dump(stocks)
        )
    except Exception as e:
        return base_response(500, False, "Failed to retrieve stocks", str(e))


# ------------------------
# GET STOCK BY ID
# ------------------------
@stock_bp.route("/<int:stock_id>", methods=["GET"])
def get_stock(stock_id):
    stock = Stock.query.get(stock_id)
    if not stock:
        return base_response(404, False, "Stock not found", None)

    return base_response(
        200, True,
        "Stock retrieved successfully",
        stock_schema.dump(stock)
    )


# ------------------------
# UPDATE STOCK
# ------------------------
@stock_bp.route("/<int:stock_id>", methods=["PUT"])
def update_stock(stock_id):
    stock = Stock.query.get(stock_id)
    if not stock:
        return base_response(404, False, "Stock not found", None)

    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = stock_schema.validate(json_data, partial=True)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    try:
        stock.update(json_data)
        return base_response(
            200, True,
            "Stock updated successfully",
            stock_schema.dump(stock)
        )
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to update stock", str(e))


# ------------------------
# DELETE STOCK
# ------------------------
@stock_bp.route("/<int:stock_id>", methods=["DELETE"])
def delete_stock(stock_id):
    stock = Stock.query.get(stock_id)
    if not stock:
        return base_response(404, False, "Stock not found", None)

    try:
        stock.delete()
        return base_response(200, True, "Stock deleted successfully", None)
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to delete stock", str(e))
