from . import db
from datetime import datetime

class UserActivity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('user_session.id'), nullable=False)

    page_visited = db.Column(db.String(100), nullable=False)
    action_type = db.Column(db.String(50), nullable=False)
    action_details = db.Column(db.JSON, nullable=True)

    device_type = db.Column(db.String(50))
    device_name = db.Column(db.String(200))
    ip_address = db.Column(db.String(45))

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('activities', lazy=True))
    session = db.relationship('UserSession', backref=db.backref('activities', lazy=True))

    @classmethod
    def log_activity(cls, user_id, session_id, page, action_type, action_details=None,
                    device_type=None, device_name=None, ip_address=None):
        """
        Create a new activity log entry
        """
        activity = cls(
            user_id=user_id,
            session_id=session_id,
            page_visited=page,
            action_type=action_type,
            action_details=action_details,
            device_type=device_type,
            device_name=device_name,
            ip_address=ip_address
        )
        db.session.add(activity)
        db.session.commit()
        return activity

    def __repr__(self):
        return f'<UserActivity {self.action_type} by User {self.user_id} on {self.created_at}>'