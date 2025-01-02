from flask import Blueprint, request, jsonify
from ..models import db, Verb, VerbConjugation
from ..decorators import require_auth

verbs_visualiser_bp = Blueprint('verbs_visualiser', __name__)

@verbs_visualiser_bp.route('/get-verbs', methods=['POST'])
@require_auth()
def get_verbs(*args):
    verbs = Verb.query.all()
    verb_list = [{'id': verb.id, 'verb': f"{verb.english_verb} ({verb.arabic_verb})"} for verb in verbs]
    return jsonify(verb_list), 200

@verbs_visualiser_bp.route('/get-verb-table', methods=['POST'])
@require_auth()
def get_verb_table(*args):
    data = request.get_json()
    verb_id = data.get('verbId')

    if not verb_id:
        return jsonify({'error': 'Verb is required'}), 400

    verb = Verb.query.filter(Verb.id == verb_id).first()

    if not verb:
        return jsonify({'error': 'Verb not found'}), 404

    conjugations = VerbConjugation.query.filter_by(verb_id=verb.id).all()
    conjugation_list = [{
        'id': conj.id,
        'tense': conj.tense,
        'pronoun': conj.pronoun,
        'conjugation': conj.conjugation
    } for conj in conjugations]

    return jsonify(conjugation_list), 200