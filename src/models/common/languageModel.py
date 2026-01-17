from utils.extensions import db
from sqlalchemy import Column, Integer, String

class Language(db.Model):
    __tablename__ = "language"
    __table_args__ = {"schema": "common"}

    language_id = Column(Integer, primary_key=True)
    language = Column(String, nullable=False)
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
        return f"<Language {self.language_id}: {self.language}>"

from marshmallow import Schema, fields

class LanguageSchema(Schema):
    language_id = fields.Int(dump_only=True)
    language = fields.Str(required=True)
    ref_id = fields.Int(required=True)
