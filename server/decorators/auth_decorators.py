from functools import wraps
from flask import request, jsonify
from ..models import User
from ..utils import user_utils

def require_auth(allowed_roles=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user_id = user_utils.get_user_id_from_request()
            print('userrrrrrr id',user_id)
            if not user_id:
                return jsonify({'error': 'Unauthorized'}), 401

            user = User.query.get(user_id)
            if user is None:
                return jsonify({'error': 'User not found'}), 404

            if allowed_roles:
                print(user.role)
                if not any(role in user.role for role in allowed_roles):
                    return jsonify({'error': 'Access denied'}), 403

            return f(user_id, *args, **kwargs)

        return decorated_function
    return decorator
