from . import db
from datetime import datetime, timedelta
from ..config import Config

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    auth_token = db.Column(db.String(100), unique=True, nullable=True)
    refresh_token = db.Column(db.String(100), unique=True, nullable=True)
    token_expiration = db.Column(db.DateTime, nullable=True)
    refresh_token_expiration = db.Column(db.DateTime, nullable=True)
    last_login = db.Column(db.DateTime, nullable=True)

    login_token = db.Column(db.String(100), unique=True, nullable=True)
    login_token_expiration = db.Column(db.DateTime, nullable=True)

    role = db.Column(db.String(20), nullable=False, default='basic')

    sessions = db.relationship('UserSession', cascade='all, delete-orphan', backref='user', lazy=True)
    vocab_quizzes = db.relationship('VocabQuiz', cascade='all, delete-orphan', backref='user', lazy=True)
    verb_conjugation_quizzes = db.relationship('VerbConjugationQuiz', cascade='all, delete-orphan', backref='user', lazy=True)
    feedback = db.relationship('Feedback', cascade='all, delete-orphan', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_auth_tokens(self, auth_token, refresh_token):
        self.auth_token = auth_token
        self.token_expiration = datetime.now() + Config.ACCESS_TOKEN_TIME
        self.refresh_token = refresh_token
        self.refresh_token_expiration = datetime.now() + Config.REFRESH_TOKEN_TIME

    def is_token_valid(self):
        return (self.auth_token and
            self.token_expiration and
            self.token_expiration > datetime.now())

    def should_refresh_token(self):
        if not self.token_expiration:
            return True
        time_until_expiry = self.token_expiration - datetime.now()
        return time_until_expiry <= Config.TOKEN_REFRESH_WINDOW

    def can_refresh(self):
        return (self.refresh_token and
                self.refresh_token_expiration and
                self.refresh_token_expiration > datetime.now())

class UserSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    device_identifier = db.Column(db.String(100), nullable=False)
    device_name = db.Column(db.String(200))
    device_type = db.Column(db.String(50))
    last_used = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_ip = db.Column(db.String(45))
    is_active = db.Column(db.Boolean, default=True)

    def is_valid(self):
        return (self.is_active and
                datetime.now() - self.last_used < Config.REFRESH_TOKEN_TIME)

    def update_activity(self, ip_address=None):
        self.last_used = datetime.now()
        if ip_address:
            self.last_ip = ip_address
        db.session.commit()

    def extend_validity(self):
        self.is_active = True
        self.last_used = datetime.now()
        db.session.commit()
