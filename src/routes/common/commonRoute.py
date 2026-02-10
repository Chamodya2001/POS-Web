from flask import Blueprint
from src.models.candidate.candidate_model import Candidate, CandidateSchema
from src.models.casior.casior_model import Casior, CasiorSchema
from src.models.category.category_model import Category, CategorySchema
from src.models.customer.customer_model import Customer, CustomerSchema
from src.models.item.item_model import Item, ItemSchema
from src.models.order.orderModel import OrderModel, OrderSchema
from src.models.order.OrderProcessModel import OrderProcessModel, OrderProcessSchema
from src.models.order.loan_model import Loan, LoanSchema
from src.models.item.stock_model import Stock, StockSchema
from src.models.item.supplier_model import Suplier, SuplierSchema
from src.helper.base_responce import base_response
from ...utils.namespace import NameSpace

candidate_full_bp = Blueprint(NameSpace.CANDIDATE_FULL_BP, __name__)

# Schemas
candidate_schema = CandidateSchema()               # single object
casior_schema = CasiorSchema(many=True)           # list
category_schema = CategorySchema(many=True)       # list
customer_schema = CustomerSchema(many=True)       # list
item_schema = ItemSchema(many=True)               # list
order_schema = OrderSchema(many=True)             # list of orders
order_process_schema_single = OrderProcessSchema()  # single order process object
loan_schema = LoanSchema(many=True)               # list of loans
stock_schema = StockSchema(many=True)             # list of stocks
supplier_schema = SuplierSchema(many=True)     # list of suppliers


@candidate_full_bp.route("/full-data/<int:candidate_id>", methods=["GET"])
def get_candidate_full_data(candidate_id):
    try:
        # -------------------------
        # Fetch candidate
        # -------------------------
        candidate = Candidate.query.get(candidate_id)
        if not candidate:
            return base_response(404, False, "Candidate not found", None)

        # -------------------------
        # Fetch related entities
        # -------------------------
        casiors = Casior.query.filter_by(candidate_id=candidate_id).all()
        categories = Category.query.filter_by(candidate_id=candidate_id).all()
        customers = Customer.query.filter_by(candidate_id=candidate_id).all()
        items = Item.query.filter_by(candidate_id=candidate_id).all()
        stocks = Stock.query.filter_by(candidate_id=candidate_id).all()
        suppliers = Suplier.query.filter_by(candidate_id=candidate_id).all()
        loan = Loan.query.filter_by(candidate_id=candidate_id).all()

        # -------------------------
        # Fetch order processes and orders
        # -------------------------
        order_processes = OrderProcessModel.query.filter_by(
            candidate_id=candidate_id
        ).order_by(OrderProcessModel.created_at.desc()).all()

        orders_data = []

        for op in order_processes:
            order_items = OrderModel.query.filter_by(order_process_id=op.order_process_id).all()
            orders_data.append({
                "order_process": order_process_schema_single.dump(op),  # single object
                "items": order_schema.dump(order_items)                 # many=True already in schema
            })

        # -------------------------
        # Response
        # -------------------------
        return base_response(
            200,
            True,
            "Candidate full data retrieved successfully",
            {
                "candidate": candidate_schema.dump(candidate),
                "casiors": casior_schema.dump(casiors),
                "categories": category_schema.dump(categories),
                "customers": customer_schema.dump(customers),
                "items": item_schema.dump(items),
                "orders": orders_data,
                "stocks": stock_schema.dump(stocks),
                "suppliers": supplier_schema.dump(suppliers),
                "loans": loan_schema.dump(loan)
            }
        )

    except Exception as e:
        return base_response(
            500,
            False,
            "Failed to retrieve candidate full data",
            str(e)
        )
