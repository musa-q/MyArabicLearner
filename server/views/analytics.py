from flask import Blueprint, jsonify
from ..models import db, UserActivity, User
from ..decorators import require_auth
from sqlalchemy import func, distinct
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics/activity', methods=['GET'])
@require_auth(allowed_roles=['admin'])
def get_activity_analytics(user_id, session, *args):
    """Get activity analytics for the past 30 days"""

    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)

    daily_users = db.session.query(
        func.date(UserActivity.created_at).label('date'),
        func.count(distinct(UserActivity.user_id)).label('user_count')
    ).filter(
        UserActivity.created_at.between(start_date, end_date)
    ).group_by(
        func.date(UserActivity.created_at)
    ).all()

    popular_pages = db.session.query(
        UserActivity.page_visited,
        func.count(UserActivity.id).label('visit_count')
    ).filter(
        UserActivity.created_at.between(start_date, end_date)
    ).group_by(
        UserActivity.page_visited
    ).order_by(
        func.count(UserActivity.id).desc()
    ).limit(10).all()

    action_counts = db.session.query(
        UserActivity.action_type,
        func.count(UserActivity.id).label('action_count')
    ).filter(
        UserActivity.created_at.between(start_date, end_date)
    ).group_by(
        UserActivity.action_type
    ).order_by(
        func.count(UserActivity.id).desc()
    ).all()

    device_stats = db.session.query(
        UserActivity.device_type,
        func.count(distinct(UserActivity.user_id)).label('user_count')
    ).filter(
        UserActivity.created_at.between(start_date, end_date)
    ).group_by(
        UserActivity.device_type
    ).all()

    return jsonify({
        'daily_active_users': [{'date': str(d.date), 'count': d.user_count} for d in daily_users],
        'popular_pages': [{'page': p.page_visited, 'visits': p.visit_count} for p in popular_pages],
        'action_distribution': [{'action': a.action_type, 'count': a.action_count} for a in action_counts],
        'device_distribution': [{'device': d.device_type, 'users': d.user_count} for d in device_stats]
    })