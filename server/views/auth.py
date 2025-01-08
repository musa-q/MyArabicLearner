from flask import Blueprint, request, jsonify, current_app
from ..models import db, User, UserSession
from ..utils import user_utils
from datetime import datetime, timedelta
from ..config import Config
from ..decorators import require_auth
import secrets
import smtplib
from email.mime.text import MIMEText
import uuid
from user_agents import parse
import ipaddress
from argon2 import PasswordHasher
import jwt as pyjwt
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)
def generate_secure_token():
    return secrets.token_urlsafe(16).replace('-', 'g').replace('_', '9')

def send_auth_email(email, token):
    # if (Config.RUN_IN_DEVELOPMENT):
    #     print(f"Login token: {token}")
    #     return
    sender_email = Config.EMAIL
    password = Config.EMAIL_PASSWORD

    subject = "Login Token - My Arabic Learner"

    html_content = f"""
    <html>
        <body style="font-family: sans-serif;">
            <img src="https://www.myarabiclearner.com/myarabiclearner_logo.png" width="100" alt="My Arabic Learner Logo" style="display: block; margin: 30px auto;">
            <h2 style="text-align: center; color: #2E86C1;">Your Login Token</h2>
            <p style="text-align: center;">
                Your login token is valid for 15 minutes. Do NOT share this with anyone.
                <h3 style="color: #2E86C1; font-weight: bold; text-align: center;">{token}</h3>
            </p>
            <p style="text-align: center;">
                If you did not request this login, please ignore this email.
            </p>
            <br>
            <p style="text-align: center;">
                Best regards,<br>
                The My Arabic Learner Team
            </p>
        </body>
    </html>
    """

    msg = MIMEText(html_content, "html")
    msg['Subject'] = subject
    msg['From'] = sender_email
    msg['To'] = email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, email, msg.as_string())

def get_device_info():
    user_agent = request.headers.get('User-Agent', '')
    user_agent_info = parse(user_agent)

    return {
        'device_type': user_agent_info.device.family,
        'device_name': f"{user_agent_info.browser.family} on {user_agent_info.os.family}"
    }

def get_client_ip():
    if request.headers.get('X-Forwarded-For'):
        ip = request.headers.get('X-Forwarded-For').split(',')[0]
    else:
        ip = request.remote_addr
    return ip

ph = PasswordHasher()

def hash_token(token):
    return ph.hash(token)

def verify_token(stored_hash, provided_token):
    try:
        ph.verify(stored_hash, provided_token)
        return True
    except:
        return False


def generate_jwt_token(user_id, device_id, exp_minutes=30):
    payload = {
        'user_id': user_id,
        'device_id': device_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(minutes=exp_minutes),
        'jti': secrets.token_urlsafe(16)
    }
    return pyjwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

def is_suspicious_device(device_id):
    if not device_id:
        return True

    if device_id in Config.BLOCKED_DEVICE_IDS:
        return True

    recent_sessions = UserSession.query.filter(
        UserSession.device_identifier == device_id,
        UserSession.last_used >= datetime.now() - timedelta(hours=24)
    ).count()

    if recent_sessions > Config.MAX_SESSIONS_PER_DEVICE_PER_DAY:
        return True

    return False

def is_suspicious_ip(ip_address):
    if not ip_address:
        return True

    try:
        ip = ipaddress.ip_address(ip_address)

        if Config.RUN_IN_DEVELOPMENT:
            if ip_address in ['127.0.0.1', '::1']:
                return False

            if ip.is_private:
                return False

        if ip_address in Config.BLOCKED_IPS:
            return True

        recent_requests = UserSession.query.filter(
            UserSession.last_ip == ip_address,
            UserSession.last_used >= datetime.now() - timedelta(hours=1)
        ).count()

        if recent_requests > Config.MAX_REQUESTS_PER_IP_PER_HOUR:
            return True

        # if is_ip_from_blocked_country(ip_address):
        #     return True

    except ValueError:
        return True

    return False


def create_user_session(user, device_id=None):
    if is_suspicious_device(device_id):
        raise Exception("Suspicious device detected")

    if is_suspicious_ip(get_client_ip()):
        raise Exception("Suspicious IP detected")

    existing_session = UserSession.query.filter_by(
        user_id=user.id,
        device_identifier=device_id
    ).first()

    device_info = get_device_info()
    client_ip = get_client_ip()

    if existing_session:
        existing_session.is_active = True
        existing_session.last_used = datetime.now()
        existing_session.last_ip = client_ip
        existing_session.device_name = device_info['device_name']
        existing_session.device_type = device_info['device_type']
        db.session.commit()
        return existing_session

    active_sessions = UserSession.query.filter_by(
        user_id=user.id,
        is_active=True
    ).order_by(UserSession.last_used.desc()).all()

    if len(active_sessions) >= Config.MAX_DEVICES_PER_USER:
        oldest_session = active_sessions[-1]
        oldest_session.is_active = False
        db.session.commit()

    new_session = UserSession(
        user_id=user.id,
        device_identifier=device_id or str(uuid.uuid4()),
        device_name=device_info['device_name'],
        device_type=device_info['device_type'],
        last_ip=client_ip,
        last_used=datetime.now(),
        is_active=True
    )
    db.session.add(new_session)
    db.session.commit()
    return new_session

def validate_login_request(request_data):
    email = request_data.get('email', '').strip().lower()
    if not email or '@' not in email:
        raise ValueError('Invalid email format')

    if len(email) > 255:
        raise ValueError('Email too long')

    username = request_data.get('username', '').strip()
    if username and (len(username) < 3 or len(username) > 50):
        raise ValueError('Invalid username length')

    return email, username


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    try:
        email, username = validate_login_request(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        if not username:
            return jsonify({'error': 'User not found. Provide a username to create an account'}), 404

        user = User(email=email, username=username, role='basic')
        db.session.add(user)
        db.session.commit()

    login_token = generate_secure_token()
    hashed_token_login_token = hash_token(login_token)

    user.login_token = hashed_token_login_token
    user.login_token_expiration = datetime.utcnow() + timedelta(minutes=15)
    db.session.commit()

    send_auth_email(email, login_token)

    return jsonify({
        'message': 'Login token sent to your email',
        'email_verified': False
    }), 200

@auth_bp.route('/refresh-token', methods=['POST'])
def refresh_token():
    data = request.get_json()
    email = data.get('email')
    provided_refresh_token = data.get('refresh_token')
    device_id = data.get('device_id')

    if not all([email, provided_refresh_token, device_id]):
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    session = UserSession.query.filter_by(
        user_id=user.id,
        device_identifier=device_id,
        is_active=True
    ).first()

    if not session:
        return jsonify({'error': 'Invalid session'}), 401

    try:
        if not verify_token(session.refresh_token, provided_refresh_token):
            return jsonify({'error': 'Invalid refresh token'}), 401
    except Exception:
        return jsonify({'error': 'Invalid refresh token'}), 401

    if datetime.now() > session.refresh_token_expiration:
        return jsonify({'error': 'Expired refresh token'}), 401

    new_auth_token = generate_jwt_token(user.id, device_id)
    new_refresh_token = generate_jwt_token(user.id, device_id, exp_minutes=1440)

    session.auth_token = hash_token(new_auth_token)
    session.refresh_token = hash_token(new_refresh_token)
    session.token_expiration = datetime.now() + Config.ACCESS_TOKEN_TIME
    session.refresh_token_expiration = datetime.now() + Config.REFRESH_TOKEN_TIME
    session.update_activity(get_client_ip())

    db.session.commit()

    return jsonify({
        'token': new_auth_token,
        'refresh_token': new_refresh_token
    }), 200

@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    email = data.get('email')
    provided_token = data.get('token')
    device_id = data.get('device_id')

    if not email or not provided_token:
        return jsonify({'error': 'Email and token are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.login_token or datetime.now() > user.login_token_expiration:
        return jsonify({'error': 'Invalid or expired token'}), 401

    try:
        if not verify_token(user.login_token, provided_token):
            return jsonify({'error': 'Invalid token'}), 401
    except Exception:
        return jsonify({'error': 'Invalid token'}), 401

    user.login_token = None
    user.login_token_expiration = None

    session = create_user_session(user, device_id)

    auth_token = generate_jwt_token(user.id, device_id, exp_minutes=30)
    refresh_token = generate_jwt_token(user.id, device_id, exp_minutes=1440)

    session.auth_token = hash_token(auth_token)
    session.refresh_token = hash_token(refresh_token)
    session.token_expiration = datetime.now() + Config.ACCESS_TOKEN_TIME
    session.refresh_token_expiration = datetime.now() + Config.REFRESH_TOKEN_TIME

    db.session.commit()
    user_utils.update_last_login(user)

    return jsonify({
        'message': 'Authentication successful',
        'token': auth_token,
        'refresh_token': refresh_token,
        'email': email
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@require_auth()
def logout(user_id, session, *args):
    if session:
        session.invalidate()
        db.session.commit()
        return jsonify({'logged_out': True, 'message': 'Logged out successfully'}), 200

    return jsonify({'logged_out': False, 'error': 'Invalid session'}), 400

@auth_bp.route('/logout-all', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def logout_all(user_id, session, *args):
    try:
        num_deleted = UserSession.query.filter(
            UserSession.id != session.id  # keep admin's current session
        ).delete()

        db.session.commit()
        return jsonify({
            'message': f'All users logged out successfully. {num_deleted} sessions removed.'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500