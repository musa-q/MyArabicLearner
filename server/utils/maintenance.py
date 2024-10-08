from ..models import db, User, VocabWord, VocabCategory
from sqlalchemy.orm.exc import NoResultFound

class MaintenanceUtils:
    def update_flashcard(self, category_name, english, new_arabic, new_transliteration):
        try:
            category = VocabCategory.query.filter_by(category_name=category_name).one()
            word = VocabWord.query.filter_by(category_id=category.id, english=english).one()

            word.arabic = new_arabic
            word.transliteration = new_transliteration

            db.session.commit()

            return True, "Flashcard updated successfully"
        except NoResultFound:
            return False, "Category or word not found"
        except Exception as e:
            db.session.rollback()
            return False, f"An error occurred: {str(e)}"