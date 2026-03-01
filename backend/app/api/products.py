from flask import Blueprint, request, jsonify
from app.models.product import db, Product, Category
from app.utils.auth_middleware import token_required

products_bp = Blueprint('products', __name__)

@products_bp.route('/categories', methods=['GET'])
@token_required
def get_categories(current_user):
    categories = Category.query.filter_by(company_id=current_user.company_id).all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'description': c.description
    } for c in categories]), 200

@products_bp.route('/categories', methods=['POST'])
@token_required
def create_category(current_user):
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'Category name is required'}), 400
        
    try:
        new_category = Category(
            company_id=current_user.company_id,
            name=data['name'],
            description=data.get('description', '')
        )
        db.session.add(new_category)
        db.session.commit()
        return jsonify({
            'message': 'Category created',
            'category': {
                'id': new_category.id,
                'name': new_category.name,
                'description': new_category.description
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@products_bp.route('', methods=['GET'])
@token_required
def get_products(current_user):
    products = Product.query.filter_by(company_id=current_user.company_id, is_active=True).all()
    return jsonify([{
        'id': p.id,
        'sku': p.sku,
        'name': p.name,
        'category_id': p.category_id,
        'category_name': p.category.name if p.category else None,
        'price': float(p.price),
        'cost': float(p.cost),
        'min_stock_level': p.min_stock_level
    } for p in products]), 200

@products_bp.route('', methods=['POST'])
@token_required
def create_product(current_user):
    data = request.get_json()
    required_fields = ['sku', 'name', 'price', 'cost']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields (sku, name, price, cost)'}), 400
        
    if Product.query.filter_by(company_id=current_user.company_id, sku=data['sku']).first():
        return jsonify({'error': 'Product with this SKU already exists'}), 409
        
    try:
        new_product = Product(
            company_id=current_user.company_id,
            category_id=data.get('category_id'),
            sku=data['sku'],
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            cost=data['cost'],
            min_stock_level=data.get('min_stock_level', 10)
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({
            'message': 'Product created',
            'product': {
                'id': new_product.id,
                'sku': new_product.sku,
                'name': new_product.name
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
