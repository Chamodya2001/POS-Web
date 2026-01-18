from flask import Blueprint, request
from src.models.item.item_model import Item,ItemSchema
from src.models.candidate.candidate_model import Candidate
from src.models.category.category_model import Category
from src.helper.base_responce import base_response
from src.utils.extensions import db
from ...utils.namespace import NameSpace

item_bp = Blueprint(NameSpace.ITEM_BP, __name__)

item_schema = ItemSchema()
items_schema = ItemSchema(many=True)

# ------------------------
# CREATE ITEM
# ------------------------
@item_bp.route("/save", methods=["POST"])
def create_item():
    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    # Validate schema
    errors = item_schema.validate(json_data)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    # Check candidate exists
    candidate = Candidate.query.get(json_data["candidate_id"])
    if not candidate:
        return base_response(404, False, f"Candidate {json_data['candidate_id']} not found", None)

    # Check category exists
    category = Category.query.get(json_data["category_id"])
    if not category:
        return base_response(404, False, f"Category {json_data['category_id']} not found", None)

    try:
        existing_item = Item.query.filter(
            Item.item_name.ilike(json_data["item_name"].strip()),
            Item.short_code == json_data["short_code"],
            Item.bar_code == json_data["bar_code"]
        ).first()
        if existing_item:
            return base_response(409, False, "Item already exists for this candidate", None)
        
        item = Item(**json_data)
        item.save()
        return base_response(201, True, "Item created successfully", item_schema.dump(item))
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to create item", str(e))

# ------------------------
# GET ALL ITEMS
# ------------------------
@item_bp.route("/get", methods=["GET"])
def get_all_items():
    try:
        items = Item.query.all()
        return base_response(200, True, "Items retrieved successfully", items_schema.dump(items))
    except Exception as e:
        return base_response(500, False, "Failed to retrieve items", str(e))

# ------------------------
# GET ITEM BY ID
# ------------------------
@item_bp.route("/<int:item_id>", methods=["GET"])
def get_item(item_id):
    item = Item.query.get(item_id)
    if not item:
        return base_response(404, False, "Item not found", None)
    return base_response(200, True, "Item retrieved successfully", item_schema.dump(item))

# ------------------------
# UPDATE ITEM
# ------------------------
@item_bp.route("/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    item = Item.query.get(item_id)
    if not item:
        return base_response(404, False, "Item not found", None)

    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = item_schema.validate(json_data, partial=True)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    try:
        item.update(json_data)
        return base_response(200, True, "Item updated successfully", item_schema.dump(item))
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to update item", str(e))

# ------------------------
# DELETE ITEM
# ------------------------
@item_bp.route("/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    item = Item.query.get(item_id)
    if not item:
        return base_response(404, False, "Item not found", None)
    try:
        item.delete()
        return base_response(200, True, "Item deleted successfully", None)
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to delete item", str(e))
