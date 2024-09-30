from flask import Blueprint, request, jsonify
from ..models import db, User, Verb, VerbConjugation, VocabCategory, VocabWord, VocabQuiz, VocabQuizQuestion, VerbConjugationQuiz, VerbConjugationQuizQuestion
from ..utils import utils

testing_bp = Blueprint('testing', __name__)

@testing_bp.route('/add-verb', methods=['POST'])
def add_verb():
    data = request.get_json()
    english_verb = data.get('english_verb')
    transliteration_verb = data.get('transliteration_verb')
    arabic_verb = data.get('arabic_verb')

    if not all([english_verb, arabic_verb]):
        return jsonify({'error': 'All fields are required'}), 400

    english_verb = english_verb.lower()

    existing_verb = Verb.query.filter(
        (Verb.english_verb == english_verb) | (Verb.arabic_verb == arabic_verb)
    ).first()

    if existing_verb:
        return jsonify({'error': 'Verb already exists'}), 400

    verb = Verb(
        english_verb=english_verb,
        transliteration_verb=transliteration_verb,
        arabic_verb=arabic_verb
    )
    db.session.add(verb)
    db.session.commit()
    return jsonify({'message': 'Verb added successfully'}), 201

@testing_bp.route('/add-verb-conjugation', methods=['POST'])
def add_verb_conjugation():
    data = request.get_json()
    verb_id = data.get('verb_id')
    tense = data.get('tense')
    pronoun = data.get('pronoun')
    conjugation = data.get('conjugation')
    verb_input = data.get('verb_input')

    if not all([verb_id, tense, pronoun, conjugation]) and not all([verb_input, tense, pronoun, conjugation]):
        return jsonify({'error': 'All fields are required'}), 400

    tense = tense.lower()
    pronoun = pronoun.lower()
    verb_input = verb_input.lower()

    if not utils.check_is_pronoun(pronoun):
        return jsonify({'error': 'Pronoun field is incorrect'}), 400

    if not utils.check_is_tense(tense):
        return jsonify({'error': 'Tense field is incorrect'}), 400

    if not verb_id:
        verb_id = utils.get_verb_id_from_english(verb_input)

    existing_conjugation = VerbConjugation.query.filter(
        (VerbConjugation.verb_id == verb_id) & (VerbConjugation.tense == tense) & (VerbConjugation.pronoun == pronoun)
    ).first()

    if existing_conjugation:
        return jsonify({'error': 'Verb conjugation already exists'}), 400

    verb_conjugation = VerbConjugation(
        verb_id=verb_id,
        tense=tense,
        pronoun=pronoun,
        conjugation=conjugation
    )
    db.session.add(verb_conjugation)
    db.session.commit()
    return jsonify({'message': 'Verb conjugation added successfully'}), 201

#####

@testing_bp.route('/view-verbs', methods=['GET'])
def view_verbs():
    verbs = Verb.query.all()
    verbs_list = [{'id': verb.id, 'english_verb': verb.english_verb, 'transliteration_verb': verb.transliteration_verb, 'arabic_verb': verb.arabic_verb} for verb in verbs]
    return jsonify(verbs_list), 200

@testing_bp.route('/view-verb-conjugations', methods=['GET'])
def view_verb_conjugations():
    verb_conjugations = VerbConjugation.query.all()
    verb_conjugations_list = [{'id': conjugation.id, 'verb_id': conjugation.verb_id, 'tense': conjugation.tense, 'pronoun': conjugation.pronoun, 'conjugation': conjugation.conjugation} for conjugation in verb_conjugations]
    return jsonify(verb_conjugations_list), 200

@testing_bp.route('/view-all-verb-conjugations-list', methods=['GET'])
def view_all_verb_conjugations_list():
    all_verbs = []
    verbs = Verb.query.all()
    for verb in verbs:
        verb_conjugations = VerbConjugation.query.filter_by(verb_id=verb.id).all()
        verb_conjugations_list = [{'id': conjugation.id, 'verb_id': conjugation.verb_id, 'tense': conjugation.tense, 'pronoun': conjugation.pronoun, 'conjugation': conjugation.conjugation} for conjugation in verb_conjugations]
        all_verbs.append({
            'id': verb.id,
            'english_verb': verb.english_verb,
            'transliteration_verb': verb.transliteration_verb,
            'arabic_verb': verb.arabic_verb,
            'conjugations': verb_conjugations_list
        })
    return jsonify(all_verbs), 200

##########

@testing_bp.route('/add-vocab-category', methods=['POST'])
def add_vocab_category():
    data = request.get_json()
    category_name = data.get('category_name')

    if not all([category_name]):
        return jsonify({'error': 'All fields are required'}), 400

    category_name = category_name.lower()

    existing_category = VocabCategory.query.filter(VocabCategory.category_name == category_name).first()

    if existing_category:
        return jsonify({'error': 'Category name already exists'}), 400

    vocab_category = VocabCategory(
        category_name=category_name,
    )
    db.session.add(vocab_category)
    db.session.commit()
    return jsonify({'message': 'Category name added successfully'}), 201

@testing_bp.route('/add-vocab-word', methods=['POST'])
def add_vocab_word():
    data = request.get_json()
    category_id = data.get('category_id')
    english = data.get('english')
    transliteration = data.get('transliteration')
    arabic = data.get('arabic')
    category_name_input = data.get('category_name_input')

    if not all([category_id, english, arabic]) and not all([category_name_input, english, arabic]):
        return jsonify({'error': 'All fields are required'}), 400

    english = english.lower()
    category_name_input = category_name_input.lower()

    if not category_id:
        category_id = utils.get_category_id_from_category_name(category_name_input)

    existing_vocab_word = VocabWord.query.filter(
        (VocabWord.category_id == category_id) & (VocabWord.english == english) & (VocabWord.arabic == arabic)
    ).first()

    if existing_vocab_word:
        return jsonify({'error': 'Vocab word already exists'}), 400

    vocab_word = VocabWord(
        category_id=category_id,
        english=english,
        transliteration=transliteration,
        arabic=arabic,
    )

    db.session.add(vocab_word)
    db.session.commit()
    return jsonify({'message': 'Vocab word added successfully'}), 201

#####

@testing_bp.route('/view-category-names', methods=['GET'])
def view_category_names():
    categories = VocabCategory.query.all()
    category_list = [{'id': category.id, 'category_name': category.category_name} for category in categories]
    return jsonify(category_list), 200

@testing_bp.route('/view-all-vocab-words', methods=['GET'])
def view_all_vocab_words():
    vocab_words = VocabWord.query.all()
    vocab_words_list = [{'id': vocab_word.id, 'category_id': vocab_word.category_id, 'english': vocab_word.english, 'transliteration': vocab_word.transliteration, 'arabic': vocab_word.arabic} for vocab_word in vocab_words]
    return jsonify(vocab_words_list), 200

@testing_bp.route('/view-all-category-words-list', methods=['GET'])
def view_all_category_words_list():
    all_words = []
    categories = VocabCategory.query.all()
    for category in categories:
        vocab_words = VocabWord.query.filter_by(category_id=category.id).all()
        vocab_words_list = [{'id': vocab_word.id, 'category_id': vocab_word.category_id, 'english': vocab_word.english, 'transliteration': vocab_word.transliteration, 'arabic': vocab_word.arabic} for vocab_word in vocab_words]
        all_words.append({
            'id': category.id,
            'category_name': category.category_name,
            'words': vocab_words_list,
        })
    return jsonify(all_words), 200

##########