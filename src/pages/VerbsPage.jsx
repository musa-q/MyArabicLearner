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

        // Find the input element within the container
        const focusInput = () => {
            if (containerRef.current) {
                const input = containerRef.current.querySelector('input');
                if (input) {
                    input.focus();
                }
            }
        };

        // Initial focus
        focusInput();

        const handleGlobalKeyPress = (e) => {
            // Ignore if user is typing in another input field
            if (e.target.tagName === 'INPUT') {
                return;
            }

            // If the pressed key is a letter, number, or common punctuation
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

            setResultMessage(response.data.answer_response ? 'Correct! 🎉' : 'Incorrect - Try again!');
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
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-purple-400 mb-3 display-4 gold">
                        Verb Conjugation Practice
                    </h1>
                    <p className="text-gray-400 lead">Conjugate the verb correctly based on the pronoun and tense.</p>
                </div>

                <Card className="bg-dark text-white border-purple-400">
                    <Card.Header className="d-flex align-items-center bg-gray-800">
                        <Book className="text-purple-400 me-2" size={20} />
                        <h2 className="h5 mb-0">Current Question</h2>
                    </Card.Header>
                    <Card.Body className="text-center py-5">
                        <h2 className="text-2xl mb-3 font-semibold">
                            {capitaliseWords(currentConjugation?.word.english)} ({currentConjugation?.word.arabic})
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">
                            Pronoun: <b>{currentConjugation?.pronoun}</b> | Tense: <b>{currentConjugation?.tense}</b>
                        </p>

                        <div className="max-w-lg mx-auto mb-4" ref={containerRef}>
                            <ReactTransliterate
                                value={currentAnswer}
                                onChangeText={(text) => setCurrentAnswer(text)}
                                lang="ar"
                                onKeyDown={handleEnterKeyPress}
                                className="input-field w-full p-3 mb-2 px-4 rounded-2xl bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all"
                                placeholder="Type your answer here..."
                            />
                        </div>

                        <div className="flex justify-center space-x-4">
                            {showNextButton ? (
                                <Button
                                    onClick={getNextQuestion}
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white"
                                >
                                    Next Question <ArrowRight className="ms-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={checkAnswer}
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white"
                                >
                                    Check Answer <CircleDot className="ms-2" />
                                </Button>
                            )}

                            <Button
                                variant="outline-light"
                                onClick={() => setRevealAnswer(!revealAnswer)}
                            >
                                <HelpCircle className="me-2" />
                                {revealAnswer ? 'Hide Answer' : 'Show Answer'}
                            </Button>
                        </div>

                        {resultMessage && (
                            <div className={`mt-4 p-2 rounded-lg ${resultMessage.includes('Correct') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                {resultMessage}
                            </div>
                        )}

                        {revealAnswer && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-3 p-3 bg-gray-800 rounded-lg"
                            >
                                {correctAnswer}
                            </motion.div>
                        )}
                    </Card.Body>
                </Card>
            </motion.div>
        </Container>
    );
};

export default VerbsPage;
