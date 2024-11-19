import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Book, CircleDot, ArrowRight, HelpCircle } from 'lucide-react';
import { Container, Card, Button, ListGroup } from 'react-bootstrap';
import { ReactTransliterate } from "react-transliterate";
import { capitaliseWords } from '../utils';
import QuizResultsPage from './QuizResultsPage';
import axios from 'axios';
import './WordsPracticeQuestionPage.css';
import { API_URL } from '../config';

const WordsPracticeQuestionPage = ({ quizId, pageTitle }) => {
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [showHintButton, setShowHintButton] = useState(true);
    const [showNextButton, setShowNextButton] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [resultMessage, setResultMessage] = useState("");
    const [hint, setHint] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showResultsPage, setShowResultsPage] = useState(false);
    const [loading, setLoading] = useState(true);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const processText = (word) => {
        return word.trim().toLowerCase();
    };

    const checkAnswer = async () => {
        if (!currentAnswer?.trim()) {
            setResultMessage("Please provide an answer!");
            return;
        }

        const guess = processText(currentAnswer);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${API_URL}/quiz/send-answer`,
                {
                    quiz_type: 'VocabQuiz',
                    user_answer: guess,
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            const data = response.data;
            if (data.answer_response) {
                setResultMessage("Correct! 🎉");
                setShowNextButton(true);
                setShowHintButton(false);
            } else {
                setResultMessage("Incorrect - Try again!");
                setShowNextButton(true);
            }
        } catch (error) {
            console.error('Error sending answer:', error);
            setResultMessage("Error checking answer. Please try again.");
        }
    };

    const nextQuestion = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                `${API_URL}/quiz/get-next-question`,
                {
                    quiz_type: 'VocabQuiz',
                    quiz_id: quizId
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            const data = response.data;
            if (data.all_answered) {
                setShowResultsPage(true);
                return;
            }

            setHint(data.hint);
            setCurrentQuestion(data.question.english);
            setCurrentAnswer("");
            setResultMessage("");
            setShowHintButton(true);
            setRevealAnswer(false);
            setShowNextButton(false);
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
        <Container className="py-4 mt-4 max-w-4xl mx-auto">
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
                    <Card className="bg-dark text-white border-purple-400">
                        <Card.Header className="d-flex align-items-center bg-gray-800">
                            <Book className="text-purple-400 me-2" size={20} />
                            <h2 className="h5 mb-0 lead">Current Question</h2>
                        </Card.Header>
                        <Card.Body className="text-center py-6">
                            <h2 className="text-2xl mb-4 font-semibold">
                                {capitaliseWords(currentQuestion)}
                            </h2>

                            <div className="max-w-lg mx-auto">
                                <div className="mb-4">
                                    <ReactTransliterate
                                        value={currentAnswer}
                                        onChangeText={(text) => setCurrentAnswer(text)}
                                        lang="ar"
                                        onKeyDown={handleEnterKeyPress}
                                        className="input-field w-full p-3 px-4 rounded-2xl bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                                        placeholder="Type your answer here..."
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex space-x-3">
                                        {showNextButton ? (
                                            <Button
                                                onClick={nextQuestion}
                                                className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 transition-colors"
                                            >
                                                Next Question <ArrowRight className="ms-2 inline" size={16} />
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={checkAnswer}
                                                className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 transition-colors"
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
                                </div>

                                {resultMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`mt-4 p-3 rounded-lg ${resultMessage.includes("Correct")
                                            ? "bg-green-500/20 text-green-300"
                                            : "bg-red-500/20 text-red-300"
                                            }`}
                                    >
                                        {resultMessage}
                                    </motion.div>
                                )}

                                {revealAnswer && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-4 p-3 bg-gray-700/50 rounded-lg"
                                    >
                                        <p className="text-gray-300 mb-0">
                                            <span className="font-semibold">Answer:</span> {hint}
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
                    <p className="text-sm mt-2">
                        Press <kbd className="px-2 py-1 bg-gray-700 rounded">Enter</kbd> to check/next
                        {" | "}
                        <kbd className="px-2 py-1 bg-gray-700 rounded">Ctrl</kbd> to reveal answer
                    </p>
                </motion.div>
            </motion.div>
        </Container>
    );
};

export default WordsPracticeQuestionPage;