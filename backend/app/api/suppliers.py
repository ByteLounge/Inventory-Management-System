from flask import Blueprint, request, jsonify
from app.models.supplier import db, Supplier
from app.utils.auth_middleware import token_required

suppliers_bp = Blueprint('suppliers', __name__)

@suppliers_bp.route('', methods=['GET'])
@token_required
def get_suppliers(current_user):
    suppliers = Supplier.query.filter_by(company_id=current_user.company_id, is_active=True).all()
    return jsonify([{
        'id': s.id,
        'name': s.name,
        'contact_name': s.contact_name,
        'email': s.email,
        'phone': s.phone,
        'lead_time_days': s.lead_time_days
    } for s in suppliers]), 200

@suppliers_bp.route('', methods=['POST'])
@token_required
def create_supplier(current_user):
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'Supplier name is required'}), 400
        
    try:
        new_supplier = Supplier(
            company_id=current_user.company_id,
            name=data['name'],
            contact_name=data.get('contact_name'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address'),
            lead_time_days=data.get('lead_time_days', 7)
        )
        db.session.add(new_supplier)
        db.session.commit()
        return jsonify({
            'message': 'Supplier created',
            'supplier': {
                'id': new_supplier.id,
                'name': new_supplier.name
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
