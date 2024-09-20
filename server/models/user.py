from . import db
from datetime import datetime, timedelta

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    auth_token = db.Column(db.String(100), unique=True, nullable=True)
    token_expiration = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_auth_token(self, token):
        self.auth_token = token
        self.token_expiration = datetime.utcnow() + timedelta(weeks=2)

    def is_token_valid(self):
        return self.auth_token and self.token_expiration > datetime.utcnow()