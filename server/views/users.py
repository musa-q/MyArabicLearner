from flask import Blueprint, request, jsonify
from ..models import db, User
from ..decorators import require_auth

users_bp = Blueprint('users', __name__)

# @users_bp.route('/add-user', methods=['POST'])
# def add_user():
#     data = request.get_json()
#     username = data.get('username')
#     email = data.get('email')
#     if not username:
#         return jsonify({'error': 'Username is required'}), 400
#     if not email:
#         return jsonify({'error': 'Email is required'}), 400
#     new_user = User(username=username, email=email)
#     db.session.add(new_user)
#     db.session.commit()
#     return jsonify({'message': 'User added successfully'}), 201

@users_bp.route('/view-users', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def view_users(*args, **kwargs):
    users = User.query.all()
    user_list = [{'id': cat.id, 'username': cat.username, 'email': cat.email} for cat in users]
    return jsonify(user_list), 200

@users_bp.route('/delete-user', methods=['DELETE'])
@require_auth(allowed_roles=['admin'])
def delete_user(*args, **kwargs):
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')

    if not username and not email:
        return jsonify({'error': 'Email or username is required'}), 400

    if username:
        user = User.query.filter_by(username=username).first()
    elif email:
        user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': f'User {username} deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'An error occurred while deleting the user: {str(e)}'}), 500
