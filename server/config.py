import os
from datetime import timedelta
from dotenv import load_dotenv
from pathlib import Path
import secrets

current_dir = Path(__file__).resolve().parent
env_path = current_dir.parent / '.env'
load_dotenv(dotenv_path=env_path)

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    EMAIL = os.getenv('EMAIL', 'test@test.com')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', 'test123')

    RUN_IN_DEVELOPMENT = os.getenv('RUN_IN_DEVELOPMENT', 'True').lower() == 'true'
    if (RUN_IN_DEVELOPMENT):
        NUMBER_OF_QUIZ_QUESTIONS = 3
    else:
        NUMBER_OF_QUIZ_QUESTIONS = 10

    ACCESS_TOKEN_TIME = timedelta(hours=1)
    REFRESH_TOKEN_TIME = timedelta(days=30)
    TOKEN_REFRESH_WINDOW = timedelta(minutes=15)
    MAX_DEVICES_PER_USER = 5

    BLOCKED_DEVICE_IDS = set()
    BLOCKED_IPS = set()
    MAX_SESSIONS_PER_DEVICE_PER_DAY = 10
    MAX_REQUESTS_PER_IP_PER_HOUR = 100

    RATELIMIT_STORAGE_URL = os.environ.get('RATELIMIT_STORAGE_URL', 'memory://')
    RATELIMIT_STRATEGY = 'fixed-window'
    RATELIMIT_DEFAULT_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

    RATELIMIT_HEADERS_ENABLED = True
    RATELIMIT_HEADER_LIMIT = 'X-RateLimit-Limit'
    RATELIMIT_HEADER_REMAINING = 'X-RateLimit-Remaining'
    RATELIMIT_HEADER_RESET = 'X-RateLimit-Reset'

    RATELIMIT_EXEMPT_ROUTES = [
    ]

    RATELIMIT_WHITELIST = set([
        '127.0.0.1',  # localhost
    ])

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=1)
    JWT_ALGORITHM = 'HS256'