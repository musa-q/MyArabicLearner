from flask import Blueprint, request, jsonify
from ..models import db, VocabCategory, VocabWord
from ..utils import utils

flashcards_bp = Blueprint('flashcards', __name__)

@flashcards_bp.route('/get-all-category-names', methods=['GET'])
def get_all_category_names():
    categories = VocabCategory.query.all()
    category_list = [{'id': category.id, 'category_name': category.category_name} for category in categories]
    return jsonify(category_list), 200

@flashcards_bp.route('/get-category-flashcards', methods=['POST'])
def get_category_flashcards():
    data = request.get_json()
    category_id = data.get('category_id')
    category_name_input = data.get('category_name_input')

    if not category_id and not category_name_input:
        return jsonify({'error': 'User ID and Category ID are required'}), 400

    if category_name_input:
        category_name_input = category_name_input.lower()

    if not category_id:
        category_id = utils.get_category_id_from_category_name(category_name_input)

    category = VocabCategory.query.get(category_id)

    if not category:
        return jsonify({'error': 'Invalid Category ID'}), 400

    words_list = [{
        'id': word.id,
        'category_id': word.category_id,
        'english': word.english,
        'transliteration': word.transliteration,
        'arabic': word.arabic
        } for word in category.words]

    flashcard_data = {
        'title': category.category_name,
        'words': words_list
    }

    return jsonify(flashcard_data), 200
