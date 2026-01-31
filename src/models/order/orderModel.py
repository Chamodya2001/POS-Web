from sqlalchemy import func
from marshmallow import Schema, fields
from sqlalchemy.exc import SQLAlchemyError
from ...utils.namespace import NameSpace
from src.utils.extensions import db

# ===========================
# SQLAlchemy Model
# ===========================
class OrderModel(db.Model):
    __tablename__ = NameSpace.ORDER_TABLE
    __table_args__ = {
        "schema": NameSpace.ORDER_SCHEMA,
        "extend_existing": True
    }

    order_id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, nullable=False)
    order_process_id = db.Column(db.Integer, nullable=False)
    item_id = db.Column(db.Integer, nullable=False)

    item_name = db.Column(db.String)
    price = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float)
    quantity = db.Column(db.Float)

    create_at = db.Column(db.DateTime, default=func.now())
    ubdate_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())

    # ---------------------------
    # Constructor
    # ---------------------------
    def __init__(self, data):
        self.order_id = data.get("order_id")
        self.candidate_id = data.get("candidate_id")
        self.order_process_id = data.get("order_process_id")
        self.item_id = data.get("item_id")
        self.item_name = data.get("item_name")
        self.price = data.get("price")
        self.discount = data.get("discount")
        self.quantity = data.get("quantity")
        self.create_at = data.get("create_at")
        self.ubdate_at = data.get("ubdate_at")

    # ---------------------------
    # Save
    # ---------------------------
    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
            return self
        except SQLAlchemyError:
            db.session.rollback()
            raise

    # ---------------------------
    # Update
    # ---------------------------
    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()
        return self

    # ---------------------------
    # Delete
    # ---------------------------
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    # ---------------------------
    # Get by ID
    # ---------------------------
    @staticmethod
    def get_by_id(order_id):
        return OrderModel.query.filter_by(order_id=order_id).first()

    # ---------------------------
    # Get all orders
    # ---------------------------
    @staticmethod
    def get_all():
        return OrderModel.query.order_by(OrderModel.create_at.desc()).all()


class OrderSchema(Schema):
    order_id = fields.Int(dump_only=True)
    candidate_id = fields.Int(required=True)
    order_process_id = fields.Int(required=True)
    item_id = fields.Int(required=True)

    item_name = fields.Str(required=False, allow_none=True)
    price = fields.Float(required=True)
    discount = fields.Float(required=False, allow_none=True)
    quantity = fields.Float(required=False, allow_none=True)
   


