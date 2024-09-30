from flask import Blueprint, request, jsonify
from ..models import db, User

users_bp = Blueprint('users', __name__)

@users_bp.route('/add-user', methods=['POST'])
def add_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    if not username:
        return jsonify({'error': 'Username is required'}), 400
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    new_user = User(username=username, email=email)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User added successfully'}), 201

@users_bp.route('/view-users', methods=['GET'])
def view_users():
    users = User.query.all()
    user_list = [{'id': cat.id, 'username': cat.username, 'email': cat.email} for cat in users]
    return jsonify(user_list), 200