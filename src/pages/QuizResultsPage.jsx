import { useState, useEffect } from 'react';
import axios from 'axios';
import { capitaliseWords } from '../utils';
import './QuizResultsPage.css';

const QuizResultsPage = () => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [resultsDetails, setResultsDetails] = useState({});

    const getUserResults = async () => {
        const response = await axios.post('http://127.0.0.1:5000/quiz/users/1/get-results', {
            quiz_type: 'VocabQuiz',
        });

        const data = response.data;
        setResultsDetails(data.results);
        setDataLoaded(true);
    };

    useEffect(() => {
        if (!dataLoaded) {
            getUserResults();
        }
    }, [dataLoaded]);

    const layoutResultsPage = () => {
        if (!dataLoaded) {
            return "ERROR";
        }
        console.log(resultsDetails);

        var allQuestionAnswers = resultsDetails.questions;

        console.log(allQuestionAnswers);

        return (
            <div className="results-page">
                <h1 className="category-name">
                    {capitaliseWords(resultsDetails.category)}
                </h1>

                <div className="completed-date">{resultsDetails.date}</div>

                <div className="results-container">
                    <div className="total-score">
                        You got {resultsDetails.score} correct out of {resultsDetails.total}
                    </div>

                    <table className="words-container">
                        <tbody>
                            <tr className="title-row">
                                <td>English</td>
                                <td>Arabic</td>
                                <td>Mark</td>
                                <td>Your Answer</td>
                            </tr>
                            {
                                allQuestionAnswers.map((question) => (
                                    <tr className="question-row">
                                        <td>{capitaliseWords(question.question)}</td>
                                        <td>{question.correct_answer}</td>
                                        <td>{question.is_correct ? 'Correct' : 'Incorrect'}</td>
                                        <td>{question.user_answer}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        );

        return "fine";
    }

    if (!dataLoaded) {
        return <p>Loading results...</p>;
    }

    return (
        <>
        RESULTSPAGE
        {dataLoaded && layoutResultsPage()}
        </>
    );
}

export default QuizResultsPage;