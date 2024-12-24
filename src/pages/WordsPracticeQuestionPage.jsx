import { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion";
import { Book, CircleDot, ArrowRight, HelpCircle } from 'lucide-react';
import { Container, Card, Button, ListGroup } from 'react-bootstrap';
import { ReactTransliterate } from "react-transliterate";
import { capitaliseWords, authManager } from '../utils';
import QuizResultsPage from './QuizResultsPage';
import axios from 'axios';
import './WordsPracticeQuestionPage.css';
import { API_URL } from '../config';

const WordsPracticeQuestionPage = ({ quizId, pageTitle }) => {
    const [currentQuestionId, setCurrentQuestionId] = useState(null);
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [showHintButton, setShowHintButton] = useState(true);
    const [showNextButton, setShowNextButton] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [resultMessage, setResultMessage] = useState("");
    const [hint, setHint] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showResultsPage, setShowResultsPage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const processText = (word) => {
        return word.trim().toLowerCase();
    };

    const handleClick = () => {
        window.scrollTo(0, 0);
        setCheatsheetType(cheatsheetType.id);
    };

    const checkAnswer = async () => {
        if (isSubmitting) return;

        if (!currentAnswer?.trim()) {
            setResultMessage("Please provide an answer!");
            return;
        }

        const guess = processText(currentAnswer);
        setIsSubmitting(true);

        try {
            const deviceId = authManager.getDeviceId();
            const token = localStorage.getItem(`authToken_${deviceId}`);

            const response = await axios.post(
                `${API_URL}/quiz/send-answer`,
                {
                    quiz_type: 'VocabQuiz',
                    user_answer: guess,
                    question_id: currentQuestionId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );

            const data = response.data;
            if (data.answer_response) {
                setResultMessage("Correct! 🎉");
                setShowNextButton(true);
                setShowHintButton(false);
            } else {
                setResultMessage("Incorrect!");
                setShowNextButton(true);
            }
        } catch (error) {
            console.error('Error sending answer:', error);
            if (error.response?.status === 400 && error.response?.data?.error === 'Question already answered or not found') {
                nextQuestion();
            }
        }
    };

    const nextQuestion = async () => {
        setLoading(true);

        try {
            const deviceId = authManager.getDeviceId();
            const token = localStorage.getItem(`authToken_${deviceId}`);

            const response = await axios.post(
                `${API_URL}/quiz/get-next-question`,
                {
                    quiz_type: 'VocabQuiz',
                    quiz_id: quizId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );

            const data = response.data;
            if (data.all_answered) {
                setShowResultsPage(true);
                return;
            }

            setCurrentQuestionId(data.question.question_id);
            setHint(data.hint);
            setCurrentQuestion(data.question.english);
            setCurrentAnswer("");
            setResultMessage("");
            setShowHintButton(true);
            setRevealAnswer(false);
            setShowNextButton(false);
            setIsSubmitting(false);

            handleClick();
        } catch (error) {
            console.error("Error fetching question:", error);
            setResultMessage("Error loading question. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEnterKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (resultMessage.includes("Correct") || resultMessage.includes("Incorrect")) {
                nextQuestion();
            } else {
                checkAnswer();
            }
        } else if (e.ctrlKey) {
            e.preventDefault();
            setRevealAnswer(!revealAnswer);
        }
    };

    useEffect(() => {
        nextQuestion();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-gray-400">
                    <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-lg">Loading question...</p>
                </div>
            </div>
        );
    }

    if (showResultsPage) {
        return <QuizResultsPage quiz_type="VocabQuiz" />;
    }

    return (
        <Container className="py-4 mt-4 max-w-4xl mx-auto" style={{ minHeight: "100vh" }}>
            <motion.div {...fadeIn}>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold gold text-purple-400 mb-3 display-4">
                        {capitaliseWords(pageTitle)}
                    </h1>
                    <p className="text-gray-300 lead">
                        Translate the following word into Arabic
                    </p>
                </div>

                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className=" text-white border-purple-400">
                        <Card.Header className="d-flex align-items-center bg-gray-800">
                            <Book className="text-purple-400 me-2" size={20} />
                            <h2 className="h5 mb-0 lead">Current Question</h2>
                        </Card.Header>
                        <Card.Body className="d-flex flex-column align-items-center py-5">
                            <h2 className="text-2xl mb-4 font-semibold text-center">
                                {capitaliseWords(currentQuestion)}
                            </h2>

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
                                            onClick={nextQuestion}
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

                                    {showHintButton && (
                                        <Button
                                            variant="outline-light"
                                            onClick={() => setRevealAnswer(!revealAnswer)}
                                            className="flex-1"
                                        >
                                            <HelpCircle className="me-2 inline" size={16} />
                                            {revealAnswer ? 'Hide Answer' : 'Show Answer'}
                                        </Button>
                                    )}
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
                                                {hint}
                                            </span>
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-gray-400"
                >
                </motion.div>
            </motion.div>
        </Container>
    );
};

export default WordsPracticeQuestionPage;