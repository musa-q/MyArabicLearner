from datetime import datetime
from flask import request
from ..models import User, UserSession, db
import requests
import os

GEOIP_DB_PATH = os.path.join(os.path.dirname(__file__), 'GeoLite2-City.mmdb')

class UserUtils:
    @staticmethod
    def get_user_session_from_request():
        auth_header = request.headers.get('Authorization')
        device_id = request.headers.get('X-Device-ID')

        if not auth_header or not device_id:
            return None, None

        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return None, None

        session = UserSession.query.filter_by(
            auth_token=token,
            device_identifier=device_id,
            is_active=True
        ).first()

        if not session or not session.is_token_valid():
            return None, None

        user = User.query.get(session.user_id)
        if not user:
            return None, None

        return user, session

    @staticmethod
    def validate_session_token(token, device_id):
        session = UserSession.query.filter_by(
            auth_token=token,
            device_identifier=device_id,
            is_active=True
        ).first()

        return session and session.is_token_valid()

    @staticmethod
    def get_geolocation(ip_address):
        try:
            response = requests.get(f"http://ip-api.com/json/{ip_address}")
            data = response.json()
            if data['status'] == 'success':
                return f"{data['city']}, {data['country']}"
            else:
                return "Unknown"
        except Exception as e:
            print(f"Error getting geolocation: {str(e)}")
            return "Unknown"

    @staticmethod
    def update_last_login(user, *args):
        user.last_login = datetime.utcnow()
        db.session.commit()