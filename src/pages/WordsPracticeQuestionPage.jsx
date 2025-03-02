import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from "framer-motion";
import { Book, CircleDot, ArrowRight, HelpCircle, AlertCircle } from 'lucide-react';
import { Container, Card, Button, ListGroup, ProgressBar } from 'react-bootstrap';
import { ReactTransliterate } from "react-transliterate";
import { capitaliseWords, authManager } from '../utils';
import QuizResultsPage from './QuizResultsPage';
import axios from 'axios';
import './WordsPracticeQuestionPage.css';
import { API_URL } from '../config';

const INITIAL_TIME = 15;
const ERROR_MESSAGES = {
    NO_ANSWER: "Please provide an answer!",
    NETWORK_ERROR: "Network error occurred. Please try again.",
    LOAD_ERROR: "Error loading question. Please try again.",
    UNAUTHORIZED: "Your session has expired. Please login again.",
};

const WordsPracticeQuestionPage = ({ quizId, pageTitle }) => {
    const [quizState, setQuizState] = useState({
        currentQuestionId: null,
        currentQuestion: null,
        currentAnswer: "",
        hint: null,
        points: 0,
        streak: 0,
        timeRemaining: INITIAL_TIME,
    });

    const [uiState, setUiState] = useState({
        loading: true,
        isSubmitting: false,
        showHintButton: true,
        showNextButton: false,
        showResultsPage: false,
        revealAnswer: false,
        resultMessage: "",
        error: null,
    });

    const timerRef = useRef(null);
    const containerRef = useRef(null);
    const abortControllerRef = useRef(null);

    const makeRequest = useCallback(async (url, data) => {
        try {
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();

            const deviceId = authManager.getDeviceId();
            const token = localStorage.getItem(`authToken_${deviceId}`);

            if (!token) {
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            }

            // console.log('Making request to:', url, 'with data:', data); // Debug log

            const response = await axios({
                url: `${API_URL}${url}`,
                method: 'POST',
                data,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Device-ID': deviceId,
                },
                signal: abortControllerRef.current.signal,
                timeout: 5000,
            });

            // console.log('Response received:', response.data); // Debug log
            return response.data;
        } catch (error) {
            // console.error('Request error:', error); // Debug log

            if (axios.isCancel(error)) {
                // console.log('Request cancelled');
                return null;
            }

            if (error.response?.status === 401) {
                setUiState(prev => ({ ...prev, error: ERROR_MESSAGES.UNAUTHORIZED }));
                return null;
            }

            throw error;
        }
    }, []);

    const startTimer = useCallback(() => {
        setQuizState(prev => ({ ...prev, timeRemaining: INITIAL_TIME }));

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        timerRef.current = setInterval(() => {
            setQuizState(prev => {
                if (prev.timeRemaining <= 0) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;

                    makeRequest('/quiz/send-answer', {
                        quiz_type: 'VocabQuiz',
                        user_answer: '',
                        question_id: prev.currentQuestionId,
                        time_remaining: 0,
                        streak: 0,
                        timeout: true
                    });

                    setUiState(prev => ({
                        ...prev,
                        resultMessage: "Time's up! ⏰",
                        showNextButton: true,
                        showHintButton: false
                    }));
                    return prev;
                }
                return { ...prev, timeRemaining: prev.timeRemaining - 1 };
            });
        }, 1000);
    });

    const checkAnswer = useCallback(async () => {
        if (uiState.isSubmitting || quizState.timeRemaining === 0) return;

        if (!quizState.currentAnswer?.trim()) {
            setUiState(prev => ({ ...prev, resultMessage: ERROR_MESSAGES.NO_ANSWER }));
            return;
        }

        try {
            setUiState(prev => ({ ...prev, isSubmitting: true }));
            if (timerRef.current) clearInterval(timerRef.current);

            const data = await makeRequest('/quiz/send-answer',
                {
                    quiz_type: 'VocabQuiz',
                    user_answer: quizState.currentAnswer.trim().toLowerCase(),
                    question_id: quizState.currentQuestionId,
                    time_remaining: quizState.timeRemaining,
                    streak: quizState.streak,
                }
            );

            if (!data) return;

            if (data.answer_response && data.points) {
                setQuizState(prev => ({
                    ...prev,
                    points: prev.points + data.points,
                    streak: prev.streak + 1,
                }));
                setUiState(prev => ({
                    ...prev,
                    resultMessage: `Correct! 🎉 +${data.points} points`,
                    showNextButton: true,
                    showHintButton: false,
                }));
            } else {
                setQuizState(prev => ({
                    ...prev,
                    streak: 0,
                    points: prev.points + data.points,
                }));
                setUiState(prev => ({
                    ...prev,
                    resultMessage: `Incorrect! ${data.points}`,
                    showNextButton: true,
                }));
            }
        } catch (error) {
            setUiState(prev => ({
                ...prev,
                error: ERROR_MESSAGES.NETWORK_ERROR,
            }));
        } finally {
            setUiState(prev => ({ ...prev, isSubmitting: false }));
        }
    }, [quizState, uiState.isSubmitting, makeRequest]);

    const nextQuestion = useCallback(async () => {
        try {
            setUiState(prev => ({ ...prev, loading: true, error: null }));

            const data = await makeRequest('/quiz/get-next-question',
                {
                    quiz_type: 'VocabQuiz',
                    quiz_id: quizId
                }
            );

            if (!data) {
                throw new Error('No data received from server');
            }

            if (data.all_answered) {
                setUiState(prev => ({
                    ...prev,
                    showResultsPage: true,
                    loading: false
                }));
                return;
            }

            if (!data.question) {
                throw new Error('Invalid question data received');
            }

            setQuizState(prev => ({
                ...prev,
                currentQuestionId: data.question.question_id,
                currentQuestion: data.question.english,
                hint: data.hint,
                currentAnswer: "",
                timeRemaining: INITIAL_TIME,
            }));

            setUiState(prev => ({
                ...prev,
                loading: false,
                resultMessage: "",
                showHintButton: true,
                revealAnswer: false,
                showNextButton: false,
                isSubmitting: false,
                error: null
            }));

            startTimer();

            window.scrollTo(0, 0);
        } catch (error) {
            // console.error('Error fetching next question:', error);
            setUiState(prev => ({
                ...prev,
                loading: false,
                error: ERROR_MESSAGES.LOAD_ERROR,
                showHintButton: false,
                showNextButton: false
            }));
        }
    }, [quizId, makeRequest, startTimer]);

    const handleEnterKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (uiState.showNextButton && !uiState.loading && quizState.timeRemaining > 0) {
                nextQuestion();
            } else if (!uiState.isSubmitting && quizState.timeRemaining > 0) {
                checkAnswer();
            }
        }
    };

    useEffect(() => {
        const initQuiz = async () => {
            try {
                await nextQuestion();
            } catch (error) {
                setUiState(prev => ({
                    ...prev,
                    loading: false,
                    error: ERROR_MESSAGES.LOAD_ERROR
                }));
            }
        };

        initQuiz();
    }, []);

    const renderErrorState = () => (
        <div className="text-center text-red-500 mb-4">
            <AlertCircle className="inline-block mr-2" size={20} />
            {uiState.error}
        </div>
    );

    const renderLoadingState = () => (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center text-gray-400">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-lg">Loading question...</p>
            </div>
        </div>
    );

    if (uiState.loading) return renderLoadingState();
    if (uiState.showResultsPage) return <QuizResultsPage quiz_type="VocabQuiz" />;

    return (
        // <Container className="py-4 mt-4 max-w-4xl mx-auto" style={{ minHeight: "100vh" }}>
        <Container className="py-4 mt-4 max-w-4xl mx-auto min-h-screen">
            <motion.div {...fadeIn}>
                {uiState.error && renderErrorState()}

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold gold text-purple-400 mb-3 display-4">
                        {capitaliseWords(pageTitle)}
                    </h1>
                    <p className="text-gray-300 lead">
                        Translate the following word into Arabic
                    </p>
                </div>

                <div className="flex justify-between items-center mb-3">
                    <div>Points: <strong>{quizState.points}</strong></div>
                    <div className="flex-grow mx-3">
                        <ProgressBar
                            now={(quizState.timeRemaining / INITIAL_TIME) * 100}
                            variant={getProgressBarVariant(quizState.timeRemaining)}
                            label={`${quizState.timeRemaining}s`}
                            className="h-5"
                            animated={quizState.timeRemaining <= 5}
                        />
                    </div>
                    <div>Streak: <strong>{quizState.streak}</strong></div>
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
                                {capitaliseWords(quizState.currentQuestion)}
                            </h2>

                            <div className="w-100" style={{ maxWidth: "500px" }}>
                                <ReactTransliterate
                                    value={quizState.currentAnswer}
                                    onChangeText={(text) => setQuizState(prev => ({ ...prev, currentAnswer: text }))}
                                    lang="ar"
                                    onKeyDown={handleEnterKeyPress}
                                    className="input-field w-100 p-3 px-4 rounded-2xl bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                                    placeholder="Type your answer here..."
                                />

                                <div className="d-flex justify-content-center gap-3 mt-4">
                                    {uiState.showNextButton ? (
                                        <Button
                                            onClick={nextQuestion}
                                            className="flex-1"
                                            variant="purple"
                                            disabled={uiState.isSubmitting || uiState.loading}
                                        >
                                            Next Question <ArrowRight className="ms-2 inline" size={16} />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={checkAnswer}
                                            className="flex-1"
                                            variant="purple"
                                            disabled={uiState.isSubmitting}
                                        >
                                            Check Answer <CircleDot className="ms-2 inline" size={16} />
                                        </Button>
                                    )}

                                    {uiState.showHintButton && (
                                        <Button
                                            variant="outline-light"
                                            onClick={() => setUiState(prev => ({ ...prev, revealAnswer: !prev.revealAnswer }))}
                                            className="flex-1"
                                        >
                                            <HelpCircle className="me-2 inline" size={16} />
                                            {uiState.revealAnswer ? 'Hide Answer' : 'Show Answer'}
                                        </Button>
                                    )}
                                </div>

                                {uiState.resultMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-3 rounded-lg text-center"
                                        style={{
                                            backgroundColor: uiState.resultMessage.includes("Correct") ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                            color: uiState.resultMessage.includes("Correct") ? "#86efac" : "#fca5a5"
                                        }}
                                    >
                                        <div className="lead">
                                            {uiState.resultMessage}
                                        </div>
                                    </motion.div>
                                )}

                                {uiState.revealAnswer && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-4 p-3 rounded-lg text-center"
                                    >
                                        <p className="mb-0">
                                            <span className="lead">Answer: </span>
                                            <span className="lead-ar">
                                                {quizState.hint}
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

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const getProgressBarVariant = (timeRemaining) => {
    if (timeRemaining > 20) return 'info';
    if (timeRemaining > 10) return 'primary';
    if (timeRemaining > 5) return 'warning';
    return 'danger';
};

export default WordsPracticeQuestionPage;