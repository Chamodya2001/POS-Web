from sqlalchemy import func
from src.utils.extensions import db
from marshmallow import Schema, fields, validates_schema, ValidationError
from ...utils.namespace import NameSpace

# ------------------------
# Category Model
# ------------------------
class Category(db.Model):
    __tablename__ = NameSpace.CATEGORY_TABLE
    __table_args__ = {"schema":NameSpace.CATEGORY_SCHEMA}

    category_id = db.Column(
        db.Integer,
        primary_key=True,
        # autoincrement=True,
        # default=db.Sequence('category.category_category_id_seq')
    )
    candidate_id = db.Column(
        db.Integer,
        db.ForeignKey("candidate.candidate.candidate_id"),
        nullable=False
    )
    category_name = db.Column(db.String(128), nullable=False)
    discription = db.Column(db.String(256))
    image_code = db.Column(db.String(512))
    create_at = db.Column(db.DateTime, nullable=True, default=func.now())
    update_at = db.Column(db.DateTime, nullable=True, onupdate=func.now())
    status_id = db.Column(db.Integer, nullable=True)

    # Relationship (optional)
    candidate = db.relationship("Candidate", backref="categories")

    # ---------- CRUD ----------
    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<Category {self.category_id} - {self.category_name}>"

# ------------------------
# Category Schema
# ------------------------
class CategorySchema(Schema):
    category_id = fields.Int(dump_only=True)
    candidate_id = fields.Int(required=True)
    category_name = fields.Str(required=True)
    discription = fields.Str(allow_none=True)
    image_code = fields.Str(allow_none=True)
    create_at = fields.DateTime(dump_only=True)
    update_at = fields.DateTime(dump_only=True)
    status_id = fields.Int(allow_none=True)

    @validates_schema
    def validate_category_name(self, data, **kwargs):
        name = data.get("category_name", "")
        if name.strip() == "":
            raise ValidationError("Category name cannot be empty.", field_name="category_name")

