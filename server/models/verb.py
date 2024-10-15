from . import db

class Verb(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    english_verb = db.Column(db.String(255), unique=True, nullable=False)
    transliteration_verb = db.Column(db.String(255))
    arabic_verb = db.Column(db.String(255), unique=True, nullable=False)
    conjugations = db.relationship('VerbConjugation', backref='verb')

    def __repr__(self):
        return f'<Verb "{self.english_verb}">'
