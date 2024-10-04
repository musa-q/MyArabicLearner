import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import WordsPracticePage from './WordsPracticePage';
import VerbsPage from './VerbsPage';

const QuizTypesPage = () => {
    const [quizType, setQuizType] = useState(null);

    const chooseQuizType = () => {
        return (
            <div>
                <h1>Choose a quiz type</h1>
                <Button variant="primary" onClick={() => clickQuizType('VocabQuiz')}>Vocab Quiz</Button>
                <Button variant="primary" onClick={() => clickQuizType('VerbConjugationQuiz')}>Verb Conjugation Quiz</Button>
            </div>
        );
    };

    const clickQuizType = (userType) => {
        setQuizType(userType);
    };

    const loadQuizPage = () => {
        if (quizType === 'VocabQuiz') {
            return <WordsPracticePage />;
        } else if (quizType === 'VerbConjugationQuiz') {
            return <VerbsPage />;
        }
        return null;
    };

    return (
        <div className="quiz-types-page">
            {quizType === null ? chooseQuizType() : loadQuizPage()}
        </div>
    );
};

export default QuizTypesPage;
