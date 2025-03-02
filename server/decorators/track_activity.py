from functools import wraps
from flask import request, g
from ..models import UserActivity

def track_activity(action_type):
    """
    Decorator to track user activity
    Usage: @track_activity('page_view')
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            response = f(*args, **kwargs)

            if hasattr(g, 'user_id') and hasattr(g, 'session'):
                try:
                    page = request.endpoint or request.path

                    action_details = {}
                    if action_type == 'page_view':
                        action_details['query_params'] = dict(request.args)
                        action_details['method'] = request.method
                    elif action_type in ['quiz_complete', 'flashcard_review']:
                        action_details['request_data'] = request.get_json()

                    UserActivity.log_activity(
                        user_id=g.user_id,
                        session_id=g.session.id,
                        page=page,
                        action_type=action_type,
                        action_details=action_details,
                        device_type=g.session.device_type,
                        device_name=g.session.device_name,
                        ip_address=g.session.last_ip
                    )

                except Exception as e:
                    print(f"Error tracking activity: {str(e)}")
            else:
                print("Skipping activity tracking")

            return response
        return decorated_function
    return decorator