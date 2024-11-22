from flask import Blueprint, request, jsonify
from ..models import db, User, UserSession
from ..utils import user_utils
from datetime import datetime, timedelta
from ..config import Config
from ..decorators import require_auth
import secrets
import smtplib
from email.mime.text import MIMEText
import uuid

auth_bp = Blueprint('auth', __name__)
def generate_secure_token():
    return secrets.token_urlsafe(16).replace('-', 'g').replace('_', '9')

def send_auth_email(email, token):
    sender_email = Config.EMAIL
    password = Config.EMAIL_PASSWORD

    subject = "Login Token - My Arabic Learner"

    html_content = f"""
    <html>
        <body style="font-family: sans-serif;">
            <img src="https://i.ibb.co/25NHfYy/myarabiclearner-logo.png" width="100" alt="My Arabic Learner Logo" style="display: block; margin: 30px auto;">
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

def create_user_session(user, device_id=None):
    device_id = device_id or str(uuid.uuid4())

    new_session = UserSession(
        user_id=user.id,
        device_identifier=device_id,
        last_used=datetime.utcnow()
    )
    db.session.add(new_session)
    db.session.commit()
    return new_session

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username', None)
    device_id = data.get('device_id')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        if not username:
            return jsonify({'error': 'User not found. Provide a username to create an account'}), 404

        user = User(email=email, username=username, role='basic')
        db.session.add(user)
        db.session.commit()

    login_token = generate_secure_token()
    user.login_token = login_token
    user.login_token_expiration = datetime.utcnow() + timedelta(minutes=15)
    db.session.commit()

    send_auth_email(email, login_token)

    return jsonify({
        'message': 'Login token sent to your email',
        'email_verified': False
    }), 200

@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    email = data.get('email')
    token = data.get('token')
    device_id = data.get('device_id')

    if not email or not token:
        return jsonify({'error': 'Email and token are required'}), 400

    user = User.query.filter_by(email=email).first()

    if (not user or
        not user.login_token or
        user.login_token != token or
        datetime.utcnow() > user.login_token_expiration):
        return jsonify({'error': 'Invalid or expired token'}), 401

    user.login_token = None
    user.login_token_expiration = None

    session = create_user_session(user, device_id)

    if not user.auth_token:
        auth_token = generate_secure_token()
        user.auth_token = auth_token
        user.token_expiration = datetime.utcnow() + Config.SESSION_TOKEN_TIME
    else:
        auth_token = user.auth_token

    db.session.commit()

    return jsonify({
        'message': 'Authentication successful',
        'token': auth_token,
        'email': email
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@require_auth()
def logout(user_id, *args):
    user = User.query.filter_by(id=user_id).first()
    if user:
        user.auth_token = None
        user.token_expiration = None
        db.session.commit()
        return jsonify({'logged_out': True, 'message': 'Logged out successfully'}), 200

    return jsonify({'logged_out': False, 'error': 'Email is required'}), 400

@auth_bp.route('/logout-all', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def logout_all(*args):
    try:
        num_deleted = UserSession.query.delete()

        User.query.update({User.auth_token: None, User.token_expiration: None})

        db.session.commit()
        return jsonify({'message': f'All users logged out successfully. {num_deleted} sessions removed.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

@auth_bp.route('/check-token', methods=['POST'])
def check_token():
    user_id = user_utils.get_user_id_from_request()
    if user_id:
        return jsonify({'valid': True}), 200
    else:
        return jsonify({'valid': False}), 401