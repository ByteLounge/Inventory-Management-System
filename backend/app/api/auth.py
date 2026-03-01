from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from app.models.user import db, User, Company
from app.models.activity import ActivityLog
import os

auth_bp = Blueprint('auth', __name__)

def create_token(user):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user.id,
        'company_id': user.company_id,
        'role': user.role
    }
    return jwt.encode(
        payload,
        os.getenv('JWT_SECRET_KEY', 'dev-secret-key'),
        algorithm='HS256'
    )

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 1. Basic validation
    required_fields = ['company_name', 'email', 'password', 'first_name', 'last_name']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 409
        
    try:
        # 2. Create Company
        new_company = Company(name=data['company_name'])
        db.session.add(new_company)
        db.session.flush() # Get the new company ID
        
        # 3. Create Admin User
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_user = User(
            company_id=new_company.id,
            email=data['email'],
            password_hash=hashed_password,
            first_name=data['first_name'],
            last_name=data['last_name'],
            role='company_admin'
        )
        db.session.add(new_user)
        db.session.flush()
        
        # 4. Log activity
        log = ActivityLog(
            company_id=new_company.id,
            user_id=new_user.id,
            action='Company Registered',
            entity_type='company',
            entity_id=new_company.id
        )
        db.session.add(log)
        
        db.session.commit()
        
        # 5. Generate token
        token = create_token(new_user)
        
        return jsonify({
            'message': 'Company registered successfully',
            'token': token,
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'role': new_user.role,
                'first_name': new_user.first_name,
                'company_id': new_company.id,
                'company_name': new_company.name
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
        
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    if not user.is_active:
        return jsonify({'error': 'Account is disabled'}), 403
        
    token = create_token(user)
    
    # Log login activity
    log = ActivityLog(
        company_id=user.company_id,
        user_id=user.id,
        action='User Logged In',
        entity_type='user',
        entity_id=user.id
    )
    db.session.add(log)
    db.session.commit()
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'role': user.role,
            'first_name': user.first_name,
            'company_id': user.company_id,
            'company_name': user.company.name
        }
    }), 200
