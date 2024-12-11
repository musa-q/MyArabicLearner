from functools import wraps
from flask import request, jsonify
from ..models import User
from ..utils import user_utils

def require_auth(allowed_roles=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user, session = user_utils.get_user_session_from_request()

            if not user or not session:
                return jsonify({'error': 'Unauthorized'}), 401

            if allowed_roles:
                if not any(role in user.role for role in allowed_roles):
                    return jsonify({'error': 'Access denied'}), 403

            session.update_activity(request.remote_addr)

            return f(user.id, session, *args, **kwargs)

        return decorated_function
    return decorator