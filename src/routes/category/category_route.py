from flask import Blueprint, request
from src.models.category.category_model import  Category,CategorySchema
from src.utils.namespace import NameSpace
from ...helper.base_responce import base_response
from src.utils.extensions import db



category_bp = Blueprint(NameSpace.CATEGORY_BP, __name__)

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)

# ------------------------
# CREATE CATEGORY
# ------------------------
@category_bp.route("/save", methods=["POST"])
def create_category():
    json_data = request.get_json()

    if not json_data:
        return base_response(400, False, "No input data provided", None)

    # Validate
    errors = category_schema.validate(json_data)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    try:
        existing_category = Category.query.filter(
            Category.category_name.ilike(json_data["category_name"].strip())
        ).first()
        
        if existing_category:
            return base_response(409, False, "Category already exists", None)
        
        category = Category(**json_data)
        category.save()

        return base_response(
            201,
            True,
            "Category created successfully",
            category_schema.dump(category)
        )

    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to create category", str(e))


# ------------------------
# GET ALL CATEGORIES
# ------------------------
@category_bp.route("/get", methods=["GET"])
def get_all_categories():
    try:
        categories = Category.query.all()
        return base_response(
            200,
            True,
            "Categories retrieved successfully",
            categories_schema.dump(categories)
        )
    except Exception as e:
        return base_response(500, False, "Failed to retrieve categories", str(e))


# ------------------------
# GET CATEGORY BY ID
# ------------------------
@category_bp.route("/<int:category_id>", methods=["GET"])
def get_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return base_response(404, False, "Category not found", None)

    return base_response(
        200,
        True,
        "Category retrieved successfully",
        category_schema.dump(category)
    )


# ------------------------
# UPDATE CATEGORY
# ------------------------
@category_bp.route("/<int:category_id>", methods=["PUT"])
def update_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return base_response(404, False, "Category not found", None)

    json_data = request.get_json()
    if not json_data:
        return base_response(400, False, "No input data provided", None)

    errors = category_schema.validate(json_data, partial=True)
    if errors:
        return base_response(422, False, "Validation failed", errors)

    try:
        category.update(json_data)
        return base_response(
            200,
            True,
            "Category updated successfully",
            category_schema.dump(category)
        )
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to update category", str(e))


# ------------------------
# DELETE CATEGORY
# ------------------------
@category_bp.route("/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return base_response(404, False, "Category not found", None)

    try:
        category.delete()
        return base_response(200, True, "Category deleted successfully", None)
    except Exception as e:
        db.session.rollback()
        return base_response(500, False, "Failed to delete category", str(e))
