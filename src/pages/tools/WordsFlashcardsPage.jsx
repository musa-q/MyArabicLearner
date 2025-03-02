import { useState } from 'react';
import ChooseWordsPage from '../ChooseWordsPage';
import FlashCardsPage from './FlashCardsPage';

const WordsFlashcardsPage = () => {
    const [chosenWordsList, setChosenWordsList] = useState("choose");
    const [categoryName, setCategoryname] = useState(null);

    const updateCategoryName = (inputName) => {
        setCategoryname(inputName);
    };

    const chooseWordsList = (listChoice) => {
        setChosenWordsList(listChoice);
    };

    const handleBack = () => {
        setChosenWordsList("choose");
    };

    return (
        <div className="words-page-container" style={{ minHeight: "100vh" }}>
            {chosenWordsList === "choose" && (
                <ChooseWordsPage
                    onChoose={chooseWordsList}
                    title={"Flashcards"}
                    setCategoryname={updateCategoryName}
                />
            )}
            {chosenWordsList !== "choose" && (
                <FlashCardsPage
                    wordsList={chosenWordsList}
                    category_name={categoryName}
                    onBack={handleBack}
                />
            )}
        </div>
    );
};

export default WordsFlashcardsPage;