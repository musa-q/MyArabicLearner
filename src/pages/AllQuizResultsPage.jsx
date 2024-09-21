import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Badge, Spinner, Modal } from 'react-bootstrap';
import { capitaliseWords } from '../utils';

const AllQuizResultsPage = () => {
    const [quizResults, setQuizResults] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedQuizDetails, setSelectedQuizDetails] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://127.0.0.1:5000/quiz/get-completed-quizzes',
                {
                    quiz_type: 'VocabQuiz',
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const data = response.data;
            setQuizResults(data.completed_quizzes);
            setDataLoaded(true);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            setDataLoaded(true);
        }
    }

    const fetchQuizDetails = async (quiz_id) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://127.0.0.1:5000/quiz/get-quiz-details',
                {
                    quiz_id: quiz_id
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Response:', response.data);
            setSelectedQuizDetails(response.data.quiz_data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching quiz details:', error);
        }
    }

    const getModal = () => {
        return (
            <Modal centered show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Quiz Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedQuizDetails ? (
                        <Table bordered hover responsive className="text-center">
                            <thead className="bg-light">
                                <tr>
                                    <th>Category</th>
                                    <th>Date Completed</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{capitaliseWords(selectedQuizDetails.category_name)}</td>
                                    <td>
                                        {new Date(selectedQuizDetails.date_taken).toLocaleString('default', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td>
                                        <Badge bg="success">
                                            {selectedQuizDetails.score} / {selectedQuizDetails.total_questions}
                                        </Badge>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    ) : (
                        <p>Loading details...</p>
                    )}

                    {selectedQuizDetails && (
                        <div>
                            <h5>Questions:</h5>
                            <Table bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>English</th>
                                        <th>Arabic</th>
                                        <th>Correct</th>
                                        <th>Your answer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedQuizDetails.questions.map((question, idx) => (
                                        <tr key={idx}>
                                            <td>{capitaliseWords(question.english)}</td>
                                            <td>{question.arabic}</td>
                                            <td>{question.is_correct ? 'Yes' : 'No'}</td>
                                            <td>{question.user_answer}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        );
    }

    if (!dataLoaded) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="quiz-results-page my-5">
            <h1 className="text-center text-white pb-4">All Quiz Results</h1>
            <Table bordered hover responsive className="text-center">
                <thead className="bg-light">
                    <tr>
                        <th>Category</th>
                        <th>Date Completed</th>
                        <th>Score</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {quizResults.map((quiz, index) => (
                        <tr key={index}>
                            <td>{capitaliseWords(quiz.category)}</td>
                            <td>
                                {new Date(quiz.date_completed).toLocaleString('default', { day: 'numeric', month: 'long' })}
                            </td>
                            <td>
                                <Badge bg="success">
                                    {quiz.score} / {quiz.total_questions}
                                </Badge>
                            </td>
                            <td>
                                <div style={{ cursor: 'pointer' }} onClick={() => fetchQuizDetails(quiz.quiz_id)}>
                                    View
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {getModal()}
        </Container>
    );
}

export default AllQuizResultsPage;