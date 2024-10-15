from flask import request
from ..models import User
import requests
import os

GEOIP_DB_PATH = os.path.join(os.path.dirname(__file__), 'GeoLite2-City.mmdb')

class UserUtils:
    @staticmethod
    def get_user_id_from_request():
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return None

        user = User.query.filter_by(auth_token=token).first()
        if not user or not user.is_token_valid():
            return None

        return user.id

    @staticmethod
    def validate_user_token(token):
        user = User.query.filter_by(auth_token=token).first()
        if not user or not user.is_token_valid():
            return False
        return True

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