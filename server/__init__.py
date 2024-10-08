import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate = Migrate(app, db)

    CORS(app)

    from .views import home_bp, testing_bp, users_bp, quiz_bp, flashcards_bp, dev_bp, auth_bp, feedback_bp, maintenance_bp
    app.register_blueprint(home_bp)
    app.register_blueprint(testing_bp, url_prefix='/testing')
    app.register_blueprint(users_bp, url_prefix='/user')
    app.register_blueprint(quiz_bp, url_prefix='/quiz')
    app.register_blueprint(flashcards_bp, url_prefix='/flashcards')
    app.register_blueprint(dev_bp, url_prefix='/dev')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(feedback_bp, url_prefix='/feedback')
    app.register_blueprint(maintenance_bp, url_prefix='/maintenance')

    with app.app_context():
        db.create_all()

    from .commands import cli_commands
    cli_commands.init_app(app)

    return app