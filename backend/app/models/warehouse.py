from app.models.user import db, generate_uuid
from datetime import datetime

class Warehouse(db.Model):
    __tablename__ = 'warehouses'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    company_id = db.Column(db.String(36), db.ForeignKey('companies.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    inventory = db.relationship('Inventory', backref='warehouse', lazy=True)
    movements = db.relationship('InventoryMovement', backref='warehouse', lazy=True)
