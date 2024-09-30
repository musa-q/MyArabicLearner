from . import db
from datetime import datetime

class VerbConjugationQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    date_taken = db.Column(db.DateTime, nullable=False, default=datetime.now)

    user = db.relationship('User', backref=db.backref('verb_conjugation_quizzes', lazy=True))
    questions = db.relationship('VerbConjugationQuizQuestion', backref='quiz', lazy=True)

    __table_args__ = (db.UniqueConstraint('user_id', 'date_taken', name='uq_user_date'),)

    def __repr__(self):
        return f'<VerbConjugationQuiz {self.id} - User {self.user_id}>'

class VerbConjugationQuizQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('verb_conjugation_quiz.id'), nullable=False)
    verb_conjugation_id = db.Column(db.Integer, db.ForeignKey('verb_conjugation.id'), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)
    is_answered = db.Column(db.Boolean, nullable=False)
    user_answer = db.Column(db.String, nullable=True)

    verb_conjugation = db.relationship('VerbConjugation', backref=db.backref('quiz_questions', lazy=True))

    def __repr__(self):
        return f'<VerbConjugationQuizQuestion {self.id} - Quiz {self.quiz_id} - Conjugation {self.verb_conjugation_id}>'
