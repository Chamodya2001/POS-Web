from utils.extensions import db
from sqlalchemy import Column, Integer, String

class Gender(db.Model):
    __tablename__ = "gender"
    __table_args__ = {"schema": "common"}

    gender_id = Column(Integer, primary_key=True)
    gender = Column(String, nullable=False)
    ref_id = Column(Integer, nullable=False)

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
        return f"<Gender {self.gender_id}: {self.gender}>"


from marshmallow import Schema, fields

class GenderSchema(Schema):
    gender_id = fields.Int(dump_only=True)
    gender = fields.Str(required=True)
    ref_id = fields.Int(required=True)
