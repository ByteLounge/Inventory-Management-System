from app.models.user import db, generate_uuid
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'product_categories'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=False)
    category_id = db.Column(db.String(36), db.ForeignKey('product_categories.id'))
    sku = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False, default=0.0) # Changed Numeric to Float for SQLite
    cost = db.Column(db.Float, nullable=False, default=0.0) # Changed Numeric to Float for SQLite
    min_stock_level = db.Column(db.Integer, default=10)
    image_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Adding unique constraint on company_id, sku
    __table_args__ = (
        db.UniqueConstraint('company_id', 'sku', name='uq_company_sku'),
    )
    
    category = db.relationship('Category', backref='products')
    inventory = db.relationship('Inventory', backref='product', lazy=True)
