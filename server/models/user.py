from . import db
from datetime import datetime, timedelta
from ..config import Config

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    auth_token = db.Column(db.String(100), unique=True, nullable=True)
    token_expiration = db.Column(db.DateTime, nullable=True)

    login_token = db.Column(db.String(100), unique=True, nullable=True)
    login_token_expiration = db.Column(db.DateTime, nullable=True)

    role = db.Column(db.String(20), nullable=False, default='basic')

    sessions = db.relationship('UserSession', cascade='all, delete-orphan', backref='user', lazy=True)
    vocab_quizzes = db.relationship('VocabQuiz', cascade='all, delete-orphan', backref='user', lazy=True)
    verb_conjugation_quizzes = db.relationship('VerbConjugationQuiz', cascade='all, delete-orphan', backref='user', lazy=True)
    feedback = db.relationship('Feedback', cascade='all, delete-orphan', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_auth_token(self, token):
        self.auth_token = token
        self.token_expiration = datetime.now() + Config.SESSION_TOKEN_TIME

    def is_token_valid(self):
            return self.auth_token and self.token_expiration and self.token_expiration > datetime.now()

class UserSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    device_identifier = db.Column(db.String(100), nullable=False)
    last_used = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def is_valid(self):
        return (datetime.utcnow() - self.last_used) < Config.SESSION_TOKEN_TIME