import arabic_reshaper
import json
import csv
import sys
import os

class ArabicCSVsManager:
    def __init__(self) -> None:
        self.path = os.getcwd()
        self.arabicFolderPath = os.path.join("public", "arabic")

        self.wordsListsFilePath = os.path.join(self.arabicFolderPath, "WordsLists.csv")
        self.verbsConjugationFilePath = os.path.join(self.arabicFolderPath, "VerbsConjugation.csv")

        self.wordsListsFolderPath = os.path.join(self.arabicFolderPath, "words")
        self.verbsConjugationJsonPath = os.path.join(self.arabicFolderPath, "verbs", "all_verbs.json")

        self.emptyConjugation = {
            "i": "",
            "you_m": "",
            "you_f": "",
            "he": "",
            "she": "",
            "they": "",
            "we": ""
        }

    def wordsListCSVMaker(self):
        with open(os.path.join(self.wordsListsFolderPath, "index.json"), 'r', encoding='utf-8') as json_file:
            listFiles = json.load(json_file)["files"]

        with open(self.wordsListsFilePath, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)

            for fileObj in listFiles:
                with open(os.path.join(self.wordsListsFolderPath, fileObj["filename"])) as wordsFile:
                    word_data = json.load(wordsFile)["translations"]

                    writer.writerow([fileObj["title"], fileObj["filename"]])

                    for word in word_data:
                        writer.writerow([word["arabic"], word["romanized"], word["english"]])

                    writer.writerow([])


    def updateWordsFiles(self):
        all_files = {}

        with open(self.wordsListsFilePath, 'r', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for indx, row in enumerate(reader):
                if len(row) == 0 or len(row[0]) == 0:
                    all_files[filename] = word_file_data
                    continue

                elif len(row) == 2 or (len(row) == 3 and len(row[2]) == 0):
                    filename = row[1]
                    word_file_data = {
                        "title": row[0],
                        "translations": []
                    }
                    continue

                else:
                    word_file_data["translations"].append(
                        {
                            "arabic": row[0],
                            "romanized": row[1],
                            "english": row[2]
                        }
                    )
        return all_files


    def updateAllWordsFile(self):
        all_file_data = self.updateWordsFiles()
        for filename in all_file_data:
            with open(os.path.join(self.wordsListsFolderPath, filename), 'w', newline='', encoding='utf-8') as f:
                f.write(json.dumps(all_file_data[filename], ensure_ascii = False))

        index_data = {"files": []}
        for filename, word_data in all_file_data.items():
            index_data["files"].append({"title": word_data["title"], "filename": filename})

        with open(os.path.join(self.wordsListsFolderPath, "index.json"), 'w', encoding='utf-8') as index_file:
            json.dump(index_data, index_file, ensure_ascii=False)


    def verbsListCSVMaker(self):
        with open(self.verbsConjugationJsonPath, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)

        with open(self.verbsConjugationFilePath, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)

            for verb_data in data:
                present_conjugations = verb_data["conjugations"].get("present", self.emptyConjugation)
                past_conjugations = verb_data["conjugations"].get("past", self.emptyConjugation)
                future_conjugations = verb_data["conjugations"].get("future", self.emptyConjugation)

                writer.writerow([verb_data["english"], verb_data["arabic"]])
                writer.writerow(["Past", "Present", "Future", ""])

                pronouns = ['I', 'You (m)', 'You (f)', 'He', 'She', 'They', 'We']
                for past, present, future, pronoun in zip(past_conjugations.values(), present_conjugations.values(), future_conjugations.values(), pronouns):
                    writer.writerow([past, present, future, pronoun])

                writer.writerow([])

    def csvToJson(self):
        pronoun_mapping = {
            3: "i",
            4: "you_m",
            5: "you_f",
            6: "he",
            7: "she",
            8: "they",
            9: "we"
        }
        data = []

        with open(self.verbsConjugationFilePath, 'r', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for indx, row in enumerate(reader):
                csvLine = indx + 1

                if (csvLine - 1) % 11 == 0:
                    verb_data = {
                        "english": row[0],
                        "arabic": arabic_reshaper.reshape(row[1]),
                        "conjugations": {
                            "present": {},
                            "past": {},
                            "future": {}
                            }
                        }

                if (csvLine - 2) % 11 == 0: # Row heading for tenses
                    continue

                for map_index, pronoun in pronoun_mapping.items():
                    if (csvLine - map_index) % 11 == 0:
                        verb_data["conjugations"]["past"][pronoun] = arabic_reshaper.reshape(row[0])
                        verb_data["conjugations"]["present"][pronoun] = arabic_reshaper.reshape(row[1])
                        verb_data["conjugations"]["future"][pronoun] = arabic_reshaper.reshape(row[2])

                if len(row) == 0:
                    data.append(verb_data)
                    continue

        return data

    def updateVerbsConjugationFile(self):
        json_data = self.csvToJson()
        with open(self.verbsConjugationJsonPath, 'w', newline='', encoding='utf-8') as f:
            f.write(json.dumps(json_data, ensure_ascii = False))


if __name__ == "__main__":
    action_map = {
        "wordscsv": ArabicCSVsManager().wordsListCSVMaker,
        "updatewords": ArabicCSVsManager().updateAllWordsFile,
        "verbscsv": ArabicCSVsManager().verbsListCSVMaker,
        "updateverbs": ArabicCSVsManager().updateVerbsConjugationFile
    }

    if len(sys.argv) != 2:
        print("Usage: python script_name.py <action>")
        print("Available actions:")
        print(" - wordscsv")
        print(" - updatewords")
        print(" - verbscsv")
        print(" - updateverbs")
    else:
        action = sys.argv[1]
        if action not in action_map:
            print("Invalid action. Please choose one of the available actions.")
        else:
            action_map[action]()
