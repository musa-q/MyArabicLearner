import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { capitaliseWords } from '../utils';
import { Container, Row, Col, Table, Card, Badge, Spinner } from 'react-bootstrap';
import TimeAgo from 'react-time-ago';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { formatInTimeZone } from 'date-fns-tz';
import { parse } from 'date-fns';
import './QuizResultsPage.css';

JavascriptTimeAgo.addDefaultLocale(en);

const QuizResultsPage = () => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [resultsDetails, setResultsDetails] = useState({});

    const getUserResults = async () => {
        const response = await axios.post('http://127.0.0.1:5000/quiz/users/1/get-results', {
            quiz_type: 'VocabQuiz',
        });

        const data = response.data;
        setResultsDetails(data.results);
        setDataLoaded(true);
    };

    useEffect(() => {
        if (!dataLoaded) {
            getUserResults();
        }
    }, [dataLoaded]);

    const parseDate = (dateString) => {
        return parse(dateString, 'EEE, dd MMM yyyy HH:mm:ss \'GMT\'', new Date());
    };

    const formatDate = (dateString) => {
        const date = parseDate(dateString);
        return formatInTimeZone(date, 'Europe/London', 'PPpp');
    };

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
            <Card className="shadow-sm">
                <Card.Header as="h1" className="text-center text-white">
                    {capitaliseWords(resultsDetails.category)}
                </Card.Header>
                <Card.Body>
                    <Row className="mb-4">
                        <Col>
                            <p className="text-muted">
                                Completed: {' '}
                                <span title={formatDate(resultsDetails.date)}>
                                    <TimeAgo date={parseDate(resultsDetails.date)} />
                                </span>
                            </p>
                        </Col>
                        <Col className="text-end">
                            <h4>
                                Score: <Badge bg="success">{resultsDetails.score} / {resultsDetails.total}</Badge>
                            </h4>
                        </Col>
                    </Row>

                    <Table striped bordered hover responsive className="text-center">
                        <thead className="bg-light">
                            <tr>
                                <th>English</th>
                                <th>Arabic</th>
                                <th>Mark</th>
                                <th>Your Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultsDetails.questions.map((question, index) => (
                                <tr key={index}>
                                    <td>{capitaliseWords(question.question)}</td>
                                    <td className="arabic-text">{question.correct_answer}</td>
                                    <td>
                                        <Badge bg={question.is_correct ? "success" : "danger"}>
                                            {question.is_correct ? 'Correct' : 'Incorrect'}
                                        </Badge>
                                    </td>
                                    <td className="arabic-text">{question.user_answer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default QuizResultsPage;