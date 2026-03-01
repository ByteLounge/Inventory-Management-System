from app.models.user import db, generate_uuid
from datetime import datetime


class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    warehouse_id = db.Column(db.String(36), db.ForeignKey('warehouses.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=0)
    reserved_quantity = db.Column(db.Integer, nullable=False, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Prevent negative inventory at DB level
    __table_args__ = (
        db.CheckConstraint('quantity >= 0', name='check_positive_quantity'),
        db.UniqueConstraint('product_id', 'warehouse_id', name='uq_product_warehouse')
    )

class InventoryMovement(db.Model):
    __tablename__ = 'inventory_movements'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    product_id = db.Column(db.String(36), db.ForeignKey('products.id'), nullable=False)
    warehouse_id = db.Column(db.String(36), db.ForeignKey('warehouses.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    movement_type = db.Column(db.String(20), nullable=False) # IN, OUT, TRANSFER, ADJUSTMENT
    quantity = db.Column(db.Integer, nullable=False) # Can be negative for OUT
    reference_id = db.Column(db.String(100)) # Order ID, Transfer ID, etc
    notes = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
