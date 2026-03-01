from flask import Blueprint, request, jsonify
from app.models.inventory import db, Inventory, InventoryMovement
from app.models.product import Product
from app.models.activity import ActivityLog
from app.utils.auth_middleware import token_required

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/<warehouse_id>', methods=['GET'])
@token_required
def get_inventory(current_user, warehouse_id):
    items = Inventory.query.join(Product).filter(
        Inventory.warehouse_id == warehouse_id,
        Product.company_id == current_user.company_id
    ).all()
    
    return jsonify([{
        'id': i.id,
        'product_id': i.product_id,
        'product_sku': i.product.sku,
        'product_name': i.product.name,
        'quantity': i.quantity,
        'reserved_quantity': i.reserved_quantity
    } for i in items]), 200

@inventory_bp.route('/move', methods=['POST'])
@token_required
def move_inventory(current_user):
    data = request.get_json()
    required = ['product_id', 'warehouse_id', 'type', 'quantity']
    if not all(field in data for field in required):
        return jsonify({'error': 'Missing required fields'}), 400
        
    try:
        # Verify product belongs to company
        product = Product.query.filter_by(id=data['product_id'], company_id=current_user.company_id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
            
        inventory = Inventory.query.filter_by(
            product_id=data['product_id'], 
            warehouse_id=data['warehouse_id']
        ).first()
        
        if not inventory:
            inventory = Inventory(
                product_id=data['product_id'],
                warehouse_id=data['warehouse_id'],
                quantity=0
            )
            db.session.add(inventory)
            
        quantity_change = int(data['quantity'])
        if data['type'] == 'OUT':
            if inventory.quantity < quantity_change:
                return jsonify({'error': 'Insufficient inventory'}), 400
            inventory.quantity -= quantity_change
        elif data['type'] == 'IN':
            inventory.quantity += quantity_change
            
        movement = InventoryMovement(
            product_id=data['product_id'],
            warehouse_id=data['warehouse_id'],
            user_id=current_user.id,
            movement_type=data['type'],
            quantity=quantity_change,
            notes=data.get('notes')
        )
        db.session.add(movement)
        
        log = ActivityLog(
            company_id=current_user.company_id,
            user_id=current_user.id,
            action=f"Inventory {data['type']}",
            entity_type='inventory',
            entity_id=inventory.id,
            details={'quantity': quantity_change}
        )
        db.session.add(log)
        
        db.session.commit()
        return jsonify({'message': 'Inventory updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
