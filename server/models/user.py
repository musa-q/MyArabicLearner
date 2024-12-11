from . import db
from datetime import datetime, timedelta
from ..config import Config

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    login_token = db.Column(db.String(100), unique=True, nullable=True)
    login_token_expiration = db.Column(db.DateTime, nullable=True)

    last_login = db.Column(db.DateTime, nullable=True)
    role = db.Column(db.String(20), nullable=False, default='basic')

    sessions = db.relationship('UserSession', cascade='all, delete-orphan', backref='user', lazy=True)
    vocab_quizzes = db.relationship('VocabQuiz', cascade='all, delete-orphan', backref='user', lazy=True)
    verb_conjugation_quizzes = db.relationship('VerbConjugationQuiz', cascade='all, delete-orphan', backref='user', lazy=True)
    feedback = db.relationship('Feedback', cascade='all, delete-orphan', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def get_active_sessions(self):
        return UserSession.query.filter_by(
            user_id=self.id,
            is_active=True
        ).all()

class UserSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    device_identifier = db.Column(db.String(100), nullable=False)
    device_name = db.Column(db.String(200))
    device_type = db.Column(db.String(50))

    last_used = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_ip = db.Column(db.String(45))
    is_active = db.Column(db.Boolean, default=True)

    auth_token = db.Column(db.String(100), unique=True, nullable=True)
    refresh_token = db.Column(db.String(100), unique=True, nullable=True)
    token_expiration = db.Column(db.DateTime, nullable=True)
    refresh_token_expiration = db.Column(db.DateTime, nullable=True)

    def set_auth_tokens(self, auth_token, refresh_token):
        """Set new authentication tokens for this session"""
        self.auth_token = auth_token
        self.refresh_token = refresh_token
        self.token_expiration = datetime.now() + Config.ACCESS_TOKEN_TIME
        self.refresh_token_expiration = datetime.now() + Config.REFRESH_TOKEN_TIME
        self.last_used = datetime.now()

    def is_token_valid(self):
        """Check if the current auth token is valid"""
        return (self.auth_token and
                self.token_expiration and
                self.token_expiration > datetime.now() and
                self.is_active)

    def should_refresh_token(self):
        """Check if the token should be refreshed based on expiration window"""
        if not self.token_expiration:
            return True
        time_until_expiry = self.token_expiration - datetime.now()
        return time_until_expiry <= Config.TOKEN_REFRESH_WINDOW

    def can_refresh(self):
        """Check if this session can perform a token refresh"""
        return (self.refresh_token and
                self.refresh_token_expiration and
                self.refresh_token_expiration > datetime.now() and
                self.is_active)

    def update_activity(self, ip_address=None):
        """Update session activity timestamp and IP"""
        self.last_used = datetime.now()
        if ip_address:
            self.last_ip = ip_address
        db.session.commit()

    def invalidate(self):
        """Invalidate this session"""
        self.is_active = False
        self.auth_token = None
        self.refresh_token = None
        self.token_expiration = None
        self.refresh_token_expiration = None
        db.session.commit()

    @classmethod
    def cleanup_old_sessions(cls, user_id):
        """Cleanup old sessions when max device limit is reached"""
        active_sessions = cls.query.filter_by(
            user_id=user_id,
            is_active=True
        ).order_by(cls.last_used.desc()).all()

        if len(active_sessions) >= Config.MAX_DEVICES_PER_USER:
            oldest_session = active_sessions[-1]
            oldest_session.invalidate()