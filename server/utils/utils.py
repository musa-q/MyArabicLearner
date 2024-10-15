from ..models import db, User, Verb, VerbConjugation, VocabWord, VocabCategory, VerbConjugationQuiz, VocabQuiz, VerbConjugationQuizQuestion, VocabQuizQuestion
from sqlalchemy import desc
from typing import Optional, Union

class Utils:
    def __init__(self) -> None:
        self.list_tenses = ['past', 'present', 'future']
        self.list_pronouns = ["i", "you_m", "you_f", "he", "she", "they", "we"]

    def get_verb_id_from_english(self, verb_input: str) -> Optional[int]:
        verb = Verb.query.filter((Verb.english_verb == verb_input) | (Verb.arabic_verb == verb_input)).first()
        if verb:
            return verb.id
        return None

    def get_category_id_from_category_name(self, category_input: str) -> Optional[int]:
        category = VocabCategory.query.filter(VocabCategory.category_name == category_input).first()
        if category:
            return category.id
        return None

    def check_is_tense(self, tense_input: str) -> bool:
        if tense_input in self.list_tenses:
            return True
        return False

    def check_is_pronoun(self, pronoun_input: str) -> bool:
        if pronoun_input in self.list_pronouns:
            return True
        return False

    def retry(self, attempts, command, should_retry, on_error=None):
        last_exception = None
        for attempt in range(1, attempts + 1):
            try:
                result = command()
                if result:
                    return result
            except Exception as e:
                last_exception = e

                if attempt == attempts:
                    if last_exception:
                        raise last_exception

                if not should_retry():
                    if last_exception:
                        raise last_exception

                if on_error:
                    on_error()

