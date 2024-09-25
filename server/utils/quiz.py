from ..models import db, User, Verb, VerbConjugation, VocabWord, VocabCategory, VerbConjugationQuiz, VocabQuiz, VerbConjugationQuizQuestion, VocabQuizQuestion
from sqlalchemy import desc
from typing import Optional, Union

class QuizUtils:
    def get_quiz_by_id_and_user(self, quiz_id, user_id):
        quiz = VocabQuiz.query.filter_by(id=quiz_id, user_id=user_id).first()
        return quiz

    def get_current_quiz(self, quiz_type: str, user_id: int) -> Optional[Union[VocabQuiz, VerbConjugationQuiz]]:
        if quiz_type == 'VocabQuiz':
            return VocabQuiz.query.filter_by(user_id=user_id).order_by(desc(VocabQuiz.date_taken)).first()
        elif quiz_type == 'VerbConjugationQuiz':
            return VerbConjugationQuiz.query.filter_by(user_id=user_id).order_by(desc(VerbConjugationQuiz.date_taken)).first()
        return None

    def get_next_last_answered(self, quiz_type: str, user_id: int):
        current_quiz = self.get_current_quiz(quiz_type, user_id)
        if current_quiz is None:
            return None

        if quiz_type == 'VocabQuiz':
            next_question_obj = VocabQuizQuestion.query.filter_by(quiz_id=current_quiz.id, is_answered=True).order_by(desc(VocabQuizQuestion.id)).first()
            next_question = {
                'english': next_question_obj.word.english,
                'question_id': next_question_obj.id,
                'quiz_id': next_question_obj.quiz_id,
                'word_id': next_question_obj.word_id
            }
        elif quiz_type == 'VerbConjugationQuiz':
            next_question_obj = VerbConjugationQuizQuestion.query.filter_by(quiz_id=current_quiz.id, is_answered=True).order_by(desc(VerbConjugationQuizQuestion.id)).first()
            next_question = {
                'tense': next_question_obj.verb_conjugation.tense,
                'pronoun': next_question_obj.verb_conjugation.pronoun,
                'question_id': next_question_obj.id,
                'quiz_id': next_question_obj.quiz_id,
                'verb_conjugation_id': next_question_obj.verb_conjugation_id
            }
        else:
            return None
        return next_question_obj, next_question

    def check_all_questions_answered(self, quiz_type: str, user_id: int):
        current_quiz = self.get_current_quiz(quiz_type, user_id)
        if current_quiz is None:
            return False

        if quiz_type == 'VocabQuiz':
            last_question = VocabQuizQuestion.query.filter_by(quiz_id=current_quiz.id, is_answered=True).order_by(desc(VocabQuizQuestion.id)).first()
            if last_question is None:
                return False

            answered_questions_count = VocabQuizQuestion.query.filter_by(quiz_id=current_quiz.id, is_answered=True).count()
            if answered_questions_count < current_quiz.total_questions:
                return False

        return True

    def get_next_question(self, quiz_type: str, user_id: int):
        current_quiz = self.get_current_quiz(quiz_type, user_id)
        if current_quiz is None:
            return None, None

        if quiz_type == 'VocabQuiz':
            next_question_obj = VocabQuizQuestion.query.filter_by(quiz_id=current_quiz.id, is_answered=False).first()
            if not next_question_obj:
                return None, None
            next_question = {
                'english': next_question_obj.word.english,
                'question_id': next_question_obj.id,
                'quiz_id': next_question_obj.quiz_id,
                'word_id': next_question_obj.word_id
            }
        elif quiz_type == 'VerbConjugationQuiz':
            next_question_obj = VerbConjugationQuizQuestion.query.filter_by(quiz_id=current_quiz.id, is_answered=False).first()
            if not next_question_obj:
                return None, None
            next_question = {
                'tense': next_question_obj.verb_conjugation.tense,
                'pronoun': next_question_obj.verb_conjugation.pronoun,
                'question_id': next_question_obj.id,
                'quiz_id': next_question_obj.quiz_id,
                'verb_conjugation_id': next_question_obj.verb_conjugation_id
            }
        else:
            return None

        return next_question_obj, next_question

    def get_quiz_answer(self, quiz_type: str, user_id: int):
        current_quiz = self.get_current_quiz(quiz_type, user_id)
        if not current_quiz:
            return None
        current_question_obj, _ = self.get_next_question(quiz_type, user_id)
        if not current_question_obj:
            return None

        if quiz_type == 'VocabQuiz':
            print([current_question_obj.word.english, current_question_obj.word.arabic])
            return current_question_obj.word.arabic
        elif quiz_type == 'VerbConjugationQuiz':
            return current_question_obj.verb_conjugation.conjugation

    def answer_current_quiz_question(self, quiz_type: str, user_id: int, user_answer: str):
        current_quiz = self.get_current_quiz(quiz_type, user_id)
        if not current_quiz:
            return False, None
        current_question_obj, _ = self.get_next_question(quiz_type, user_id)
        if not current_question_obj:
            return None, None

        try:
            current_question_obj.is_answered =  True
            current_question_obj.user_answer = user_answer
            if quiz_type == 'VocabQuiz':
                if (user_answer == current_question_obj.word.arabic):
                    current_question_obj.is_correct = True
                    current_quiz.score += 1
            elif quiz_type == 'VerbConjugationQuiz':
                if (user_answer == current_question_obj.verb_conjugation.conjugation):
                    current_question_obj.is_correct = True
                    current_quiz.score += 1

            db.session.commit()
            return True, current_question_obj
        except:
            return False, None

    def get_quiz_results(self, quiz_type: str, user_id: int):
        current_quiz = self.get_current_quiz(quiz_type, user_id)
        if current_quiz is None:
            return None
        if quiz_type == 'VocabQuiz':
            questions = [
                {
                    'question_id': q.id,
                    'question': q.word.english,
                    'user_answer': q.user_answer,
                    'correct_answer': q.word.arabic,
                    'is_correct': q.is_correct,
                }
                for q in current_quiz.questions
            ]

        results = {
            'score': current_quiz.score,
            'total': current_quiz.total_questions,
            'category': current_quiz.category.category_name,
            'username': current_quiz.user.username,
            'date': current_quiz.date_taken,
            'questions': questions,
        }

        return results

    def get_completed_quizzes_info(self, quiz_type: str, user_id: int):
        if quiz_type == 'VocabQuiz':
            quizzes = VocabQuiz.query.filter_by(user_id=user_id).order_by(desc(VocabQuiz.date_taken)).all()
        elif quiz_type == 'VerbConjugationQuiz':
            quizzes = VerbConjugationQuiz.query.filter_by(user_id=user_id).order_by(desc(VerbConjugationQuiz.date_taken)).all()
        else:
            return None

        completed_quizzes_info = []
        for quiz in quizzes:
            all_answered = all(question.is_answered for question in quiz.questions)
            if all_answered:
                quiz_info = {
                    'quiz_id': quiz.id,
                    'date_completed': quiz.date_taken,
                    'score': quiz.score,
                    'total_questions': quiz.total_questions,
                    'category': quiz.category.category_name if quiz_type == 'VocabQuiz' else 'Verb Conjugation'
                }
                completed_quizzes_info.append(quiz_info)

        return completed_quizzes_info

