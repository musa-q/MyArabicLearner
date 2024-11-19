from flask import Blueprint, request, jsonify
from ..decorators import require_auth
from ..models import User

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def home():
    return "Hello World!"

def get_admin_navbar_buttons():
    return [
        { 'label': 'Maintenance', 'action': 'maintenance' },
    ]

@home_bp.route('/homepage', methods=['POST'])
@require_auth()
def homepage(user_id, *args, **kwargs):
    user = User.query.get(user_id)
    extra_buttons = None
    if user.role == 'basic':
        other_info = 'This is a basic user'
    elif user.role == 'admin':
        other_info = f"'Authorization': Bearer {user.auth_token}"
        extra_buttons = get_admin_navbar_buttons()

    return jsonify({'username': user.username, 'other_info': other_info, 'extra_buttons': extra_buttons}), 200