from . import db

class VerbConjugation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    verb_id = db.Column(db.Integer, db.ForeignKey('verb.id'))
    tense = db.Column(db.String(100), nullable=False)
    pronoun = db.Column(db.String(100), nullable=False)
    conjugation = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<VerbConjugation "{self.conjugation}">'
