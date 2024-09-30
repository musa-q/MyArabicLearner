from flask import Blueprint, request, jsonify

home_bp = Blueprint('home', __name__)

@home_bp.route('/')
def home():
    return "Hello World!"