import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Badge, Spinner, Modal, Button, ButtonGroup, Table } from 'react-bootstrap';
import { motion } from "framer-motion";
import { Book, Clock, Eye, Award } from 'lucide-react';
import { capitaliseWords } from '../utils';
import { API_URL } from '../config';
import { authManager } from '../utils';

const AllQuizResultsPage = () => {
    const [quizResults, setQuizResults] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedQuizDetails, setSelectedQuizDetails] = useState(null);
    const [quizType, setQuizType] = useState('VocabQuiz');

    useEffect(() => {
        loadUserData();
    }, [quizType]);

    const loadUserData = async () => {
        try {
            const deviceId = authManager.getDeviceId();
            const token = localStorage.getItem(`authToken_${deviceId}`);
            const response = await axios.post(`${API_URL}/quiz/get-completed-quizzes`,
                { quiz_type: quizType },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );
            setQuizResults(response.data.completed_quizzes);
            setDataLoaded(true);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            setDataLoaded(true);
        }
    }

    const fetchQuizDetails = async (quiz_id) => {
        try {
            const deviceId = authManager.getDeviceId();
            const token = localStorage.getItem(`authToken_${deviceId}`);

            const response = await axios.post(`${API_URL}/quiz/get-quiz-details`,
                { quiz_id, quiz_type: quizType },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );
            setSelectedQuizDetails(response.data.quiz_data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching quiz details:', error);
        }
    }

    const getModal = () => {
        return (
            <Modal
                centered
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                className="text-white"
            >
                <Modal.Header closeButton className="bg-gray-800 text-white border-gray-700">
                    <Modal.Title className="display-6">
                        <Award className="me-2 inline-block" />
                        Quiz Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-gray-800 text-white">
                    {selectedQuizDetails ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="p-4 rounded-lg mb-1">
                                <div className="row row-cols-1 row-cols-md-4 g-3 text-center">
                                    <div className="col">
                                        <div className="mb-1">Score</div>
                                        <Badge bg="success" className="px-3 py-2">
                                            {selectedQuizDetails.score} / {selectedQuizDetails.total_questions}
                                        </Badge>
                                    </div>

                                    <div className="col">
                                        <div className="mb-0">Category</div>
                                        <div className="lead">
                                            {quizType === 'VocabQuiz' ?
                                                capitaliseWords(selectedQuizDetails.category_name) :
                                                'Verb Conjugation'}
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="mb-0">Date Completed</div>
                                        <div className="lead">
                                            {new Date(selectedQuizDetails.date_taken).toLocaleString('default', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>

                                    <div className="col">
                                        <div className="mb-1">Total Points</div>
                                        <Badge bg="success" className="px-3 py-2">
                                            {selectedQuizDetails.total_points}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive" style={{ maxWidth: '100%' }}>
                                <Table bordered hover variant="dark" className="mb-0 text-center">
                                    <thead>
                                        <tr>
                                            <th>English</th>
                                            {quizType === 'VerbConjugationQuiz' &&
                                                <>
                                                    <th>Arabic</th>
                                                    <th>Conjugation</th>
                                                </>}
                                            <th>Correct Answer</th>
                                            <th>Your Answer</th>
                                            <th>Points</th>
                                            <th>Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedQuizDetails.questions.map((question, idx) => (
                                            <motion.tr
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                            >
                                                <td>{capitaliseWords(quizType === 'VocabQuiz' ? question.english : question.english_verb)}</td>
                                                {quizType === 'VerbConjugationQuiz' &&
                                                    <>
                                                        <td>{question.arabic_verb}</td>
                                                        <td>{`${capitaliseWords(question.pronoun)}, ${capitaliseWords(question.tense)}`}</td>
                                                    </>
                                                }
                                                <td>{question.correct_answer}</td>
                                                <td>{question.user_answer === "" ? "TIMEOUT" : question.user_answer}</td>
                                                <td>{question.points}</td>
                                                <td>
                                                    <div className={question.is_correct ? 'text-success' : 'text-danger'} style={{ fontSize: '1.5em' }}>
                                                        {question.is_correct ? '✓' : '✗'}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="purple" />
                            <p className="mt-2">Loading details...</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal >
        );
    }

    if (!dataLoaded) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{ minHeight: "100vh" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-4"
            >
                <h1 className="text-4xl font-bold gold display-4 mb-5 mt-3">
                    Quiz Results
                </h1>
                <ButtonGroup className="mb-4">
                    <Button
                        variant={quizType === 'VocabQuiz' ? 'primary' : 'secondary'}
                        onClick={() => setQuizType('VocabQuiz')}
                        className="px-4 py-2"
                    >
                        <Book className="inline-block me-2" size={18} />
                        Vocabulary Quiz
                    </Button>
                    <Button
                        variant={quizType === 'VerbConjugationQuiz' ? 'primary' : 'secondary'}
                        onClick={() => setQuizType('VerbConjugationQuiz')}
                        className="px-4 py-2"
                    >
                        <Clock className="inline-block me-2" size={18} />
                        Verb Conjugation Quiz
                    </Button>
                </ButtonGroup>
            </motion.div>

            <div className='text-center lead'>
                Click on a quiz to view the details.
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {quizResults.length > 0 ? (
                    <div className="rounded-lg py-4 px-0">
                        <Table responsive bordered hover variant="dark" className="mb-0 text-center">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Date Completed</th>
                                    <th>Score</th>
                                    <th className="text-center">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quizResults.map((quiz, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => fetchQuizDetails(quiz.quiz_id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className="align-middle">
                                            {quizType === 'VocabQuiz' ? capitaliseWords(quiz.category) : 'Verb Conjugation'}
                                        </td>
                                        <td className="align-middle">
                                            {new Date(quiz.date_completed).toLocaleString('default', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="align-middle">
                                            <Badge
                                                bg={quiz.score === quiz.total_questions ? 'success' : 'danger'}
                                                className="px-3 py-2"
                                            >
                                                {quiz.score} / {quiz.total_questions}
                                            </Badge>
                                        </td>
                                        <td className="text-center align-middle">
                                            {quiz.total_points}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-gray-300 bg-gray-800 rounded-lg"
                    >
                        <Book className="mx-auto mb-4" size={48} />
                        <h3 className="display-6 mb-3">No Quizzes Completed Yet</h3>
                        <p className="lead">Complete some quizzes to see your results here!</p>
                    </motion.div>
                )}
            </motion.div>

            {getModal()}
        </Container>
    );
}

export default AllQuizResultsPage;