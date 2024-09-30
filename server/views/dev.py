from flask import Blueprint, request, jsonify
import os
import json
from ..models import db, User, Verb, VerbConjugation, VocabCategory, VocabWord, VocabQuiz, VocabQuizQuestion, VerbConjugationQuiz, VerbConjugationQuizQuestion
from ..utils import utils

class PopulateDB:
    def __init__(self):
        self.arabic_folder_path = os.path.join('public', 'arabic')
        self.words_path = os.path.join(self.arabic_folder_path, 'words')
        self.verbs_path = os.path.join(self.arabic_folder_path, 'verbs', 'all_verbs.json')

    def loop_through_dir(self, dir):
        if os.path.isdir(dir):
            folder_contents = os.listdir(dir)

            for item in folder_contents:
                yield item

    def push_title(self, category_name):
        previous_category = VocabCategory.query.filter(VocabCategory.category_name == category_name).first()
        if previous_category:
            print("Category already exists:", category_name)
            return previous_category.id

        vocab_category = VocabCategory(
            category_name=category_name,
        )
        db.session.add(vocab_category)
        db.session.commit()
        return vocab_category.id

    def push_translations(self, category_id, translations):
        for translation in translations:
            english = translation['english'].lower()
            transliteration = translation['romanized']
            arabic = translation['arabic']

            vocab_word = VocabWord(
                category_id=category_id,
                english=english,
                transliteration=transliteration,
                arabic=arabic,
            )
            db.session.add(vocab_word)

    def handle_words_json(self, json_data):
        title = json_data['title'].lower()
        translations = json_data['translations']

        category_id = self.push_title(title)
        self.push_translations(category_id, translations)
        db.session.commit()
        print("Added category:", title)

    def start_words(self):
        for file_name in self.loop_through_dir(self.words_path):
            if file_name == 'index.json':
                continue

            file_path = os.path.join(self.words_path, file_name)

            with open(file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                self.handle_words_json(data)

    def push_verb(self, english_verb, arabic_verb):
        previous_verb = Verb.query.filter(Verb.english_verb == english_verb).first()
        if previous_verb:
            print("Verb already exists:", english_verb)
            return previous_verb.id

        verb = Verb(
            english_verb=english_verb,
            arabic_verb=arabic_verb,
        )
        db.session.add(verb)
        db.session.commit()
        return verb.id

    def push_conjugations(verb_id, all_conjugations):
        for tense in utils.list_tenses:
            for pronoun in utils.list_pronouns:
                conjug = VerbConjugation(
                    verb_id=verb_id,
                    tense=tense,
                    pronoun=pronoun,
                    conjugation=all_conjugations['tense']['pronoun'],
                )
                db.session.add(conjug)

    def push_conjugations(self, verb_id, all_conjugations):
        for tense in utils.list_tenses:
            if tense in all_conjugations:
                for pronoun, conjugation in all_conjugations[tense].items():
                    try:
                        conjug = VerbConjugation(
                            verb_id=verb_id,
                            tense=tense,
                            pronoun=pronoun,
                            conjugation=conjugation,
                        )
                        db.session.add(conjug)
                    except Exception as e:
                        print(f"Error processing. {str(e)}")

    def handle_verbs_json(self, json_data):
        english_verb = json_data['english'].lower()
        arabic_verb = json_data['arabic']
        all_conjugations = json_data['conjugations']

        verb_id = self.push_verb(english_verb, arabic_verb)
        self.push_conjugations(verb_id, all_conjugations)
        db.session.commit()
        print("Added verb:", english_verb)

    def start_verbs(self):
        with open(self.verbs_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            for verb_data in data:
                self.handle_verbs_json(verb_data)

populateDb = PopulateDB()

dev_bp = Blueprint('dev', __name__)

@dev_bp.route('/start-words', methods=['GET'])
def start_words():
    populateDb.start_words()
    return jsonify({"message": "Words processing started"}), 200

@dev_bp.route('/start-verbs', methods=['GET'])
def start_verbs():
    populateDb.start_verbs()
    return jsonify({"message": "Verbs processing started"}), 200
