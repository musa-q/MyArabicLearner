import os
from datetime import timedelta
from dotenv import load_dotenv
from pathlib import Path

current_dir = Path(__file__).resolve().parent
env_path = current_dir.parent / '.env'
load_dotenv(dotenv_path=env_path)

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'SECRET_KEY')

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    EMAIL = os.getenv('EMAIL', 'test@test.com')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD', 'test123')

    run_in_development = True
    if (run_in_development):
        SESSION_TOKEN_TIME = timedelta(days=30)
        NUMBER_OF_QUIZ_QUESTIONS = 3
    else:
        SESSION_TOKEN_TIME = timedelta(days=30)
        NUMBER_OF_QUIZ_QUESTIONS = 10