import { useState } from 'react';
import ChooseWordsPage from './ChooseWordsPage';
import FlashCardsPage from './FlashCardsPage';

// Renders either choose page or flash cards
const WordsFlashcardsPage = () => {
    const [chosenWordsList, setChosenWordsList] = useState("choose");
    const [categoryName, setCategoryname] = useState(null);

    const updateCategoryName = (inputName) => {
        setCategoryname(inputName);
    };

    const chooseWordsList = (listChoice) => {
        setChosenWordsList(listChoice);
    };

    return (
        <div className="words-page-container">
            {chosenWordsList === "choose" && <ChooseWordsPage onChoose={chooseWordsList} title={"Flashcards"} setCategoryname={updateCategoryName} />}
            {chosenWordsList !== "choose" && <FlashCardsPage wordsList={chosenWordsList} title={categoryName} />}
        </div>
    );
};

export default WordsFlashcardsPage;
