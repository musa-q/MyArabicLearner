from flask import Blueprint, request, jsonify
from ..models import db, User, UserSession
from ..utils import user_utils
from datetime import datetime, timedelta
from ..config import Config
import secrets
import smtplib
from email.mime.text import MIMEText

auth_bp = Blueprint('auth', __name__)

def create_or_update_session(user, ip_address):
    location = user_utils.get_geolocation(ip_address)
    existing_session = UserSession.query.filter_by(user_id=user.id, ip_address=ip_address).first()

    if existing_session:
        existing_session.last_used = datetime.utcnow()
        existing_session.location = location
    else:
        new_session = UserSession(
            user_id=user.id,
            ip_address=ip_address,
            location=location,
            last_used=datetime.utcnow()
        )
        db.session.add(new_session)

    db.session.commit()


def send_auth_email(email, token):
    sender_email = Config.EMAIL
    password = Config.EMAIL_PASSWORD

    subject = "Verify Your Email - My Arabic Learner"

    html_content = f"""
    <html>
        <body style="font-family: sans-serif;">
            <img src="https://i.ibb.co/25NHfYy/myarabiclearner-logo.png" width="100" alt="My Arabic Learner Logo" style="display: block; margin: 30px auto;">
            <h2 style="text-align: center; color: #2E86C1;">Welcome to My Arabic Learner!</h2>
            <p style="text-align: center;">
                To verify your email address, please use the following code:<br>
                <h3 style="color: #2E86C1; font-weight: bold; text-align: center;">{token}</h3>
            </p>
            <p style="text-align: center;">
                If you did not sign up for this account, you can ignore this email.
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

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username', None)
    ip_address = request.remote_addr

    # if not email or not username:
    #     return jsonify({'error': 'Email and username are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        if not username:
            return jsonify({'error': 'Email does not exist. Enter a username to signup'}), 404
        user = User(email=email, username=username)
        db.session.add(user)
        db.session.commit()

    existing_session = UserSession.query.filter_by(user_id=user.id, ip_address=ip_address).first()
    if existing_session and (datetime.utcnow() - existing_session.last_used) < Config.SESSION_TOKEN_TIME:
        create_or_update_session(user, ip_address)
        return jsonify({
            'message': 'Authenticated already',
            'token': existing_session.id,
            'authenticated': True
        }), 200

    token = secrets.token_urlsafe(32).replace('-', 'g').replace('_', '9')
    user.set_auth_token(token)
    db.session.commit()

    send_auth_email(email, token)

    return jsonify({'message': 'Authentication token sent to your email', 'authenticated': False}), 200

@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    email = data.get('email')
    token = data.get('token')
    ip_address = request.remote_addr

    if not email or not token:
        return jsonify({'error': 'Email and token are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.is_token_valid() or user.auth_token != token:
        return jsonify({'error': 'Invalid or expired token'}), 401

    create_or_update_session(user, ip_address)

    return jsonify({'message': 'Authentication successful', 'token': token}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if user:
        user.auth_token = None
        user.token_expiration = None
        db.session.commit()

    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/check-token', methods=['GET'])
def check_token():
    user = user_utils.get_user_id_from_request()
    if user:
        return jsonify({'valid': True, 'user_id': user}), 200
    else:
        return jsonify({'valid': False}), 401