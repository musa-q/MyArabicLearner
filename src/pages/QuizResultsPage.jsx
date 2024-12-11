import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Badge, Spinner, Table, Button } from 'react-bootstrap';
import { motion } from "framer-motion";
import { Book, Clock, Award, ArrowLeft } from 'lucide-react';
import { authManager, capitaliseWords } from '../utils';
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
                <Spinner animation="border" className="text-purple-400" />
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
                <div className="d-flex justify-content-center align-items-center">
                    <h1 className="text-4xl font-bold text-purple-400 m-0 mt-4 display-5 gold">
                        {resultsQuizType === 'VocabQuiz'
                            ? `${capitaliseWords(resultsDetails.category)} Quiz Results`
                            : 'Verb Conjugation Quiz Results'}
                    </h1>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-900 p-4 rounded-lg text-center">
                            <Award className="text-purple-400 mb-2" size={24} />
                            <div className="text-purple-400 mb-2">Score</div>
                            <Badge bg="success" className="px-3 py-2">
                                {resultsDetails.score} / {resultsDetails.total}
                            </Badge>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg text-center">
                            <Book className="text-purple-400 mb-2" size={24} />
                            <div className="text-purple-400 mb-2">Category</div>
                            <div className="lead">
                                {resultsQuizType === 'VocabQuiz'
                                    ? capitaliseWords(resultsDetails.category)
                                    : 'Verb Conjugation'}
                            </div>
                        </div>
                        <div className="bg-gray-900 pt-4 pb-0 rounded-lg text-center">
                            <Clock className="text-purple-400 mb-2" size={24} />
                            <div className="text-purple-400 mb-2">Date Completed</div>
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
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="bg-gray-800 rounded-lg p-4">
                    <Table responsive bordered hover variant="dark" className="mb-0 text-center">
                        <thead className="bg-gray-900">
                            <tr>
                                <th className="text-purple-400">English</th>
                                <th className="text-purple-400">Arabic</th>
                                {resultsQuizType === 'VerbConjugationQuiz' && (
                                    <th className="text-purple-400">Conjugation</th>
                                )}
                                <th className="text-purple-400">Your Answer</th>
                                <th className="text-purple-400">Result</th>
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
                                    <td className="arabic-text">{question.user_answer}</td>
                                    <td>
                                        <Badge bg={question.is_correct ? 'success' : 'danger'}>
                                            {question.is_correct ? 'Correct' : 'Incorrect'}
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