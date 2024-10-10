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
        data['category_name'].lower(),
        data['english'].lower(),
        data['new_arabic'],
        data['new_transliteration']
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
