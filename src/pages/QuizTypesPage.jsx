import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import WordsPracticePage from './WordsPracticePage';
import VerbsPage from './VerbsPage';
import './QuizTypesPage.css';

const QuizTypesPage = () => {
    const [quizType, setQuizType] = useState(null);

    const chooseQuizType = () => {
        return (
            <div className="choose-type-container">
                <h1>Choose a quiz type</h1>
                <div className="buttons-list">
                    <Button className="button p-3"
                        variant="outline-light"
                        type="button"
                        onClick={() => clickQuizType('VocabQuiz')}>
                        Vocab Quiz
                    </Button>

                    <Button className="button p-3"
                        variant="outline-light"
                        type="button"
                        onClick={() => clickQuizType('VerbConjugationQuiz')}>
                        Verb Conjugation Quiz
                    </Button>
                </div>
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
        <div>
            {quizType === null ? chooseQuizType() : loadQuizPage()}
        </div>
    );
};

export default QuizTypesPage;
