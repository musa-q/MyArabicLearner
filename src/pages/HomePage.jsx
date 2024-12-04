import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Book, Brain, MessageSquare, Users } from 'lucide-react';
import './HomePage.css';
import '../fonts.css';
import TypingAnimation from '../components/TypingAnimation';

const HomePage = ({ onNavigate, username }) => {
    const features = [
        {
            icon: <Book className="text-purple-400" size={32} />,
            title: "Learn Vocabulary",
            description: "Master essential Arabic words through interactive flashcards"
        },
        {
            icon: <Brain className="text-purple-400" size={32} />,
            title: "Practice Grammar",
            description: "Build strong foundations with comprehensive grammar lessons"
        },
        {
            icon: <MessageSquare className="text-purple-400" size={32} />,
            title: "Interactive Quizzes",
            description: "Test your knowledge with engaging quizzes"
        },
        {
            icon: <Users className="text-purple-400" size={32} />,
            title: "Levantine Dialect",
            description: "Learn authentic Arabic as spoken in the Levant region"
        }
    ];

    const learningActivities = [
        {
            route: 'wordsflashcard',
            icon: 'bi-card-text',
            title: 'Flashcards',
            description: 'Practice vocabulary with interactive cards'
        },
        {
            route: 'quiz',
            icon: 'bi-pencil-square',
            title: 'Take a Quiz',
            description: 'Test your knowledge and track progress'
        },
        {
            route: 'cheatsheet',
            icon: 'bi-journal-text',
            title: 'Cheatsheets',
            description: 'Quick reference guides and notes'
        }
    ];

    return (
        <Container fluid className="px-4">
            <motion.div
                className="text-center pt-3 pb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.img
                    src="/logo_main.svg"
                    alt="My Arabic Learner Logo"
                    className="homepage-logo"
                    initial={{ scale: 0.7 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                />

                <TypingAnimation text="أهلاً وسهلاً" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-4"
                >
                    <h1 className="display-4 gold mb-3">Welcome to My Arabic Learner</h1>
                    <p className="lead text-gray-300 mb-4">
                        Your journey to mastering Levantine Arabic starts here. Join our community and discover
                        the joy of learning Arabic through interactive lessons and exercises.
                    </p>

                    {!username && (
                        <Button
                            variant="purple"
                            size="lg"
                            className="mt-1 me-5"
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                onNavigate('');
                            }}
                        >
                            Get Started
                        </Button>
                    )}

                    <Button
                        variant="purple"
                        size="lg"
                        className="mt-1"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            onNavigate('about');
                        }}
                    >
                        Learn More
                    </Button>
                </motion.div>
            </motion.div>

            <motion.div
                className="py-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="text-center gold display-6 mb-5">Why Choose My Arabic Learner?</h2>
                <Row className="g-4">
                    {features.map((feature, index) => (
                        <Col key={index} md={6} lg={3}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                                className="h-100"
                            >
                                <Card className="h-100 bg-dark text-white border-purple d-flex">
                                    <Card.Body className="text-center d-flex flex-column justify-content-between">
                                        <div>
                                            <div className="mb-3">
                                                {feature.icon}
                                            </div>
                                            <Card.Title className="gold h5 mb-3">{feature.title}</Card.Title>
                                            <Card.Text className="text-gray-300">{feature.description}</Card.Text>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </motion.div>

            {username ? (
                <motion.div
                    className="text-center py-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="gold display-6 mb-4">Ready to Continue Learning?</h2>
                    <Row className="justify-content-center g-4 mx-auto" style={{ maxWidth: '1200px' }}>
                        {learningActivities.map((activity, index) => (
                            <Col key={index} xs={12} md={4}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="purple"
                                        size="lg"
                                        className="w-100 py-4 learning-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                            onNavigate(activity.route);
                                        }}
                                    >
                                        <i className={`bi ${activity.icon} mb-2 fs-3`}></i>
                                        <div className="fs-4">{activity.title}</div>
                                        <small className="text-light-emphasis">{activity.description}</small>
                                    </Button>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>
                </motion.div>
            ) : (
                <motion.div
                    className="text-center py-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="gold display-6 mb-4">Start Your Arabic Journey Today</h2>
                    <p className="lead text-gray-300 mb-4">
                        Join our community of learners mastering Levantine Arabic with our interactive platform.
                    </p>
                    <Button
                        variant="purple"
                        size="lg"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            onNavigate('');
                        }}
                    >
                        Sign Up Now
                    </Button>
                </motion.div>
            )}
        </Container>
    );
};

export default HomePage;