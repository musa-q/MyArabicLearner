from flask import Blueprint, request, jsonify
from ..utils import utils
from ..decorators import require_auth
from ..utils import maintenance_utils

maintenance_bp = Blueprint('maintenance', __name__)

@maintenance_bp.route('/update_flashcard', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def update_flashcard_route(*args):
    data = request.json
    success, message = maintenance_utils.update_flashcard(
        data['category_name'].lower(),
        data['english'].lower(),
        data['new_arabic'],
        data['new_transliteration']
    )
    return jsonify({'success': success, 'message': message})