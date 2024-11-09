from flask import Blueprint, request, jsonify
from ..decorators import require_auth
from ..utils import maintenance_utils
from ..models import db, Verb, VerbConjugation

maintenance_bp = Blueprint('maintenance', __name__)

@maintenance_bp.route('/update-flashcard', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def update_flashcard_route(*args):
    data = request.json
    success, message = maintenance_utils.update_flashcard(
        data['word_id'],
        data['category_name'].lower(),
        data['new_english'].lower(),
        data['new_arabic'],
        data['new_transliteration']
    )
    return jsonify({'success': success, 'message': message})

@maintenance_bp.route('/add-flashcard', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def add_flashcard_route(*args):
    data = request.json
    if not all(key in data for key in ['category_id', 'english', 'arabic']):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    success, message = maintenance_utils.add_flashcard(
        data['category_id'],
        data['english'].lower(),
        data['arabic'],
        data.get('transliteration', '')
    )
    return jsonify({'success': success, 'message': message})

@maintenance_bp.route('/get-all-verbs', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def get_all_verbs(*args):
    verbs = Verb.query.all()
    verb_list = [{'id': verb.id, 'verb': f"{verb.english_verb} ({verb.arabic_verb})"} for verb in verbs]
    return jsonify(verb_list), 200

@maintenance_bp.route('/get-verb-conjugations', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def get_verb_conjugations(*args):
    verb_id = request.args.get('verb_id')
    if not verb_id:
        return jsonify({'error': 'Verb ID is required'}), 400

    conjugations = VerbConjugation.query.filter_by(verb_id=verb_id).all()
    conjugation_list = [{
        'id': conj.id,
        'tense': conj.tense,
        'pronoun': conj.pronoun,
        'conjugation': conj.conjugation
    } for conj in conjugations]

    return jsonify(conjugation_list), 200

@maintenance_bp.route('/update-conjugation', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def update_conjugation(*args):
    data = request.json
    conjugation_id = data.get('id')
    new_conjugation = data.get('conjugation')

    if not conjugation_id or not new_conjugation:
        return jsonify({'error': 'Conjugation ID and new conjugation are required'}), 400

    conjugation = VerbConjugation.query.get(conjugation_id)
    if not conjugation:
        return jsonify({'error': 'Conjugation not found'}), 404

    conjugation.conjugation = new_conjugation
    db.session.commit()

    return jsonify({'success': True, 'message': 'Conjugation updated successfully'}), 200

@maintenance_bp.route('/update-category', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def update_category_route(*args):
    data = request.json
    success, message = maintenance_utils.update_category(
        data['category_id'],
        data['new_name'].lower()
    )
    return jsonify({'success': success, 'message': message})

@maintenance_bp.route('/add-category', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def add_category_route(*args):
    data = request.json
    if not data.get('category_name'):
        return jsonify({'success': False, 'message': 'Category name is required'}), 400

    success, message = maintenance_utils.add_category(
        data['category_name'].lower()
    )
    return jsonify({'success': success, 'message': message})

@maintenance_bp.route('/delete-category', methods=['POST'])
@require_auth(allowed_roles=['admin'])
def delete_category_route(*args):
    data = request.json
    if not data.get('category_id'):
        return jsonify({'success': False, 'message': 'Category ID is required'}), 400

    success, message = maintenance_utils.delete_category(
        data['category_id']
    )
    return jsonify({'success': success, 'message': message})