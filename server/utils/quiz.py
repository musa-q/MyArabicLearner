from ..models import db, User, Verb, VerbConjugation, VocabWord, VocabCategory, VerbConjugationQuiz, VocabQuiz, VerbConjugationQuizQuestion, VocabQuizQuestion
from sqlalchemy import desc
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from typing import Optional, Union

class QuizUtils:
    def get_quiz_by_id_and_user(self, quiz_id, user_id, quiz_type = 'VocabQuiz'):
        try:
            if quiz_type == 'VocabQuiz':
                return VocabQuiz.query.filter_by(id=quiz_id, user_id=user_id).first()
            elif quiz_type == 'VerbConjugationQuiz':
                return VerbConjugationQuiz.query.filter_by(id=quiz_id, user_id=user_id).first()
            return None
        except SQLAlchemyError as e:
            return None

    def get_current_quiz(self, quiz_type: str, user_id: int) -> Optional[Union[VocabQuiz, VerbConjugationQuiz]]:
        try:
            if quiz_type == 'VocabQuiz':
                return VocabQuiz.query.filter_by(user_id=user_id).order_by(desc(VocabQuiz.date_taken)).first()
            elif quiz_type == 'VerbConjugationQuiz':
                return VerbConjugationQuiz.query.filter_by(user_id=user_id).order_by(desc(VerbConjugationQuiz.date_taken)).first()
            return None
        except SQLAlchemyError as e:
            return None

    def check_all_questions_answered(self, quiz_type: str, user_id: int):
        try:
            current_quiz = self.get_current_quiz(quiz_type, user_id)
            if not current_quiz:
                return False

            if quiz_type == 'VocabQuiz':
                unanswered = VocabQuizQuestion.query.filter_by(
                    quiz_id=current_quiz.id,
                    is_answered=False
                ).count()
            else:
                unanswered = VerbConjugationQuizQuestion.query.filter_by(
                    quiz_id=current_quiz.id,
                    is_answered=False
                ).count()

            return unanswered == 0

        except SQLAlchemyError as e:
            return False

    def get_next_question(self, quiz_type: str, user_id: int):
        try:
            current_quiz = self.get_current_quiz(quiz_type, user_id)
            if not current_quiz:
                return None, None

            if quiz_type == 'VocabQuiz':
                next_question = VocabQuizQuestion.query.filter_by(
                    quiz_id=current_quiz.id,
                    is_answered=False
                ).first()

                if not next_question:
                    return None, None

                return next_question, {
                    'english': next_question.word.english,
                    'question_id': next_question.id,
                    'quiz_id': next_question.quiz_id,
                    'word_id': next_question.word_id
                }

            elif quiz_type == 'VerbConjugationQuiz':
                next_question = VerbConjugationQuizQuestion.query.filter_by(
                    quiz_id=current_quiz.id,
                    is_answered=False
                ).first()

                if not next_question:
                    return None, None

                return next_question, {
                    'english_verb': next_question.verb_conjugation.verb.english_verb,
                    'arabic_verb': next_question.verb_conjugation.verb.arabic_verb,
                    'tense': next_question.verb_conjugation.tense,
                    'pronoun': next_question.verb_conjugation.pronoun,
                    'question_id': next_question.id,
                    'quiz_id': next_question.quiz_id,
                    'verb_conjugation_id': next_question.verb_conjugation_id
                }

        except SQLAlchemyError as e:
            return None, None

    def get_quiz_answer(self, quiz_type: str, user_id: int):
        try:
            current_quiz = self.get_current_quiz(quiz_type, user_id)
            if not current_quiz:
                return None

            if quiz_type == 'VocabQuiz':
                current_question = VocabQuizQuestion.query.filter_by(
                    quiz_id=current_quiz.id,
                    is_answered=False
                ).first()
                return current_question.word.arabic if current_question else None

            elif quiz_type == 'VerbConjugationQuiz':
                current_question = VerbConjugationQuizQuestion.query.filter_by(
                    quiz_id=current_quiz.id,
                    is_answered=False
                ).first()
                return current_question.verb_conjugation.conjugation if current_question else None

        except SQLAlchemyError as e:
            return None

    def normalize_arabic(self, text):
        if not isinstance(text, str):
            return ""

        replacements = {
            'أ': 'ا',
            'إ': 'ا',
            'آ': 'ا',
            'ٱ': 'ا',
            'ة': 'ه',
            'ى': 'ي',
            '\u200b': '',
            '\u200e': '',
            '\u200f': ''
        }

        normalized = text.strip()
        for old, new in replacements.items():
            normalized = normalized.replace(old, new)

        return normalized

    def calculate_question_points(self, correct_answer: bool, streak: int):
        if correct_answer:
            streak_bonus = 2 * streak if streak > 1 else 0
            points = 10 + streak_bonus
        else:
            points = -5
        return points

    def answer_current_quiz_question(self, quiz_type: str, user_id: int, user_answer: str, question_id: int, time_remaining: int, streak: int, timeout: bool = False):
        try:
            if not question_id:
                return False, None

            if quiz_type == 'VocabQuiz':
                question = VocabQuizQuestion.query.get(question_id)
            else:
                question = VerbConjugationQuizQuestion.query.get(question_id)

            if not question or question.is_answered:
                return None, None

            quiz = question.quiz
            if quiz.user_id != user_id:
                return False, None

            db.session.begin_nested()

            if timeout or not user_answer.strip():
                is_correct = False
                points = -5
            else:
                normalized_answer = self.normalize_arabic(user_answer.strip())
                if quiz_type == 'VocabQuiz':
                    is_correct = normalized_answer == self.normalize_arabic(question.word.arabic)
                else:
                    is_correct = normalized_answer == self.normalize_arabic(question.verb_conjugation.conjugation)

                points = self.calculate_question_points(is_correct, streak)

            question.is_answered = True
            question.user_answer = user_answer.strip() if user_answer else ''
            question.is_correct = is_correct
            question.points = points
            question.answered_at = datetime.utcnow()

            quiz.total_points += points
            if is_correct:
                quiz.score += 1

            db.session.commit()
            return True, question

        except IntegrityError:
            db.session.rollback()
            return False, None
        except SQLAlchemyError as e:
            db.session.rollback()
            return False, None

    def get_highest_points(self, quiz_type: str, user_id: int):
        try:
            if quiz_type == 'VocabQuiz':
                quiz = VocabQuiz.query.filter_by(user_id=user_id).order_by(desc(VocabQuiz.total_points)).first()
            else:
                quiz = VerbConjugationQuiz.query.filter_by(user_id=user_id).order_by(desc(VerbConjugationQuiz.total_points)).first()
            return quiz.total_points if quiz else None
        except SQLAlchemyError as e:
            return None

    def get_quiz_results(self, quiz_type: str, user_id: int):
        try:
            current_quiz = self.get_current_quiz(quiz_type, user_id)
            if not current_quiz:
                return None

            if not self.check_all_questions_answered(quiz_type, user_id):
                return None

            highest_points = self.get_highest_points(quiz_type, user_id)

            if quiz_type == 'VocabQuiz':
                questions = [{
                    'question_id': q.id,
                    'question': q.word.english,
                    'user_answer': q.user_answer,
                    'correct_answer': q.word.arabic,
                    'is_correct': q.is_correct,
                    'points': q.points
                } for q in current_quiz.questions]

                return {
                    'score': current_quiz.score,
                    'total': current_quiz.total_questions,
                    'category': current_quiz.category.category_name,
                    'username': current_quiz.user.username,
                    'date': current_quiz.date_taken,
                    'total_points': current_quiz.total_points,
                    'highest_points': highest_points,
                    'questions': questions
                }
            else:
                questions = [{
                    'question_id': q.id,
                    'english_verb': q.verb_conjugation.verb.english_verb,
                    'arabic_verb': q.verb_conjugation.verb.arabic_verb,
                    'tense': q.verb_conjugation.tense,
                    'pronoun': q.verb_conjugation.pronoun,
                    'user_answer': q.user_answer,
                    'correct_answer': q.verb_conjugation.conjugation,
                    'is_correct': q.is_correct,
                    'points': q.points
                } for q in current_quiz.questions]

                return {
                    'score': current_quiz.score,
                    'total': current_quiz.total_questions,
                    'username': current_quiz.user.username,
                    'date': current_quiz.date_taken,
                    'total_points': current_quiz.total_points,
                    'highest_points': highest_points,
                    'questions': questions
                }

        except SQLAlchemyError as e:
            return None

    def get_completed_quizzes_info(self, quiz_type: str, user_id: int):
        try:
            if quiz_type == 'VocabQuiz':
                quizzes = VocabQuiz.query.filter_by(user_id=user_id, quiz_finished=True).order_by(desc(VocabQuiz.date_taken)).all()
            else:
                quizzes = VerbConjugationQuiz.query.filter_by(user_id=user_id, quiz_finished=True).order_by(desc(VerbConjugationQuiz.date_taken)).all()

            completed_quizzes = []
            for quiz in quizzes:
                if all(question.is_answered for question in quiz.questions):
                    quiz_info = {
                        'quiz_id': quiz.id,
                        'date_completed': quiz.date_taken,
                        'score': quiz.score,
                        'total_questions': quiz.total_questions,
                        'total_points': quiz.total_points,
                        'quiz_type': quiz_type,
                    }
                    if quiz_type == 'VocabQuiz':
                        quiz_info['category'] = quiz.category.category_name
                    else:
                        quiz_info['category'] = 'Verb Conjugation'
                    completed_quizzes.append(quiz_info)

            return completed_quizzes

        except SQLAlchemyError as e:
            return None