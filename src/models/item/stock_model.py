from src.utils.extensions import db
from sqlalchemy import func
from marshmallow import Schema, fields, ValidationError, validates_schema
from src.utils.namespace import NameSpace


class Stock(db.Model):
    __tablename__ = NameSpace.STOCK_TABLE
    __table_args__ = {"schema": NameSpace.ITEM_SCHEMA}

    stock_id = db.Column(db.Integer, primary_key=True)

    candidate_id = db.Column(
        db.Integer,
        db.ForeignKey("candidate.candidate.candidate_id"),
        nullable=False
    )

    item_id = db.Column(
        db.Integer,
        db.ForeignKey("item.item.item_id"),
        nullable=False
    )

    suplier_id = db.Column(
        db.Integer,
        db.ForeignKey("item.suplier.suplier_id"),
        nullable=False
    )

    stoke_quantity = db.Column(db.Float)
    current_quantity = db.Column(db.Float)
    additional_notes = db.Column(db.Text)

    received_date = db.Column(db.Date)

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
        return f"<Stock {self.stock_id}>"


class StockSchema(Schema):
    stock_id = fields.Int(dump_only=True)

    candidate_id = fields.Int(required=True)
    item_id = fields.Int(required=True)
    suplier_id = fields.Int(required=True)

    stoke_quantity = fields.Float(allow_none=True)
   
    additional_notes = fields.Str(allow_none=True)

    received_date = fields.Date(allow_none=True)

    status_id = fields.Int(allow_none=True)

    create_at = fields.DateTime(dump_only=True)
    ubdate_at = fields.DateTime(dump_only=True)

  