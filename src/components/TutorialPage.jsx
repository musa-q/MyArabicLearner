import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Button, Spinner } from 'react-bootstrap';
import { Book, Brain, MessageSquare, Bookmark, Clock, Medal, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const TutorialPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedTutorial, setSelectedTutorial] = useState(null);
    const [gifLoaded, setGifLoaded] = useState(false);

    const tutorials = [
        {
            id: 1,
            icon: <Book size={24} />,
            title: "Using Flashcards",
            description: "Learn how to use flashcards to memorize vocabulary",
            modalContent: {
                title: "How to Use Flashcards",
                description: ["Our flashcard system helps you learn Arabic vocabulary effectively:", "1. Select a category from the available options", "2. Click through cards to see Arabic and English translations", "3. You can switch on or off the arabic transliteration"],
                gifUrl: "/gifs/tutorial/flashcards.gif"
            }
        },
        {
            id: 2,
            icon: <Brain size={24} />,
            title: "Taking Quizzes",
            description: "Test your knowledge with interactive quizzes",
            modalContent: {
                title: "How to Take Quizzes",
                description: ["Challenge yourself with our quiz system:", "1. Choose between Vocabulary or Verb Conjugation quizzes", "2. Select your preferred category", "3. Answer questions and submit your responses", "4. Review your results and learn from mistakes"],
                gifUrl: "/gifs/tutorial/quiz.gif"
            }
        },
        {
            id: 3,
            icon: <MessageSquare size={24} />,
            title: "Using Cheatsheets",
            description: "Access quick reference guides for grammar and vocabulary",
            modalContent: {
                title: "How to Use Cheatsheets",
                description: ["Get quick access to important information:", "1. Browse available cheatsheet categories", "2. Click to view detailed information", "3. Use as quick reference during practice"],
                gifUrl: "/gifs/tutorial/cheatsheets.gif"
            }
        },
        {
            id: 4,
            icon: <Medal size={24} />,
            title: "Tracking Progress",
            description: "Monitor your learning journey and achievements",
            modalContent: {
                title: "How to Track Progress",
                description: ["Keep track of your learning journey:", "1. View quiz results in the Results page", "2. Check detailed performance for each quiz", "3. Monitor improvement over time", "4. Review specific areas needing attention"],
                gifUrl: "/gifs/tutorial/results.gif"
            }
        }
    ];

    const handleTutorialClick = (tutorial) => {
        setGifLoaded(false);
        setSelectedTutorial(tutorial);
        setShowModal(true);
    };

    return (
        <Container className="py-5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-5"
            >
                <h1 className="display-4 mb-4 gold">How to Use My Arabic Learner</h1>
                <p className="lead text-gray-300">
                    Learn how to make the most of our features with these detailed tutorials.
                    Click on any card to see a demonstration.
                </p>
            </motion.div>

            <Row className="g-4">
                {tutorials.map((tutorial, index) => (
                    <Col key={tutorial.id} md={6} lg={3}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Card
                                className="h-100 bg-gray-800 border-purple cursor-pointer"
                                onClick={() => handleTutorialClick(tutorial)}
                            >
                                <Card.Body className="text-center">
                                    <div className="text-purple-400 mb-3">
                                        {tutorial.icon}
                                    </div>
                                    <Card.Title className="text-white mb-3">{tutorial.title}</Card.Title>
                                    <Card.Text className="text-gray-300">{tutorial.description}</Card.Text>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
                className="tutorial-modal"
            >
                {selectedTutorial && (
                    <>
                        <Modal.Header closeButton className="bg-gray-800 text-white border-gray-700">
                            <Modal.Title className="text-purple-400">
                                {selectedTutorial.icon}
                                <span className="ms-2">{selectedTutorial.modalContent.title}</span>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="bg-gray-800 text-white">
                            <div className="position-relative" style={{ maxHeight: '60vh', overflow: 'hidden' }}>
                                {!gifLoaded && (
                                    <div className="text-center py-4">
                                        <Spinner animation="border" variant="purple" />
                                    </div>
                                )}
                                <div className="d-flex justify-content-center">
                                    <img
                                        src={selectedTutorial.modalContent.gifUrl}
                                        alt={`Tutorial for ${selectedTutorial.title}`}
                                        className={`w-full rounded-lg mb-0 ${gifLoaded ? '' : 'd-none'}`}
                                        style={{
                                            maxWidth: '80%',
                                            height: 'auto',
                                            objectFit: 'contain'
                                        }}
                                        onLoad={() => setGifLoaded(true)}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                {selectedTutorial.modalContent.description.map((line, index) => (
                                    <p key={index} className="mb-2">{line}</p>
                                ))}
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="bg-gray-800 border-gray-700">
                            <Button variant="purple" onClick={() => setShowModal(false)}>
                                Got it!
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Container>
    );
};

export default TutorialPage;