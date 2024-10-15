from . import db
from datetime import datetime

class VocabQuiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('vocab_category.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    total_questions = db.Column(db.Integer, nullable=False)
    date_taken = db.Column(db.DateTime, nullable=False, default=datetime.now)

    category = db.relationship('VocabCategory', backref=db.backref('quizzes', lazy=True))
    questions = db.relationship('VocabQuizQuestion', cascade='all, delete-orphan', backref='quiz', lazy=True)

    __table_args__ = (db.UniqueConstraint('user_id', 'date_taken', name='uq_user_date'),)

    def __repr__(self):
        return f'<VocabQuiz {self.id} - User {self.user_id} - Category {self.category_id}>'

class VocabQuizQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('vocab_quiz.id'), nullable=False)
    word_id = db.Column(db.Integer, db.ForeignKey('vocab_word.id'), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)
    is_answered = db.Column(db.Boolean, nullable=False)
    user_answer = db.Column(db.String, nullable=True)

    word = db.relationship('VocabWord', backref=db.backref('quiz_questions', lazy=True))

    def __repr__(self):
        return f'<VocabQuizQuestion {self.id} - Quiz {self.quiz_id} - Word {self.word_id}>'
