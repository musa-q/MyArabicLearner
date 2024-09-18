from flask import Blueprint, request, jsonify
from ..models import db, User
from datetime import datetime
from ..config import Config
import secrets
import smtplib
from email.mime.text import MIMEText

auth_bp = Blueprint('auth', __name__)

def send_auth_email(email, token):
    sender_email = Config.EMAIL
    password = Config.EMAIL_PASSWORD

    subject = "My Arabic Learner Authentication Token"
    body = f"Your authentication token is: {token}"

    msg = MIMEText(body)
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

    # if not email or not username:
    #     return jsonify({'error': 'Email and username are required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        if not username:
            return jsonify({'error': 'Email does not exist. Enter a username to signup'}), 404
        user = User(email=email, username=username)
        db.session.add(user)
        db.session.commit()

    token = secrets.token_urlsafe(32)
    user.set_auth_token(token)
    db.session.commit()

    send_auth_email(email, token)

    return jsonify({'message': 'Authentication token generated', 'token': token}), 200

@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.get_json()
    email = data.get('email')
    token = data.get('token')

    if not email or not token:
        return jsonify({'error': 'Email and token are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.is_token_valid() or user.auth_token != token:
        return jsonify({'error': 'Invalid or expired token'}), 401

    return jsonify({'message': 'Authentication successful', 'user_id': user.id, 'token': token}), 200

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