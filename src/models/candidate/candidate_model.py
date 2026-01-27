from sqlite3 import Date
from xmlrpc.client import DateTime
from src.utils.extensions import db
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import func,Date, DateTime
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import fields, Schema, ValidationError, validates_schema
from ...utils.namespace import NameSpace


class Candidate(db.Model):
    __tablename__ = NameSpace.CANDIDATE_TABLE
    __table_args__ = {"schema": NameSpace.CANDIDATE_SCHEMA}

    candidate_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    shop_id = db.Column(db.String(128), nullable=False)

    first_name = db.Column(db.String(128))
    last_name = db.Column(db.String(128))
    dob = db.Column(Date, nullable=True)

    address = db.Column(db.String(256))
    district = db.Column(db.String(128))
    province = db.Column(db.String(128))
    town = db.Column(db.String(128))

    phone_number = db.Column(ARRAY(db.BigInteger), nullable=False)

    image_code = db.Column(db.String(128))
    nic = db.Column(db.String(12), nullable=False)

    # language_id = db.Column(
    #     db.Integer,
    #     db.ForeignKey("common.language.language_id"),
    #     nullable=False
    # )

    # gender_id = db.Column(
    #     db.Integer,
    #     db.ForeignKey("common.gender.gender_id"),
    #     nullable=False
    # )

    # status_id = db.Column(
    #     db.Integer,
    #     db.ForeignKey("common.status.status_id"),
    #     nullable=False
    # )
    language_id = db.Column(db.Integer, nullable=False)
    gender_id = db.Column(db.Integer, nullable=False)
    status_id = db.Column(db.Integer, nullable=False)

    shop_name = db.Column(db.String(128))
    casior_quantity = db.Column(db.Integer)

    user_name = db.Column(db.String(128), nullable=False, unique=True)
    password_hash = db.Column(db.String(256), nullable=False)

                       # for storing date of birth
    last_login = db.Column(DateTime, nullable=True)  # for last login timestamp
    created_at = db.Column(DateTime, nullable=True, default=func.now())


    # ---------- PASSWORD ----------
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

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
        return f"<Candidate {self.candidate_id}>"


class CandidateSchema(Schema):
    candidate_id = fields.Int(dump_only=True)

    shop_id = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()
    

    address = fields.Str()
    district = fields.Str()
    province = fields.Str()
    town = fields.Str()

    phone_number = fields.List(fields.Int(), required=True)

    image_code = fields.Str()
    nic = fields.Str(required=True)

    language_id = fields.Int(required=True)
    gender_id = fields.Int(required=True)
    status_id = fields.Int(required=True)

    shop_name = fields.Str()
    casior_quantity = fields.Int()

    user_name = fields.Str(required=True)
    password = fields.Str(load_only=True, required=True)


    dob = fields.Date(allow_none=True)
    


    @validates_schema
    def validate_phone_numbers(self, data, **kwargs):
        phones = data.get("phone_number", [])
        if len(phones) != len(set(phones)):
            raise ValidationError(
                "Duplicate phone numbers are not allowed.",
                field_name="phone_number"
            )
