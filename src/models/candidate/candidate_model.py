from src.utils.extensions import db
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import func, Date, Time, String, Integer, Column, BigInteger
from werkzeug.security import generate_password_hash, check_password_hash
from marshmallow import fields, Schema, ValidationError, validates_schema
from ...utils.namespace import NameSpace

class Candidate(db.Model):
    """
    Super Admin (Candidate) Model synced with candidate.candidate table.
    """
    __tablename__ = NameSpace.CANDIDATE_TABLE
    __table_args__ = {"schema": NameSpace.CANDIDATE_SCHEMA}

    candidate_id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    shop_id = Column(String(128), nullable=True) # DDL allows null
    first_name = Column(String(128))
    last_name = Column(String(128))
    dob = Column(Date, nullable=True)

    address = Column(String(256))
    district = Column(String(128))
    province = Column(String(128))
    town = Column(String) # DDL: character varying (no length)

    phone_number = Column(ARRAY(BigInteger), nullable=False)

    image_code = Column(String) # DDL: character varying
    nic = Column(String, nullable=False)

    language_id = Column(Integer, nullable=False)
    gender_id = Column(Integer, nullable=False)
    status_id = Column(Integer, nullable=False)

    shop_name = Column(String) # DDL: character varying
    casior_quantity = Column(Integer)

    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=True) # DDL allows null for initial setup

    # DDL: time without time zone
    last_login = Column(Time, nullable=True, server_default=func.now())
    created_at = Column(Time, nullable=True, server_default=func.now())

    # ---------- PASSWORD ----------
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        if not self.password_hash:
            return False
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
        return f"<Candidate {self.candidate_id} - {self.email}>"


class CandidateSchema(Schema):
    candidate_id = fields.Int(dump_only=True)
    shop_id = fields.Str()
    first_name = fields.Str()
    last_name = fields.Str()
    dob = fields.Date(allow_none=True)

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

    email = fields.Str(required=True)
    password = fields.Str(load_only=True) # Not strictly required for schema validation if partial

    last_login = fields.Time(dump_only=True)
    created_at = fields.Time(dump_only=True)

    @validates_schema
    def validate_phone_numbers(self, data, **kwargs):
        phones = data.get("phone_number", [])
        if phones and len(phones) != len(set(phones)):
            raise ValidationError(
                "Duplicate phone numbers are not allowed.",
                field_name="phone_number"
            )
