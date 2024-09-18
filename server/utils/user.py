from flask import request
from ..models import User

class UserUtils:
    @staticmethod
    # Get the token from the Authorization header
    def get_user_id_from_request():
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            # The header should be in the format: "Bearer <token>"
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