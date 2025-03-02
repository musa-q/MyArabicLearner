import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Badge, Spinner, Table, Button } from 'react-bootstrap';
import { motion } from "framer-motion";
import { Book, Clock, Award, ArrowLeft } from 'lucide-react';
import { authManager, capitaliseWords, extractSubcategory } from '../utils';
import { API_URL } from '../config';
import './QuizResultsPage.css';

const QuizResultsPage = ({ quiz_type }) => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [resultsDetails, setResultsDetails] = useState({});
    const [resultsQuizType, setResultsQuizType] = useState(quiz_type);

    useEffect(() => {
        if (!dataLoaded) {
            getUserResults();
        }
    }, [dataLoaded]);

    const getUserResults = async () => {
        try {
            const deviceId = authManager.getDeviceId();
            const token = localStorage.getItem(`authToken_${deviceId}`);
            const response = await axios.post(`${API_URL}/quiz/get-results`,
                { quiz_type: resultsQuizType },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );
            setResultsDetails(response.data.results);
            setDataLoaded(true);
        } catch (error) {
            console.error('Error fetching results:', error);
            setDataLoaded(true);
        }
    };

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
                className="mb-4"
            >
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h1 className="text-4xl font-bold m-0 display-5 gold text-center pt-3">
                        {resultsQuizType === 'VocabQuiz'
                            ? `${capitaliseWords(extractSubcategory(resultsDetails.category))} Quiz Results`
                            : 'Verb Conjugation Quiz Results'}
                    </h1>
                </div>

                <div className="rounded-lg p-4 mb-4">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="p-4 rounded-lg text-center h-100">
                                <Book className="mb-2" size={24} />
                                <div className="mb-2">Category</div>
                                <div className="lead">
                                    {resultsQuizType === 'VocabQuiz'
                                        ? capitaliseWords(resultsDetails.category)
                                        : 'Verb Conjugation'}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-4 rounded-lg text-center h-100">
                                <Clock className="mb-2" size={24} />
                                <div className="mb-2">Date Completed</div>
                                <div className="lead">
                                    {new Date(resultsDetails.date).toLocaleString('default', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stats-container">
                        <div className="row mb-1">
                            <div className="col-md-4">
                                <div className="p-4 rounded-lg text-center h-100">
                                    <div className="mb-2">Total Points</div>
                                    <Badge className="px-3 py-2">
                                        {resultsDetails.total_points}
                                    </Badge>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="p-4 rounded-lg text-center h-100">
                                    <Award className="mb-2" size={24} />
                                    <div className="mb-2">Score</div>
                                    <Badge bg="success" className="px-3 py-2">
                                        {resultsDetails.score} / {resultsDetails.total}
                                    </Badge>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="p-4 rounded-lg text-center h-100">
                                    <div className="mb-2">High score</div>
                                    <Badge className="px-3 py-2">
                                        {resultsDetails.highest_points}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="rounded-lg pb-4 px-1">
                    <Table responsive bordered hover variant="dark" className="mb-0 text-center">
                        <thead>
                            <tr>
                                <th>English</th>
                                <th>Arabic</th>
                                {resultsQuizType === 'VerbConjugationQuiz' && (
                                    <th>Conjugation</th>
                                )}
                                <th>Correct Answer</th>
                                <th>Your Answer</th>
                                <th>Result</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultsDetails.questions.map((question, index) => (
                                <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <td>
                                        {resultsQuizType === 'VocabQuiz'
                                            ? capitaliseWords(question.question)
                                            : capitaliseWords(question.english_verb)}
                                    </td>
                                    <td className="arabic-text">
                                        {resultsQuizType === 'VocabQuiz'
                                            ? question.correct_answer
                                            : question.arabic_verb}
                                    </td>
                                    {resultsQuizType === 'VerbConjugationQuiz' && (
                                        <td>
                                            {`${capitaliseWords(question.pronoun)}, ${capitaliseWords(question.tense)}`}
                                        </td>
                                    )}
                                    <td className="arabic-text">{question.correct_answer}</td>
                                    <td className="arabic-text">{question.user_answer}</td>
                                    <td>
                                        <div className={question.is_correct ? 'text-success' : 'text-danger'} style={{ fontSize: '1.5em' }}>
                                            {question.is_correct ? '✓' : '✗'}
                                        </div>
                                    </td>
                                    <td>
                                        <Badge bg={question.points > 0 ? 'success' : 'danger'}>
                                            {question.points}
                                        </Badge>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </motion.div>
        </Container>
    );
};

export default QuizResultsPage;