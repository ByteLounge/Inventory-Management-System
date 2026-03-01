from flask import Blueprint, request, jsonify
from app.models.warehouse import db, Warehouse
from app.utils.auth_middleware import token_required

warehouses_bp = Blueprint('warehouses', __name__)

@warehouses_bp.route('', methods=['GET'])
@token_required
def get_warehouses(current_user):
    warehouses = Warehouse.query.filter_by(company_id=current_user.company_id, is_active=True).all()
    return jsonify([{
        'id': w.id,
        'name': w.name,
        'location': w.location
    } for w in warehouses]), 200

@warehouses_bp.route('', methods=['POST'])
@token_required
def create_warehouse(current_user):
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
        
    try:
        new_warehouse = Warehouse(
            company_id=current_user.company_id,
            name=data['name'],
            location=data.get('location', '')
        )
        db.session.add(new_warehouse)
        db.session.commit()
        return jsonify({
            'message': 'Warehouse created',
            'warehouse': {
                'id': new_warehouse.id,
                'name': new_warehouse.name,
                'location': new_warehouse.location
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
