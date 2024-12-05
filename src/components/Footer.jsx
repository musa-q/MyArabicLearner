import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Github, Twitter, Mail, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = ({ onNavigate, isLoggedIn }) => {
    const currentYear = new Date().getFullYear();

    const handleNavigate = (path) => {
        onNavigate(path);
    };

    return (
        <footer className="bg-dark text-light py-5">
            <Container>
                <Row className="mb-4">
                    <Col md={4} className="mb-4 mb-md-0">
                        <h4 className="text-purple mb-3">About My Arabic Learner</h4>
                        <p className="text-secondary">
                            Your trusted platform for learning Levantine Arabic through interactive lessons,
                            flashcards, and quizzes. Join our community of learners today!
                        </p>
                    </Col>

                    <Col md={4} className="mb-4 mb-md-0">
                        <h4 className="text-purple mb-3">Quick Links</h4>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="text-secondary text-decoration-none hover-purple"
                                >
                                    Back to Top
                                </a>
                            </li>
                            <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-secondary text-decoration-none hover-purple"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        handleNavigate('tutorial');
                                    }}
                                >
                                    Tutorial
                                </a>
                            </li>
                            <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-secondary text-decoration-none hover-purple"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        handleNavigate('home');
                                    }}
                                >
                                    Home
                                </a>
                            </li>
                            <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-secondary text-decoration-none hover-purple"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        handleNavigate('about');
                                    }}
                                >
                                    About Us
                                </a>
                            </li>
                            <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-secondary text-decoration-none hover-purple"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        handleNavigate('meet-team');
                                    }}
                                >
                                    Meet the Team
                                </a>
                            </li>
                            {isLoggedIn ? (
                                <>
                                    <li className="mb-2">
                                        <a
                                            href="#"
                                            className="text-secondary text-decoration-none hover-purple"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                handleNavigate('quiz-results');
                                            }}
                                        >
                                            Your Results
                                        </a>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="mb-2">
                                        <a
                                            href="#"
                                            className="text-secondary text-decoration-none hover-purple"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                handleNavigate('');
                                            }}
                                        >
                                            Login
                                        </a>
                                    </li>
                                </>
                            )}
                            {/* <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-secondary text-decoration-none hover-purple"
                                >
                                    Terms of Service
                                </a>
                            </li>
                            <li className="mb-2">
                                <a
                                    href="#"
                                    className="text-secondary text-decoration-none hover-purple"
                                >
                                    Privacy Policy
                                </a>
                            </li> */}
                        </ul>
                    </Col>

                    <Col md={4}>
                        <h4 className="text-purple mb-3">Connect With Us</h4>
                        <div className="d-flex gap-3 mb-3">
                            <a
                                href="https://www.linkedin.com/in/musa-qureshi/"
                                className="text-secondary hover-purple"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Linkedin className="icon" size={20} />
                            </a>
                            <a
                                href="https://github.com/musa-q"
                                className="text-secondary hover-purple"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="icon" size={20} />
                            </a>
                            <a
                                href="https://twitter.com/musa_qu"
                                className="text-secondary hover-purple"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Twitter className="icon" size={20} />
                            </a>
                            <a
                                href="mailto:myarabiclearner@gmail.com"
                                className="text-secondary hover-purple"
                            >
                                <Mail className="icon" size={20} />
                            </a>
                        </div>
                        <p className="text-secondary">
                            Contact us: myarabiclearner@gmail.com
                        </p>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <hr className="border-secondary" />
                        <p className="text-center text-secondary mb-0">
                            {currentYear} My Arabic Learner
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;