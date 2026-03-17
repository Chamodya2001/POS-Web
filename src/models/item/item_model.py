from sqlalchemy import func
from src.utils.extensions import db
from marshmallow import Schema, fields, validates_schema, ValidationError
from ...utils.namespace import NameSpace

class Item(db.Model):
    __tablename__ = NameSpace.ITEM_TABLE
    __table_args__ = {"schema": NameSpace.ITEM_SCHEMA}

    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey("candidate.candidate.candidate_id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("category.category.category_id"), nullable=False)
    
    item_name = db.Column(db.String(256), nullable=False)
    sinhala_name = db.Column(db.String(512))
    description = db.Column(db.Text)
    bar_code = db.Column(db.String(512))
    sale_price = db.Column(db.Float, nullable=False)
    stoke_price = db.Column(db.Float, nullable=False)
    measurement_id = db.Column(db.Integer)
    discount = db.Column(db.Float)
    image_code = db.Column(db.String)
    low_stock_alert = db.Column(db.Float)
    create_at = db.Column(db.DateTime, default=func.now())
    update_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())
    status_id = db.Column(db.Integer, nullable=False)

    # Relationships
    candidate = db.relationship("Candidate", backref="items")
    category = db.relationship("Category", backref="items")

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

# ------------------------
# Marshmallow Schema
# ------------------------
class ItemSchema(Schema):
    item_id = fields.Int(dump_only=True)

    candidate_id = fields.Int(required=True)
    category_id = fields.Int(required=True)

    item_name = fields.Str(required=True)
    sinhala_name = fields.Str(allow_none=True)
    description = fields.Str()
    bar_code = fields.Str()

    sale_price = fields.Float(required=True)
    stoke_price = fields.Float(required=True)

    measurement_id = fields.Int()
    discount = fields.Float()
    image_code = fields.Str()
    low_stock_alert = fields.Float()

    create_at = fields.DateTime(dump_only=True)
    update_at = fields.DateTime(dump_only=True)

    status_id = fields.Int()


    @validates_schema
    def validate_prices(self, data, **kwargs):
        if data.get("sale_price", 0) < 0:
            raise ValidationError("Sale price must be >= 0.", field_name="sale_price")
        if data.get("stoke_price", 0) < 0:
            raise ValidationError("Stoke price must be >= 0.", field_name="stoke_price")


