from app.models.user import db, generate_uuid
from datetime import datetime

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    contact_name = db.Column(db.String(100))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(50))
    address = db.Column(db.Text)
    lead_time_days = db.Column(db.Integer, default=7)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    products = db.relationship('SupplierProduct', backref='supplier', lazy=True)

class SupplierProduct(db.Model):
    __tablename__ = 'supplier_products'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    supplier_id = db.Column(db.String(36), db.ForeignKey('suppliers.id'), nullable=False)
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    supplier_sku = db.Column(db.String(100))
    cost = db.Column(db.Float, nullable=False) # Changed from Numeric
    min_order_quantity = db.Column(db.Integer, default=1)
    is_primary = db.Column(db.Boolean, default=False)
    
    __table_args__ = (
        db.UniqueConstraint('supplier_id', 'product_id', name='uq_supplier_product'),
    )
