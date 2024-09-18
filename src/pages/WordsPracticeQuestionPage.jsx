import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect, useState } from 'react';
import './WordsVerbsPracticePage.css';
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { capitaliseWords } from '../utils';
import axios from 'axios';
import QuizResultsPage from './QuizResultsPage';

// Practice words by typing
const WordsPracticeQuestionPage = ({ quizId, pageTitle }) => {
    // const [dataLoaded, setDataLoaded] = useState(false);
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [showHintButton, setShowHintButton] = useState(true);
    const [showNextButton, setShowNextButton] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [resultMessage, setResultMessage] = useState("");
    const [hint, setHint] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showResultsPage, setShowResultsPage] = useState(false);
    const [loading, setLoading] = useState(true);

    const processText = (word) => {
        return word.trim().toLowerCase();
    }

    const checkAnswer = async () => {
        if (currentAnswer == "" || currentAnswer == null) {
            setResultMessage("Please answer!");
            return;
        }
        // if (resultMessage != "Please answer!" && resultMessage != "" || resultMessage == null) {
        //     console.log(resultMessage, 'ssafsaf');
        //     return;
        // }
        var guess = processText(currentAnswer);

        const token = localStorage.getItem('authToken');
        const response = await axios.post('http://127.0.0.1:5000/quiz/send-answer',
            {
                quiz_type: 'VocabQuiz',
                user_answer: guess,
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        const data = response.data;
        if (data.answer_response == true) {
            setResultMessage("Correct!");
            setShowNextButton(true);
            setShowHintButton(false);
        } else if (data.answer_response == false) {
            setResultMessage("Incorrect!");
            setShowNextButton(true);
        } else {
            console.error('Error. Unable to send answer');
        }
    }

    const nextQuestion = async () => {
        setLoading(true);

        if (currentAnswer == "") {
            setResultMessage("Please answer!");
        }
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://127.0.0.1:5000/quiz/get-next-question',
                {
                    quiz_type: 'VocabQuiz',
                    quiz_id: quizId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = response.data;
            console.log('DADATA', data, quizId);
            if (data.all_answered == true) {
                setShowResultsPage(true);
                return;
            }

            setHint(data.hint);
            setCurrentQuestion(data.question.english);
            setCurrentAnswer("");
            setResultMessage("");
            setShowHintButton(true);
            setRevealAnswer(false);
            // setDataLoaded(true);
            setShowNextButton(false);
        } catch (error) {
            console.error("Error fetching the next question", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const showAnswerClicked = () => {
        setRevealAnswer(!revealAnswer);
    }

    const handleEnterKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (resultMessage === "Correct!" || resultMessage === "Incorrect!") {
                nextQuestion();
            } else {
                checkAnswer();
            }
        } else if (e.ctrlKey) {
            e.preventDefault();
            if (resultMessage === "Incorrect!") {
                setRevealAnswer(true);
            }
        }
    };

    useEffect(() => {
        nextQuestion();
    }, []);

    // useEffect(() => {
    //     if (!dataLoaded) {
    //         nextQuestion();
    //     }
    // }, [dataLoaded]);

    if (loading) {
        return <p>Loading...</p>;
    }

    const questionPage = () => {
        return (
            <div className="practice-page-container">
                <ToastContainer position="bottom-end" className="p-3 toast-container" style={{ zIndex: 1, display: window.innerWidth > 768 ? 'block' : 'none' }}>
                    <Toast>
                        <Toast.Header>
                            <strong className="me-auto">Keyboard Shortcuts</strong>
                        </Toast.Header>
                        <Toast.Body>
                            Enter: check answer/move to next question
                            <br />
                            Ctrl: reveal the answer
                        </Toast.Body>
                    </Toast>
                </ToastContainer>

                <h1>{capitaliseWords(pageTitle)}</h1>
                <Card className="practice-container">
                    <ListGroup variant="flush">
                        <div className="info-text">
                            {currentQuestion && (
                                <>
                                    <Card.Header>Translate to Arabic</Card.Header>
                                    <h2 className='pt-4'>{capitaliseWords(currentQuestion)}</h2>
                                </>
                            )}
                        </div>
                        <div className='bottom-section'>
                            <div id="conjugation-form">
                                <label htmlFor="user-input">Your Answer:</label>
                                <ReactTransliterate
                                    type="text"
                                    id="user-input"
                                    name="user-input"
                                    onKeyDown={handleEnterKeyPress}
                                    value={currentAnswer}
                                    onChangeText={(e) => {
                                        setCurrentAnswer(e);
                                    }}
                                    lang="ar"
                                />
                                {showNextButton && (
                                    <Button className="con-form-button" variant="secondary" type="button" onClick={nextQuestion}>Next</Button>
                                )}
                                {!showNextButton && (
                                    <Button className="con-form-button" variant="primary" type="button" onClick={checkAnswer}>Check</Button>
                                )}
                            </div>
                            <p id="result-message">{resultMessage}</p>
                            {showHintButton && (
                                <>
                                    <Button className="show-answer-button" type="button" variant="secondary" onClick={showAnswerClicked}>Show answer</Button>                                {revealAnswer && (
                                        <p id='correct-answer'>The answer is: {hint}</p>
                                    )}
                                </>
                            )}
                        </div>
                    </ListGroup>
                </Card >
            </div>
        );
    }

    return (
        <>
            {(showResultsPage) ? (<QuizResultsPage />) : (questionPage())}
        </>
    );
};

export default WordsPracticeQuestionPage;
