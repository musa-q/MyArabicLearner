import { useState, useEffect } from 'react';
import ChooseWordsPage from './ChooseWordsPage';
import WordsPracticeQuestionPage from './WordsPracticeQuestionPage';
import axios from 'axios';
import { API_URL } from '../config';

// Renders either choose page or flash cards
const WordsPracticePage = () => {
    const [chosenWordsList, setChosenWordsList] = useState("choose");
    const [quizId, setQuizId] = useState(null);
    const [categoryName, setCategoryname] = useState(null);

    const updateCategoryName = (inputName) => {
        setCategoryname(inputName);
    };

    const chooseWordsList = (listChoice) => {
        createQuiz(listChoice);
    };

    const createQuiz = async (listChoice) => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.post(`${API_URL}/quiz/create-vocab-quiz`,
                {
                    category_id: listChoice
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setQuizId(response.data.quiz_id);
            setChosenWordsList(listChoice);
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };

    return (
        <div className="words-page-container">
            {chosenWordsList === "choose" && <ChooseWordsPage onChoose={chooseWordsList} title={"Practice words"} setCategoryname={updateCategoryName} />}
            {chosenWordsList !== "choose" && <WordsPracticeQuestionPage quizId={quizId} pageTitle={categoryName} />}
        </div>
    );
};

export default WordsPracticePage;
