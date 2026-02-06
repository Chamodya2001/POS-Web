from src.utils.extensions import db
from sqlalchemy import func
from marshmallow import Schema, fields, ValidationError, validates_schema
from ...utils.namespace import NameSpace


class Suplier(db.Model):
    __tablename__ = "suplier"
    __table_args__ = {"schema": "item"}

    suplier_id = db.Column(
        db.Integer,
        primary_key=True
    )

    candidate_id = db.Column(
        db.Integer,
        db.ForeignKey("candidate.candidate.candidate_id"),
        nullable=False
    )

    company_name = db.Column(db.String)
    contact_person_name = db.Column(db.String)
    email = db.Column(db.String)

    # PostgreSQL array field
    phone = db.Column(db.ARRAY(db.String))

    address = db.Column(db.String)

    status_id = db.Column(db.Integer, nullable=True)

    create_at = db.Column(db.DateTime, default=func.now())
    ubdate_at = db.Column(db.DateTime, onupdate=func.now())

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
        return f"<Suplier {self.suplier_id}>"


class SuplierSchema(Schema):
    suplier_id = fields.Int(dump_only=True)

    candidate_id = fields.Int(required=True)

    company_name = fields.Str(allow_none=True)
    contact_person_name = fields.Str(allow_none=True)
    email = fields.Email(allow_none=True)

    phone = fields.List(fields.Str(), allow_none=True)

    address = fields.Str(allow_none=True)

    status_id = fields.Int(allow_none=True)

    create_at = fields.DateTime(dump_only=True)
    ubdate_at = fields.DateTime(dump_only=True)

    @validates_schema
    def validate_fields(self, data, **kwargs):
        if data.get("company_name") and len(data["company_name"]) < 2:
            raise ValidationError(
                "Company name must be at least 2 characters",
                "company_name"
            )
