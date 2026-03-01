from functools import wraps
from flask import request, jsonify
import jwt
import os
from app.models.user import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
                
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
            
        try:
            data = jwt.decode(
                token, 
                os.getenv('JWT_SECRET_KEY', 'dev-secret-key'), 
                algorithms=['HS256']
            )
            current_user = User.query.get(data['sub'])
            if not current_user or not current_user.is_active:
                return jsonify({'error': 'Invalid token or inactive user'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
            
        return f(current_user, *args, **kwargs)
        
    return decorated

def require_role(roles):
    """
    roles: List of allowed roles, e.g., ['super_admin', 'company_admin']
    """
    def decorator(f):
        @wraps(f)
        def decorated(current_user, *args, **kwargs):
            if current_user.role not in roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(current_user, *args, **kwargs)
        return decorated
    return decorator
