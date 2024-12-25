from functools import wraps
from flask import request, jsonify
from ..models import User, UserSession
from ..config import Config
import jwt as pyjwt
from datetime import datetime

def require_auth(allowed_roles=None):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            device_id = request.headers.get('X-Device-ID')

            if not auth_header or not device_id:
                return jsonify({'error': 'Missing authorization headers'}), 401

            try:
                token = auth_header.split(" ")[1]

                try:
                    payload = pyjwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
                except pyjwt.ExpiredSignatureError:
                    return jsonify({'error': 'Token has expired'}), 401
                except pyjwt.InvalidTokenError:
                    return jsonify({'error': 'Invalid token'}), 401

                if payload['device_id'] != device_id:
                    return jsonify({'error': 'Device ID mismatch'}), 401

                user = User.query.get(payload['user_id'])
                session = UserSession.query.filter_by(
                    user_id=payload['user_id'],
                    device_identifier=device_id,
                    is_active=True
                ).first()

                if not user or not session:
                    return jsonify({'error': 'Invalid session'}), 401

                if allowed_roles and not any(role in user.role for role in allowed_roles):
                    return jsonify({'error': 'Access denied'}), 403

                session.last_used = datetime.utcnow()
                session.last_ip = request.remote_addr

                return f(user.id, session, *args, **kwargs)

            except Exception as e:
                return jsonify({'error': f'Authentication failed: {str(e)}'}), 401

        return decorated_function
    return decorator