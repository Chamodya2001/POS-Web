from sqlite3 import Date
from sqlalchemy import func,Date
from src.utils.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from ...utils.namespace import NameSpace
from marshmallow import Schema, fields, validates_schema, ValidationError
from sqlalchemy.dialects.postgresql import ARRAY

class Casior(db.Model):
    __tablename__ = NameSpace.EMPLOYE_TABLE
    __table_args__ = {"schema": NameSpace.EMPLOYE_SCHEMA}

    employe_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    candidate_id = db.Column(
        db.Integer,
        db.ForeignKey("candidate.candidate.candidate_id"),
        nullable=False
    )
    shop_id = db.Column(db.String(128), nullable=False)
    
    first_name = db.Column(db.String(128))
    last_name = db.Column(db.String(128))
    nic = db.Column(db.String(12), nullable=False)
    dob = db.Column(Date, nullable=True)
    phone_number = db.Column(ARRAY(db.BigInteger), nullable=False)
    address = db.Column(db.String(256))
    district = db.Column(db.String(128))
    province = db.Column(db.String(128))
    town = db.Column(db.String(128))
    
    shop_name = db.Column(db.String(128))
    gender_id = db.Column(db.Integer, nullable=False)
    language_id = db.Column(db.Integer, nullable=False)
    
    
    
    email = db.Column(db.String(256), nullable=False)
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
        return f"<Casior {self.employe_id} - {self.email}>"



class CasiorSchema(Schema):
    employe_id = fields.Int(dump_only=True)
    candidate_id = fields.Int(required=True)
    shop_id = fields.Str(required=True)
    
    first_name = fields.Str()
    last_name = fields.Str()
    nic = fields.Str(required=True)
    dob = fields.Date(allow_none=True)
    phone_number = fields.List(fields.Int(), required=True)
    
    address = fields.Str()
    district = fields.Str()
    province = fields.Str()
    town = fields.Str()
    
    language_id = fields.Int(required=True)
    gender_id = fields.Int(required=True)
    status_id = fields.Int(required=True)
   
    shop_name = fields.Str()
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    status_id = fields.Int(required=True)
   

    
