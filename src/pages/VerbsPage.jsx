import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Book, CircleDot, ArrowRight, HelpCircle } from 'lucide-react';
import { ReactTransliterate } from 'react-transliterate';
import axios from 'axios';
import QuizResultsPage from './QuizResultsPage';
import { API_URL } from '../config';
import { capitaliseWords } from '../utils';

const VerbsPage = () => {
    const [quizId, setQuizId] = useState(null);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [currentConjugation, setCurrentConjugation] = useState(null);
    const [resultMessage, setResultMessage] = useState('');
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [showNextButton, setShowNextButton] = useState(false);
    const [showResultsPage, setShowResultsPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!quizId) createQuiz();

        const focusInput = () => {
            if (containerRef.current) {
                const input = containerRef.current.querySelector('ReactTransliterate');
                if (input) {
                    input.focus();
                }
            }
        };

        focusInput();

        const handleGlobalKeyPress = (e) => {
            if (e.target.tagName === 'INPUT') {
                return;
            }

            if (e.key.length === 1 || e.key === 'Backspace') {
                e.preventDefault();
                focusInput();
                if (e.key === 'Backspace') {
                    setCurrentAnswer(prev => prev.slice(0, -1));
                } else {
                    setCurrentAnswer(prev => prev + e.key);
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKeyPress);

        return () => {
            window.removeEventListener('keydown', handleGlobalKeyPress);
        };
    }, [quizId]);

    const createQuiz = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.post(
                `${API_URL}/quiz/create-verb-conjugation-quiz`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
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
            const response = await axios.post(
                `${API_URL}/quiz/get-next-question`,
                { quiz_type: 'VerbConjugationQuiz' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.all_answered) {
                setShowResultsPage(true);
                return;
            }

            const { question, hint } = response.data;
            const { english_verb, arabic_verb, tense, pronoun } = question;

            setCurrentConjugation({
                word: { english: english_verb, arabic: arabic_verb },
                tense,
                pronoun,
            });
            setCorrectAnswer(hint);
            setResultMessage('');
            setCurrentAnswer('');
            setRevealAnswer(false);
            setShowNextButton(false);
        } catch (error) {
            console.error('Error fetching next question:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkAnswer = async () => {
        const token = localStorage.getItem('authToken');
        const guess = currentAnswer.trim().toLowerCase();
        if (!guess) return;

        try {
            const response = await axios.post(
                `${API_URL}/quiz/send-answer`,
                { quiz_type: 'VerbConjugationQuiz', user_answer: guess },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setResultMessage(response.data.answer_response ? 'Correct! 🎉' : 'Incorrect!');
            setShowNextButton(true);
        } catch (error) {
            console.error('Error checking answer:', error);
        }
    };

    if (showResultsPage) {
        return <QuizResultsPage quiz_type="VerbConjugationQuiz" />;
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    const handleEnterKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (resultMessage.includes("Correct") || resultMessage.includes("Incorrect")) {
                getNextQuestion();
            } else {
                checkAnswer();
            }
        } else if (e.altKey && e.key === 'h') {
            e.preventDefault();
            setRevealAnswer(!revealAnswer);
        }
    };

    return (
        <Container className="py-4 mt-4 max-w-4xl mx-auto" style={{ minHeight: "100vh" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold gold text-purple-400 mb-3 display-4">
                        Verb Conjugation Practice
                    </h1>
                    <p className="text-gray-300 lead">
                        Conjugate the verb correctly based on the pronoun and tense.
                    </p>
                </div>

                <Card className="bg-dark text-white border-purple-400">
                    <Card.Header className="d-flex align-items-center bg-gray-800">
                        <Book className="text-purple-400 me-2" size={20} />
                        <h2 className="h5 mb-0 lead">Current Question</h2>
                    </Card.Header>
                    <Card.Body className="d-flex flex-column align-items-center py-5">
                        <h2 className="text-2xl mb-3 font-semibold text-center">
                            {capitaliseWords(currentConjugation?.word.english)} ({currentConjugation?.word.arabic})
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">
                            Pronoun: <b>{currentConjugation?.pronoun}</b> | Tense: <b>{currentConjugation?.tense}</b>
                        </p>

                        <div className="w-100" style={{ maxWidth: "500px" }}>
                            <ReactTransliterate
                                value={currentAnswer}
                                onChangeText={(text) => setCurrentAnswer(text)}
                                lang="ar"
                                onKeyDown={handleEnterKeyPress}
                                className="input-field w-100 p-3 px-4 rounded-2xl bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                                placeholder="Type your answer here..."
                            />

                            <div className="d-flex justify-content-center gap-3 mt-4">
                                {showNextButton ? (
                                    <Button
                                        onClick={getNextQuestion}
                                        className="flex-1"
                                        variant="purple"
                                    >
                                        Next Question <ArrowRight className="ms-2 inline" size={16} />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={checkAnswer}
                                        className="flex-1"
                                        variant="purple"
                                    >
                                        Check Answer <CircleDot className="ms-2 inline" size={16} />
                                    </Button>
                                )}

                                <Button
                                    variant="outline-light"
                                    onClick={() => setRevealAnswer(!revealAnswer)}
                                    className="flex-1"
                                >
                                    <HelpCircle className="me-2 inline" size={16} />
                                    {revealAnswer ? 'Hide Answer' : 'Show Answer'}
                                </Button>
                            </div>

                            {resultMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-3 rounded-lg text-center"
                                    style={{
                                        backgroundColor: resultMessage.includes("Correct") ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                        color: resultMessage.includes("Correct") ? "#86efac" : "#fca5a5"
                                    }}
                                >
                                    <div className="lead">
                                        {resultMessage}
                                    </div>
                                </motion.div>
                            )}

                            {revealAnswer && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4 p-3 rounded-lg text-center"
                                >
                                    <p className="mb-0">
                                        <span className="lead">Answer: </span>
                                        <span className="lead-ar">
                                            {correctAnswer}
                                        </span>
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </motion.div>
        </Container>
    );
};

export default VerbsPage;
