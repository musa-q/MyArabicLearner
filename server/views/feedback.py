from flask import Blueprint, request, jsonify
from ..models import Feedback, db
from datetime import datetime
from ..utils import user_utils

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/send-feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    user_id = user_utils.get_user_id_from_request()

    new_feedback = Feedback(
        user_id=user_id,
        timestamp=datetime.now(),
        rating=data['rating'],
        message=data['message']
    )

    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted successfully"}), 200

@feedback_bp.route('/get-feedback', methods=['GET'])
def get_feedback():
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