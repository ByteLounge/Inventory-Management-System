from flask import Blueprint, request, jsonify
from app.models.sale import db, Sale, SaleItem
from app.models.inventory import Inventory, InventoryMovement
from app.models.product import Product
from app.models.activity import ActivityLog
from app.utils.auth_middleware import token_required
from datetime import datetime

sales_bp = Blueprint('sales', __name__)

@sales_bp.route('', methods=['GET'])
@token_required
def get_sales(current_user):
    sales = Sale.query.filter_by(company_id=current_user.company_id).order_by(Sale.created_at.desc()).limit(100).all()
    return jsonify([{
        'id': s.id,
        'total_amount': float(s.total_amount),
        'status': s.status,
        'created_at': s.created_at.isoformat()
    } for s in sales]), 200

@sales_bp.route('', methods=['POST'])
@token_required
def create_sale(current_user):
    data = request.get_json()
    required = ['warehouse_id', 'items']
    if not all(field in data for field in required):
        return jsonify({'error': 'Missing required fields'}), 400
        
    items = data['items']
    if not items or len(items) == 0:
        return jsonify({'error': 'Sale must have items'}), 400
        
    try:
        # Create Sale Record
        new_sale = Sale(
            company_id=current_user.company_id,
            user_id=current_user.id,
            warehouse_id=data['warehouse_id'],
            total_amount=0,
            status='COMPLETED'
        )
        db.session.add(new_sale)
        db.session.flush() # get ID
        
        total_sale_amount = 0
        
        for item in items:
            product_id = item['product_id']
            qty = int(item['quantity'])
            
            product = Product.query.filter_by(id=product_id, company_id=current_user.company_id).first()
            if not product:
                return jsonify({'error': f'Product ID {product_id} not found'}), 404
                
            inventory = Inventory.query.filter_by(product_id=product_id, warehouse_id=data['warehouse_id']).first()
            if not inventory or inventory.quantity < qty:
                return jsonify({'error': f'Insufficient stock for product {product.name}'}), 400
                
            # Reduce inventory
            inventory.quantity -= qty
            
            # Record Movement
            movement = InventoryMovement(
                product_id=product_id,
                warehouse_id=data['warehouse_id'],
                user_id=current_user.id,
                movement_type='OUT',
                quantity=qty,
                reference_id=new_sale.id,
                notes='Sale'
            )
            db.session.add(movement)
            
            # Add Sale Item
            unit_price = float(product.price)
            subtotal = unit_price * qty
            total_sale_amount += subtotal
            
            sale_item = SaleItem(
                sale_id=new_sale.id,
                product_id=product_id,
                quantity=qty,
                unit_price=unit_price,
                subtotal=subtotal
            )
            db.session.add(sale_item)
            
        new_sale.total_amount = total_sale_amount
        
        log = ActivityLog(
            company_id=current_user.company_id,
            user_id=current_user.id,
            action='Sale Created',
            entity_type='sale',
            entity_id=new_sale.id,
            details={'total_amount': float(total_sale_amount)}
        )
        db.session.add(log)
        
        db.session.commit()
        return jsonify({
            'message': 'Sale completed',
            'sale_id': new_sale.id
        }), 201
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
