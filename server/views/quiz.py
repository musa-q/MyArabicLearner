from flask import Blueprint, request, jsonify
from ..models import db, User, Verb, VerbConjugation, VocabCategory, VocabWord, VocabQuiz, VocabQuizQuestion, VerbConjugationQuiz, VerbConjugationQuizQuestion
from ..utils import utils, quiz_utils, user_utils
from sqlalchemy.sql.expression import func
from sqlalchemy import desc
from datetime import datetime, timedelta
import time

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/create-vocab-quiz', methods=['POST'])
def create_vocab_quiz():
    data = request.get_json()
    category_id = data.get('category_id')
    num_questions = data.get('num_questions', 3)
    category_name_input = data.get('category_name_input')

    user_id = user_utils.get_user_id_from_request()

    if not all([user_id, category_id]) and not all([user_id, category_name_input]):
        return jsonify({'error': 'User ID and Category ID are required'}), 400

    if category_name_input:
        category_name_input = category_name_input.lower()

    if not category_id:
        category_id = utils.get_category_id_from_category_name(category_name_input)

    user = User.query.get(user_id)
    category = VocabCategory.query.get(category_id)

    if not user or not category:
        return jsonify({'error': 'Invalid User ID or Category ID'}), 400

    try:
        words = VocabWord.query.filter_by(category_id=category_id).order_by(func.random()).limit(num_questions).all()

        if len(words) < num_questions:
            num_questions = len(words)

        quiz = VocabQuiz(user_id=user_id, category_id=category_id, score=0, total_questions=num_questions)
        db.session.add(quiz)
        db.session.flush()  # Ensure ID is available

        for word in words:
            question = VocabQuizQuestion(quiz_id=quiz.id, word_id=word.id, is_correct=False, is_answered=False)
            db.session.add(question)

        db.session.commit()

        return jsonify({
            'message': 'Vocabulary quiz created successfully',
            'quiz_id': quiz.id,
            'num_questions': num_questions
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Database integrity error occurred'}), 500

@quiz_bp.route('/create-verb-conjugation-quiz', methods=['POST'])
def create_verb_conjugation_quiz():
    data = request.get_json()
    num_questions = data.get('num_questions', 3)

    user_id = user_utils.get_user_id_from_request()

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'Invalid User ID'}), 400

    current_time = datetime.now()
    previous_quiz = quiz_utils.get_current_quiz('VerbConjugationQuiz', user_id)
    if previous_quiz:
        time_difference = current_time - previous_quiz.date_taken
        if time_difference < timedelta(minutes=1):
            return jsonify({'error': 'Cannot create quiz'}), 429

    conjugations = VerbConjugation.query.order_by(func.random()).limit(num_questions).all()

    if len(conjugations) < num_questions:
        num_questions = len(conjugations)

    quiz = VerbConjugationQuiz(user_id=user_id, score=0, total_questions=num_questions)
    db.session.add(quiz)
    db.session.flush()

    for conjugation in conjugations:
        question = VerbConjugationQuizQuestion(quiz_id=quiz.id, verb_conjugation_id=conjugation.id, is_correct=False, is_answered=False )
        db.session.add(question)

    db.session.commit()

    return jsonify({
        'message': 'Verb conjugation quiz created successfully',
        'quiz_id': quiz.id,
        'num_questions': num_questions
    }), 201

#####

@quiz_bp.route('/vocab-quizzes', methods=['GET'])
def view_user_vocab_quizzes():
    user_id = user_utils.get_user_id_from_request()

    quizzes = VocabQuiz.query.filter_by(user_id=user_id).all()
    quizzes_list = [{
        'id': quiz.id,
        'category_id': quiz.category_id,
        'category_name': quiz.category.category_name,
        'score': quiz.score,
        'total_questions': quiz.total_questions,
        'date_taken': quiz.date_taken.isoformat()
    } for quiz in quizzes]
    return jsonify(quizzes_list), 200

@quiz_bp.route('/vocab-quizzes/<int:quiz_id>', methods=['GET'])
def view_vocab_quiz(quiz_id):
    quiz = VocabQuiz.query.get_or_404(quiz_id)
    questions = VocabQuizQuestion.query.filter_by(quiz_id=quiz_id).all()
    questions_list = [{
        'id': question.id,
        'word_id': question.word_id,
        'english': question.word.english,
        'arabic': question.word.arabic,
        'is_correct': question.is_correct,
        'is_answered': question.is_answered
    } for question in questions]

    quiz_data = {
        'id': quiz.id,
        'user_id': quiz.user_id,
        'category_id': quiz.category_id,
        'category_name': quiz.category.category_name,
        'score': quiz.score,
        'total_questions': quiz.total_questions,
        'date_taken': quiz.date_taken.isoformat(),
        'questions': questions_list
    }
    return jsonify(quiz_data), 200

@quiz_bp.route('/verb-conjugation-quizzes', methods=['GET'])
def view_user_verb_conjugation_quizzes():
    user_id = user_utils.get_user_id_from_request()

    quizzes = VerbConjugationQuiz.query.filter_by(user_id=user_id).all()
    quizzes_list = [{
        'id': quiz.id,
        'score': quiz.score,
        'total_questions': quiz.total_questions,
        'date_taken': quiz.date_taken.isoformat()
    } for quiz in quizzes]
    return jsonify(quizzes_list), 200

@quiz_bp.route('/verb-conjugation-quizzes/<int:quiz_id>', methods=['GET'])
def view_verb_conjugation_quiz(quiz_id):
    quiz = VerbConjugationQuiz.query.get_or_404(quiz_id)
    questions = VerbConjugationQuizQuestion.query.filter_by(quiz_id=quiz_id).all()
    questions_list = [{
        'id': question.id,
        'verb_conjugation_id': question.verb_conjugation_id,
        'verb': question.verb_conjugation.verb.english_verb,
        'tense': question.verb_conjugation.tense,
        'pronoun': question.verb_conjugation.pronoun,
        'conjugation': question.verb_conjugation.conjugation,
        'is_correct': question.is_correct,
        'is_answered': question.is_answered
    } for question in questions]

    quiz_data = {
        'id': quiz.id,
        'user_id': quiz.user_id,
        'score': quiz.score,
        'total_questions': quiz.total_questions,
        'date_taken': quiz.date_taken.isoformat(),
        'questions': questions_list
    }
    return jsonify(quiz_data), 200

##########

@quiz_bp.route('/current-vocab-quizzes', methods=['GET'])
def view_current_user_vocab_quizzes():
    user_id = user_utils.get_user_id_from_request()

    data = request.get_json()
    quiz_type = data.get('quiz_type', 'VocabQuiz')
    quiz = quiz_utils.get_current_quiz(quiz_type, user_id)
    if quiz_type == 'VocabQuiz':
        questions = VocabQuizQuestion.query.filter_by(quiz_id=quiz.id).all()
        questions_list = [{
            'id': question.id,
            'word_id': question.word_id,
            'english': question.word.english,
            'arabic': question.word.arabic,
            'is_correct': question.is_correct,
            'is_answered': question.is_answered
        } for question in questions]

        quiz_data = {
            'id': quiz.id,
            'user_id': quiz.user_id,
            'category_id': quiz.category_id,
            'category_name': quiz.category.category_name,
            'score': quiz.score,
            'total_questions': quiz.total_questions,
            'date_taken': quiz.date_taken.isoformat(),
            'questions': questions_list
        }
    elif quiz_type == 'VerbConjugationQuiz':
        questions = VerbConjugationQuizQuestion.query.filter_by(quiz_id=quiz.id).all()
        questions_list = [{
            'id': question.id,
            'verb_conjugation_id': question.verb_conjugation_id,
            'verb': question.verb_conjugation.verb.english_verb,
            'tense': question.verb_conjugation.tense,
            'pronoun': question.verb_conjugation.pronoun,
            'conjugation': question.verb_conjugation.conjugation,
            'is_correct': question.is_correct,
            'is_answered': question.is_answered
        } for question in questions]

        quiz_data = {
            'id': quiz.id,
            'user_id': quiz.user_id,
            'score': quiz.score,
            'total_questions': quiz.total_questions,
            'date_taken': quiz.date_taken.isoformat(),
            'questions': questions_list
        }
    else:
        return jsonify({'error': 'quiz_type is unset'}), 400

    return jsonify(quiz_data), 200

@quiz_bp.route('/get-next-question', methods=['POST'])
def get_quiz_next_question():
    user_id = user_utils.get_user_id_from_request()

    data = request.get_json()
    quiz_type = data.get('quiz_type', 'VocabQuiz')
    quiz_id = data.get('quiz_id', None)

    def get_quiz():
        if quiz_id:
            quiz = quiz_utils.get_quiz_by_id_and_user(quiz_id, user_id)
        else:
            quiz = quiz_utils.get_current_quiz(quiz_type, user_id)
        if quiz:
            return quiz
        else:
            raise Exception(f"Quiz not found. quiz_id: {quiz_id}, user_id: {user_id}")

    quiz = utils.retry(
        3,
        lambda: get_quiz(),
        lambda: True,
        lambda: time.sleep(1)
    )

    if not quiz:
        return jsonify({'question': None, 'all_answered': True, 'quiz_id': None}), 200

    _, next_question = quiz_utils.get_next_question(quiz_type, user_id)
    hint = quiz_utils.get_quiz_answer(quiz_type, user_id)

    if not next_question:
        return jsonify({'question': None, 'all_answered': True}), 200

    return jsonify({'question': next_question, 'hint': hint, 'all_answered': False}), 200


@quiz_bp.route('/send-answer', methods=['POST'])
def send_answer_from_client():
    user_id = user_utils.get_user_id_from_request()

    data = request.get_json()
    quiz_type = data.get('quiz_type', 'VocabQuiz')
    user_answer = data.get('user_answer')

    updated_answer, res = quiz_utils.answer_current_quiz_question(quiz_type, user_id, user_answer)
    if updated_answer == False:
        return jsonify({'error': 'Unable to send answer'}), 500
    if updated_answer == None:
        return jsonify({'error': 'All questions answered'}), 500
    answer_response = res.is_correct

    return jsonify({'answer_response': answer_response, 'question_id': res.id}), 200

@quiz_bp.route('/check-quiz-finished', methods=['GET'])
def check_quiz_finished():
    user_id = user_utils.get_user_id_from_request()

    data = request.get_json()
    quiz_type = data.get('quiz_type', 'VocabQuiz')

    quiz_finished_bool = quiz_utils.check_all_questions_answered(quiz_type, user_id)
    return jsonify({'finished': quiz_finished_bool}), 200

@quiz_bp.route('/get-results', methods=['POST'])
def get_results():
    user_id = user_utils.get_user_id_from_request()

    data = request.get_json()
    quiz_type = data.get('quiz_type', 'VocabQuiz')

    if not quiz_utils.check_all_questions_answered(quiz_type, user_id):
        return jsonify({'quiz_answered': False, 'results': None}), 409

    results_obj = quiz_utils.get_quiz_results(quiz_type, user_id)
    return jsonify({'quiz_answered': True, 'results': results_obj}), 200


@quiz_bp.route('/get-completed-quizzes', methods=['POST'])
def get_completed_quizzes():
    user_id = user_utils.get_user_id_from_request()

    data = request.get_json()
    quiz_type = data.get('quiz_type', 'VocabQuiz')

    completed_quizzes = quiz_utils.get_completed_quizzes_info(quiz_type, user_id)

    if completed_quizzes is None:
        return jsonify({'error': 'Invalid quiz type', 'completed_quizzes': None}), 400

    return jsonify({
        'user_id': user_id,
        'quiz_type': quiz_type,
        'completed_quizzes': completed_quizzes
    }), 200