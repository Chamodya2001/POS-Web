from src.utils.extensions import db
from sqlalchemy import func
from marshmallow import Schema, fields, ValidationError, validates_schema
from ...utils.namespace import NameSpace


class Loan(db.Model):
    __tablename__ = NameSpace.LOAN_TABLE
    __table_args__ = {"schema": NameSpace.ORDER_SCHEMA}

    loan_id = db.Column(
        db.Integer,
        primary_key=True
    )

    candidate_id = db.Column(
        db.Integer,
        db.ForeignKey("candidate.candidate.candidate_id"),
        nullable=False
    )

    customer_id = db.Column(
        db.Integer,
        db.ForeignKey("customer.customer.customer_id"),
        nullable=False
    )

    loan_balance = db.Column(db.Float)

    status_id = db.Column(db.Integer, nullable=True)

    created_at = db.Column(db.DateTime, default=func.now())
    ubdated_at = db.Column(db.DateTime, onupdate=func.now())

    # ------------------ helpers ------------------

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
        return f"<Loan {self.loan_id}>"
    
class LoanSchema(Schema):
    loan_id = fields.Int(dump_only=True)

    candidate_id = fields.Int(required=True)
    customer_id = fields.Int(required=True)

    loan_balance = fields.Float(allow_none=True)

    status_id = fields.Int(allow_none=True)

    created_at = fields.DateTime(dump_only=True)
    ubdated_at = fields.DateTime(dump_only=True)

    @validates_schema
    def validate_loan(self, data, **kwargs):
        balance = data.get("loan_balance")
        if balance is not None and balance < 0:
            raise ValidationError(
                "Loan balance cannot be negative",
                "loan_balance"
            )

