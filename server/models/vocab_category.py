from . import db

class VocabCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(255), nullable=False)
    words = db.relationship('VocabWord', backref='vocab_category')

    def __repr__(self):
        return f'<Category "{self.category_name}">'
