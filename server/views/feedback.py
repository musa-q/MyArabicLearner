from flask import Blueprint, request, jsonify
from ..models import Feedback, db
from datetime import datetime
from ..utils import user_utils
from ..decorators import require_auth

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/send-feedback', methods=['POST'])
@require_auth()
def submit_feedback(user_id, *args):
    data = request.json

    new_feedback = Feedback(
        user_id=user_id,
        timestamp=datetime.now(),
        rating=data['rating'],
        message=data['message']
    )

    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted successfully"}), 200

@feedback_bp.route('/get-feedback', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def get_feedback(*args):
    feedback = Feedback.query.all()

    feedback_list = []
    for f in feedback:
        feedback_list.append({
            "id": f.id,
            "timestamp": f.timestamp,
            "rating": f.rating,
            "message": f.message
        })

    return jsonify({"feedback": feedback_list})