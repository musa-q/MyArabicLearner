from flask import Blueprint, request, jsonify
from ..models import (
    db, User, Verb, VerbConjugation, VocabCategory, VocabWord,
    VocabQuiz, VocabQuizQuestion, VerbConjugationQuiz, VerbConjugationQuizQuestion
)
from ..utils import utils, quiz_utils, user_utils
from sqlalchemy.sql.expression import func
from sqlalchemy import desc
from datetime import datetime, timedelta
from ..config import Config
from ..decorators import *
import time
from sqlalchemy.exc import IntegrityError

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/create-vocab-quiz', methods=['POST'])
@require_auth()
@track_activity('create_vocab_quiz')
def create_vocab_quiz(user_id, *args):
    try:
        data = request.get_json()
        category_id = data.get('category_id')
        num_questions = data.get('num_questions', Config.NUMBER_OF_QUIZ_QUESTIONS)
        category_name_input = data.get('category_name_input')

        if not all([user_id, category_id]) and not all([user_id, category_name_input]):
            return jsonify({'error': 'User ID and Category ID are required'}), 400

        if category_name_input:
            category_name_input = category_name_input.lower()
            category_id = utils.get_category_id_from_category_name(category_name_input)

        user = User.query.get(user_id)
        category = VocabCategory.query.get(category_id)

        if not user or not category:
            return jsonify({'error': 'Invalid User ID or Category ID'}), 400

        words = VocabWord.query.filter_by(category_id=category_id).order_by(func.random()).limit(num_questions).all()
        num_questions = min(len(words), num_questions)

        quiz = VocabQuiz(
            user_id=user_id,
            category_id=category_id,
            score=0,
            total_points=0,
            total_questions=num_questions
        )
        db.session.add(quiz)
        db.session.flush()

        for word in words:
            question = VocabQuizQuestion(
                quiz_id=quiz.id,
                word_id=word.id,
                is_correct=False,
                is_answered=False,
                points=0
            )
            db.session.add(question)

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Vocabulary quiz created successfully',
            'quiz_id': quiz.id,
            'num_questions': num_questions
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Database integrity error occurred'
        }), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@quiz_bp.route('/create-verb-conjugation-quiz', methods=['POST'])
@require_auth()
@track_activity('create_verb_conjugation_quiz')
def create_verb_conjugation_quiz(user_id, *args):
    try:
        data = request.get_json()
        num_questions = data.get('num_questions', Config.NUMBER_OF_QUIZ_QUESTIONS)

        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        user = User.query.get(user_id)

        if not user:
            return jsonify({'error': 'Invalid User ID'}), 400

        conjugations = VerbConjugation.query.order_by(func.random()).limit(num_questions).all()

        if len(conjugations) < num_questions:
            num_questions = len(conjugations)

        quiz = VerbConjugationQuiz(
            user_id=user_id,
            score=0,
            total_points=0,
            total_questions=num_questions
        )
        db.session.add(quiz)
        db.session.flush()

        for conjugation in conjugations:
            question = VerbConjugationQuizQuestion(
                quiz_id=quiz.id,
                verb_conjugation_id=conjugation.id,
                is_correct=False,
                is_answered=False,
                points=0
            )
            db.session.add(question)

        db.session.commit()

        return jsonify({
            'message': 'Verb conjugation quiz created successfully',
            'quiz_id': quiz.id,
            'num_questions': num_questions
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Database integrity error occurred'
        }), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@quiz_bp.route('/get-next-question', methods=['POST'])
@require_auth()
def get_quiz_next_question(user_id, *args):
    try:
        data = request.get_json()
        quiz_type = data.get('quiz_type', 'VocabQuiz')
        quiz_id = data.get('quiz_id')

        def get_quiz():
            if quiz_id:
                quiz = quiz_utils.get_quiz_by_id_and_user(quiz_id, user_id, quiz_type)
            else:
                quiz = quiz_utils.get_current_quiz(quiz_type, user_id)
            return quiz

        quiz = utils.retry(3, get_quiz, lambda: True, lambda: time.sleep(1))

        if not quiz:
            return jsonify({
                'success': True,
                'question': None,
                'all_answered': True,
                'error': None
            }), 200

        question_obj, question_data = quiz_utils.get_next_question(quiz_type, user_id)

        if not question_obj or not question_data:
            quiz.quiz_finished = True
            db.session.commit()
            return jsonify({
                'success': True,
                'question': None,
                'all_answered': True,
                'error': None
            }), 200

        hint = quiz_utils.get_quiz_answer(quiz_type, user_id)

        base_response = {
            'success': True,
            'hint': hint,
            'all_answered': False,
            'error': None
        }

        question_fields = {
            'VocabQuiz': ['question_id', 'english', 'word_id'],
            'VerbConjugationQuiz': ['english_verb', 'arabic_verb', 'tense', 'pronoun', 'question_id']
        }

        response = {
            **base_response,
            'question': {k: question_data.get(k) for k in question_fields.get(quiz_type, [])}
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'question': None,
            'all_answered': False,
            'error': str(e)
        }), 500

@quiz_bp.route('/send-answer', methods=['POST'])
@require_auth()
def send_answer_from_client(user_id, *args):
    try:
        data = request.get_json()
        required_fields = ['quiz_type', 'user_answer', 'question_id', 'time_remaining', 'streak']

        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'error': 'Missing required fields',
                'required': required_fields
            }), 400

        quiz_type = data['quiz_type']
        user_answer = data['user_answer']
        question_id = data['question_id']
        time_remaining = data['time_remaining']
        streak = data['streak']

        success, question = quiz_utils.answer_current_quiz_question(
            quiz_type, user_id, user_answer, question_id, time_remaining, streak
        )

        if success is False:
            return jsonify({
                'success': False,
                'error': 'Unable to process answer',
                'answer_response': False,
                'points': 0
            }), 200
        if success is None:
            return jsonify({
                'success': False,
                'error': 'Question already answered or not found',
                'answer_response': False,
                'points': 0
            }), 200

        return jsonify({
            'success': True,
            'error': None,
            'answer_response': question.is_correct,
            'points': question.points,
            'question_id': question.id,
            'current_score': question.quiz.score,
            'total_points': question.quiz.total_points
        }), 200

    except Exception as e:
        print(f"Error in send_answer_from_client: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'answer_response': False,
            'points': 0
        }), 200

@quiz_bp.route('/get-results', methods=['POST'])
@require_auth()
def get_results(user_id, *args):
    try:
        data = request.get_json()
        quiz_type = data.get('quiz_type', 'VocabQuiz')

        if not quiz_utils.check_all_questions_answered(quiz_type, user_id):
            return jsonify({
                'success': False,
                'quiz_answered': False,
                'error': 'Quiz not completed',
                'results': None
            }), 409

        results = quiz_utils.get_quiz_results(quiz_type, user_id)
        if not results:
            return jsonify({
                'success': False,
                'quiz_answered': False,
                'error': 'Could not retrieve results',
                'results': None
            }), 404

        return jsonify({
            'success': True,
            'quiz_answered': True,
            'results': results
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'quiz_answered': False,
            'error': str(e),
            'results': None
        }), 500

@quiz_bp.route('/get-completed-quizzes', methods=['POST'])
@require_auth()
@track_activity('get_completed_quizzes')
def get_completed_quizzes(user_id, *args):
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

@quiz_bp.route('/get-quiz-details', methods=['POST'])
@require_auth()
def get_quiz_details(user_id, *args):
    try:
        data = request.get_json()

        if not all(field in data for field in ['quiz_type', 'quiz_id']):
            return jsonify({
                'success': False,
                'error': 'Missing quiz_type or quiz_id'
            }), 400

        quiz_type = data['quiz_type']
        quiz_id = data['quiz_id']

        quiz = quiz_utils.get_quiz_by_id_and_user(quiz_id, user_id, quiz_type)
        if not quiz:
            return jsonify({
                'success': False,
                'error': 'Quiz not found',
                'quiz_data': None
            }), 404

        quiz_data = {
            'id': quiz.id,
            'score': quiz.score,
            'total_questions': quiz.total_questions,
            'date_taken': quiz.date_taken.isoformat(),
            'total_points': quiz.total_points,
        }

        if quiz_type == 'VocabQuiz':
            quiz_data['category_name'] = quiz.category.category_name
            questions = VocabQuizQuestion.query.filter_by(quiz_id=quiz.id).all()
            questions_list = [{
                'english': q.word.english,
                'correct_answer': q.word.arabic,
                'user_answer': q.user_answer,
                'is_correct': q.is_correct,
                'points': q.points
            } for q in questions]
        else:
            questions = VerbConjugationQuizQuestion.query.filter_by(quiz_id=quiz.id).all()
            questions_list = [{
                'english_verb': q.verb_conjugation.verb.english_verb,
                'arabic_verb': q.verb_conjugation.verb.arabic_verb,
                'tense': q.verb_conjugation.tense,
                'pronoun': q.verb_conjugation.pronoun,
                'correct_answer': q.verb_conjugation.conjugation,
                'user_answer': q.user_answer,
                'is_correct': q.is_correct,
                'points': q.points
            } for q in questions]

        quiz_data['questions'] = questions_list

        return jsonify({
            'success': True,
            'user_id': user_id,
            'quiz_type': quiz_type,
            'quiz_data': quiz_data
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'quiz_data': None
        }), 500

@quiz_bp.route('/category-best-scores', methods=['POST'])
@require_auth()
def get_category_best_scores(user_id, *args):
    try:
        categories = VocabCategory.query.all()
        best_scores = []

        for category in categories:
            best_quiz = VocabQuiz.query.filter_by(
                user_id=user_id,
                category_id=category.id
            ).order_by(
                desc(VocabQuiz.score * 100.0 / VocabQuiz.total_questions)
            ).first()

            category_data = {
                'category_id': category.id,
                'category_name': category.category_name,
                'total_words': len(category.words),
                'best_score': None,
                'best_percentage': None,
                'total_attempts': VocabQuiz.query.filter_by(
                    user_id=user_id,
                    category_id=category.id
                ).count()
            }

            if best_quiz:
                category_data.update({
                    'best_score': best_quiz.score,
                    'best_percentage': round((best_quiz.score / best_quiz.total_questions) * 100, 1),
                    'quiz_date': best_quiz.date_taken.isoformat()
                })

            best_scores.append(category_data)

        return jsonify({
            'success': True,
            'best_scores': best_scores
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500