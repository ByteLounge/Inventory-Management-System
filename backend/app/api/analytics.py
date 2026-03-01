from flask import Blueprint, jsonify
from app.models.product import db, Product
from app.models.inventory import Inventory
from app.models.warehouse import Warehouse
from app.models.sale import Sale
from app.utils.auth_middleware import token_required
from sqlalchemy import func
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/overview', methods=['GET'])
@token_required
def get_overview(current_user):
    company_id = current_user.company_id
    
    # Total Products
    total_products = Product.query.filter_by(company_id=company_id, is_active=True).count()
    
    # Total Warehouses
    total_warehouses = Warehouse.query.filter_by(company_id=company_id, is_active=True).count()
    
    # Total Inventory Value (Price * Quantity)
    inventory_items = db.session.query(
        func.sum(Product.price * Inventory.quantity)
    ).join(Inventory, Product.id == Inventory.product_id)\
     .filter(Product.company_id == company_id).scalar() or 0
     
    # Low Stock Items
    low_stock_count = db.session.query(Product).join(Inventory).filter(
        Product.company_id == company_id,
        Inventory.quantity <= Product.min_stock_level
    ).count()
    
    # Monthly Sales (Last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    monthly_sales = db.session.query(
        func.sum(Sale.total_amount)
    ).filter(
        Sale.company_id == company_id,
        Sale.created_at >= thirty_days_ago,
        Sale.status == 'COMPLETED'
    ).scalar() or 0

    return jsonify({
        'totalProducts': total_products,
        'totalWarehouses': total_warehouses,
        'inventoryValue': float(inventory_items),
        'lowStockItems': low_stock_count,
        'monthlySales': float(monthly_sales)
    }), 200

@analytics_bp.route('/low-stock', methods=['GET'])
@token_required
def get_low_stock_alerts(current_user):
    company_id = current_user.company_id
    
    low_stock_items = db.session.query(
        Product, Inventory, Warehouse
    ).join(
        Inventory, Product.id == Inventory.product_id
    ).join(
        Warehouse, Inventory.warehouse_id == Warehouse.id
    ).filter(
        Product.company_id == company_id,
        Inventory.quantity <= Product.min_stock_level
    ).all()
    
    return jsonify([{
        'product_id': p.id,
        'sku': p.sku,
        'name': p.name,
        'warehouse_name': w.name,
        'current_stock': i.quantity,
        'min_stock_level': p.min_stock_level,
    } for p, i, w in low_stock_items]), 200
