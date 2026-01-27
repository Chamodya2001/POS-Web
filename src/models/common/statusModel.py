from utils.extensions import db
from sqlalchemy import Column, Integer, String

class Status(db.Model):
    __tablename__ = "status"
    __table_args__ = {"schema": "common"}

    status_id = Column(Integer, primary_key=True)
    status_name = Column(String(128), nullable=False)
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
        return f"<Status {self.status_id}: {self.status_name}>"


from marshmallow import Schema, fields

class StatusSchema(Schema):
    status_id = fields.Int(dump_only=True)
    status_name = fields.Str(required=True)
    ref_id = fields.Int(required=True)
