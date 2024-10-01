import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react';
import './WordsVerbsPracticePage.css';
import Col from 'react-bootstrap/Col';
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import axios from 'axios';
import QuizResultsPage from './QuizResultsPage';
import { API_URL } from '../config';

const tenses = ["present", "past", "future"];
const pronouns = ["i", "you_m", "you_f", "he", "she", "they", "we"];

const VerbsPage = () => {
    const [quizId, setQuizId] = useState(null);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [verbData, setVerbData] = useState([]);
    const [showNextButton, setShowNextButton] = useState(false);
    const [currentConjugation, setCurrentConjugation] = useState(null);
    const [resultMessage, setResultMessage] = useState("");
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showAnswerButton, setShowAnswerButton] = useState(false);
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [showResultsPage, setShowResultsPage] = useState(false);
    const [loading, setLoading] = useState(true);

    const processText = (word) => {
        return word.trim().toLowerCase();
    }

    useEffect(() => {
        if (!quizId) {
            createQuiz();
        }
    });

    const createQuiz = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.post(`${API_URL}/quiz/create-verb-conjugation-quiz`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setQuizId(response.data.quiz_id);
            getNextQuestion(response.data.quiz_id);
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };

    const getNextQuestion = async () => {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.post(`${API_URL}/quiz/get-next-question`,
                {
                    quiz_type: 'VerbConjugationQuiz'
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('DADATA', response.data);

            if (response.data.all_answered === true) {
                setShowResultsPage(true);
                return;
            }
            const { question, hint } = response.data;
            const { english_verb, arabic_verb, tense, pronoun } = question;

            // Set the current conjugation
            setCurrentConjugation({
                word: {
                    english: english_verb,
                    arabic: arabic_verb
                },
                tense,
                pronoun
            });
            setCorrectAnswer(hint);
        } catch (error) {
            console.error('Error fetching next question:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkAnswer = async () => {
        const token = localStorage.getItem('authToken');
        var guess = processText(currentAnswer);

        try {
            const response = await axios.post(`${API_URL}/quiz/send-answer`,
                {
                    quiz_type: 'VerbConjugationQuiz',
                    user_answer: guess,
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );
            const data = response.data;
            setResultMessage(response.data.answer_response ? "Correct!" : "Incorrect!");
            setShowNextButton(true);
            setShowAnswerButton(!response.data.answer_response);
        } catch (error) {
            console.error('Error checking answer:', error);
        }
    };

    const nextQuestion = () => {
        getNextQuestion();
        setCurrentAnswer("");
        setResultMessage("");
        setShowAnswerButton(false);
        setRevealAnswer(false);
        setShowNextButton(false);
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

    if (loading) {
        return <p>Loading...</p>;
    }

    const questionPage = () => {
        return (
            <div className="practice-page-container">
                <h1>Verb Conjugation Practice</h1>

                <Card className="practice-container">
                    <ListGroup variant="flush">
                        <div className="info-text">
                            {currentConjugation && (
                                <>
                                    <Card.Header>{currentConjugation.word.english}: <strong>{currentConjugation.word.arabic}</strong></Card.Header>

                                    <ListGroup.Item>
                                        <Row className='con-info'>
                                            <Col><Card.Title>Pronoun: {currentConjugation.pronoun}</Card.Title></Col>
                                            <Col><Card.Title>Tense: {currentConjugation.tense}</Card.Title></Col>
                                        </Row>
                                    </ListGroup.Item>                            </>
                            )}
                        </div>
                        <div className='bottom-section'>
                            <form id="conjugation-form" method="POST">
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
                            </form>
                            <p id="result-message">{resultMessage}</p>
                            {showAnswerButton && (
                                <>
                                    <Button className="show-answer-button" type="button" variant="secondary" onClick={showAnswerClicked}>Show answer</Button>                                {revealAnswer && (
                                        <p id='correct-answer'>The answer is: {correctAnswer}</p>
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
            {(showResultsPage) ? (<QuizResultsPage quiz_type="VerbConjugationQuiz" />) : (questionPage())}
        </>
    );
};

export default VerbsPage;
