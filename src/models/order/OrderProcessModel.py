from sqlalchemy import func
from marshmallow import Schema, fields
from sqlalchemy.exc import SQLAlchemyError
from ...utils.namespace import NameSpace
from src.utils.extensions import db


# ===========================
# SQLAlchemy Model
# ===========================
class OrderProcessModel(db.Model):
    __tablename__ = NameSpace.ORDER_PROCESS_TABLE
    __table_args__ = {
        "schema": NameSpace.ORDER_SCHEMA,
        "extend_existing": True
    }

    order_process_id = db.Column(db.Integer, primary_key=True)

    candidate_id = db.Column(db.Integer, nullable=False)
    casior_id = db.Column(db.Integer, nullable=False)
    customer_id = db.Column(db.Integer, nullable=True)
    payment_method = db.Column(db.String(128))

    total_amount = db.Column(db.Float, nullable=True)
    status_id = db.Column(db.Integer, nullable=True)

    created_at = db.Column(db.DateTime, default=func.now())
    ubdated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now())
    
    loan_id = db.Column(db.Integer, nullable=True)

    # ---------------------------
    # Constructor
    # ---------------------------
    def __init__(self, data):
        for key in ['candidate_id', 'casior_id', 'customer_id', 'payment_method', 'total_amount', 'status_id', 'loan_id']:
            if key in data:
                setattr(self, key, data.get(key))
        
        if 'created_at' in data: self.created_at = data.get('created_at')
        if 'ubdated_at' in data: self.ubdated_at = data.get('ubdated_at')

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
    def get_by_id(order_process_id):
        return OrderProcessModel.query.filter_by(
            order_process_id=order_process_id
        ).first()

    # ---------------------------
    # Get all
    # ---------------------------
    @staticmethod
    def get_all():
        return OrderProcessModel.query.order_by(
            OrderProcessModel.created_at.desc()
        ).all()


class OrderProcessSchema(Schema):
    order_process_id = fields.Int(dump_only=True)

    candidate_id = fields.Int(required=True)
    casior_id = fields.Int(required=True)
    customer_id = fields.Int(required=False, allow_none=True)
    payment_method = fields.Str(required=True)

    total_amount = fields.Float(required=False, allow_none=True)
    status_id = fields.Int(required=False, allow_none=True)

    created_at = fields.DateTime(dump_only=True)
    ubdated_at = fields.DateTime(dump_only=True)
    
    loan_id = fields.Int(required=False, allow_none=True)
