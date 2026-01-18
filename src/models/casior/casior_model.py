from sqlalchemy import func
from src.utils.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from ...utils.namespace import NameSpace
from marshmallow import Schema, fields, validates_schema, ValidationError


class Casior(db.Model):
    __tablename__ = NameSpace.CASIOR_TABLE
    __table_args__ = {"schema": NameSpace.CASIOR_SCHEMA}

    casior_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    candidate_id = db.Column(
        db.Integer,
        db.ForeignKey("candidate.candidate.candidate_id"),
        nullable=False
    )
    shop_id = db.Column(db.String(128), nullable=False)
    machine_model_number = db.Column(db.String(256), nullable=False)
    shop_name = db.Column(db.String(128))
    user_name = db.Column(db.String(256), nullable=False)
    password = db.Column(db.String(256), nullable=False)
    create_at = db.Column(db.DateTime, default=func.now())
    update_at = db.Column(db.DateTime, onupdate=func.now())
    status_id = db.Column(db.Integer, nullable=False)

    # Relationship
    candidate = db.relationship("Candidate", backref="casiors")

    # ---------- PASSWORD ----------
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    # ---------- CRUD ----------
    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self, data):
        for key, value in data.items():
            if key == "password":
                self.set_password(value)
            elif hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<Casior {self.casior_id} - {self.user_name}>"



class CasiorSchema(Schema):
    casior_id = fields.Int(dump_only=True)
    candidate_id = fields.Int(required=True)
    shop_id = fields.Str(required=True)
    machine_model_number = fields.Str(required=True)
    shop_name = fields.Str()
    user_name = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    status_id = fields.Int(required=True)
    # create_at = fields.DateTime(dump_only=True)
    # update_at = fields.DateTime(dump_only=True)

    @validates_schema
    def validate_fields(self, data, **kwargs):
        if not data.get("machine_model_number"):
            raise ValidationError(
                "Machine model number is required.",
                field_name="machine_model_number"
            )
