from ..models import db, User, VocabWord, VocabCategory
from sqlalchemy.orm.exc import NoResultFound

class MaintenanceUtils:
    def update_flashcard(self, word_id, category_name, new_english, new_arabic, new_transliteration):
        try:
            category = VocabCategory.query.filter_by(category_name=category_name).one()
            word = VocabWord.query.filter_by(category_id=category.id, id=word_id).one()

            word.english = new_english
            word.arabic = new_arabic
            word.transliteration = new_transliteration

            db.session.commit()

            return True, "Flashcard updated successfully"
        except NoResultFound:
            return False, "Category or word not found"
        except Exception as e:
            db.session.rollback()
            return False, f"An error occurred: {str(e)}"

    def add_flashcard(self, category_id, english, arabic, transliteration):
        try:
            category = VocabCategory.query.get(category_id)
            if not category:
                return False, "Category not found"

            existing_word = VocabWord.query.filter_by(
                category_id=category_id,
                english=english
            ).first()

            if existing_word:
                return False, "A word with this English translation already exists in this category"

            new_word = VocabWord(
                category_id=category_id,
                english=english,
                arabic=arabic,
                transliteration=transliteration
            )

            db.session.add(new_word)
            db.session.commit()

            return True, "Word added successfully"
        except Exception as e:
            db.session.rollback()
            return False, f"An error occurred: {str(e)}"

    def update_category(self, category_id, new_name):
        try:
            category = VocabCategory.query.get(category_id)
            if not category:
                return False, "Category not found"

            existing_category = VocabCategory.query.filter_by(category_name=new_name).first()
            if existing_category and existing_category.id != category_id:
                return False, "A category with this name already exists"

            category.category_name = new_name
            db.session.commit()

            return True, "Category updated successfully"
        except Exception as e:
            db.session.rollback()
            return False, f"An error occurred: {str(e)}"

    def add_category(self, category_name):
        try:
            existing_category = VocabCategory.query.filter_by(category_name=category_name).first()
            if existing_category:
                return False, "A category with this name already exists"

            new_category = VocabCategory(category_name=category_name)
            db.session.add(new_category)
            db.session.commit()

            return True, "Category added successfully"
        except Exception as e:
            db.session.rollback()
            return False, f"An error occurred: {str(e)}"

    def delete_category(self, category_id):
        try:
            category = VocabCategory.query.get(category_id)
            if not category:
                return False, "Category not found"

            word_count = VocabWord.query.filter_by(category_id=category_id).count()
            if word_count > 0:
                return False, f"Cannot delete category: it contains {word_count} words. Please delete or move these words first."

            db.session.delete(category)
            db.session.commit()

            return True, "Category deleted successfully"
        except Exception as e:
            db.session.rollback()
            return False, f"An error occurred: {str(e)}"