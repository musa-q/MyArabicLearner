import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from .config import Config
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .backup import schedule_backup

db = SQLAlchemy()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[
        "1000 per day",
        "50 per hour",
        "5 per second"
    ],
    storage_uri="memory://"
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    print("🔧 Environment:", "DEVELOPMENT" if app.config['RUN_IN_DEVELOPMENT'] else "PRODUCTION")

    db.init_app(app)
    migrate = Migrate(app, db)
    limiter.init_app(app)
    CORS(app)

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return {
            "error": "Rate limit exceeded",
            "message": str(e.description),
            "retry_after": e.retry_after
        }, 429

    def route_specific_limits():
        limiter.limit("20 per minute")(auth_bp)
        limiter.limit("30 per minute")(flashcards_bp)
        limiter.limit("60 per minute")(users_bp)
        limiter.limit("60 per minute")(quiz_bp)
        limiter.limit("60 per minute")(maintenance_bp)

        if app.config['RUN_IN_DEVELOPMENT']:
            limiter.limit("60 per minute")(dev_bp)

        limiter.limit("3 per hour")(feedback_bp)

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

    route_specific_limits()

    if not app.config['RUN_IN_DEVELOPMENT']:
        schedule_backup()
    else:
        print("Backup scheduler disabled in development")

    with app.app_context():
        db.create_all()

    from .commands import cli_commands
    cli_commands.init_app(app)

    return app