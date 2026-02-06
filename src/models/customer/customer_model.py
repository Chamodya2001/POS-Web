from src.utils.extensions import db
from sqlalchemy import func
from marshmallow import Schema, fields, ValidationError, validates_schema
from ...utils.namespace import NameSpace

class Customer(db.Model):
    __tablename__ = NameSpace.CUSTOMER_TABLE
    __table_args__ = {"schema": NameSpace.CUSTOMER_SCHEMA}

    customer_id = db.Column(db.Integer, primary_key=True)
    employe_id = db.Column(
        db.Integer,
        db.ForeignKey("casior.casior.employe_id"),
        nullable=False
    )
    candidate_id = db.Column(
        db.Integer,
        db.ForeignKey("candidate.candidate.candidate_id"),
        nullable=False
    )

    first_name = db.Column(db.String(128), nullable=False)
    last_name = db.Column(db.String)
    email = db.Column(db.String)
    phone_number = db.Column(db.String)
    address = db.Column(db.String)
    nic = db.Column(db.String, nullable=False)

    create_at = db.Column(db.DateTime, default=func.now())
    update_at = db.Column(db.DateTime, onupdate=func.now())

    status_id = db.Column( db.Integer, nullable=True)

    # ------------------ helpers ------------------

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<Customer {self.customer_id}>"



class CustomerSchema(Schema):
    customer_id = fields.Int(dump_only=True)

    employe_id = fields.Int(required=True)
    candidate_id = fields.Int(required=True)

    first_name = fields.Str(required=True)
    last_name = fields.Str(allow_none=True)
    email = fields.Email(allow_none=True)
    phone_number = fields.Str(allow_none=True)
    address = fields.Str(allow_none=True)
    nic = fields.Str(required=True)

    create_at = fields.DateTime(dump_only=True)
    update_at = fields.DateTime(dump_only=True)

    status_id = fields.Int(allow_none=True)

    @validates_schema
    def validate_names(self, data, **kwargs):
        if len(data.get("first_name", "")) < 2:
            raise ValidationError(
                "First name must be at least 2 characters",
                "first_name"
            )
