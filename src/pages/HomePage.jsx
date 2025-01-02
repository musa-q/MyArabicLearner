import React from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Book, Brain, MessageSquare } from 'lucide-react';
import './HomePage.css';
import '../fonts.css';

const HomePage = ({ onNavigate, username }) => {
    const sampleTitles = [
        {
            main: "Learn Real-Life Arabic",
            sub: "Not Textbook Arabic"
        },
        {
            main: "Arabic in Minutes",
            sub: "Not Hours of Study"
        },
        {
            main: "Real Arabic.",
            sub: "Real Simple."
        },
        {
            main: "Arabic Made Easy",
            sub: "Speak Like a Local"
        }
    ];

    const examplePhrases = [
        {
            arabic: "مرحبا، كيف حالك؟",
            transliteration: "Marhaba, keef halak?",
            english: "Hello, how are you?",
            context: "Daily Greetings"
        },
        {
            arabic: "شو بتحب تاكل؟",
            transliteration: "Shu bteheb tekol?",
            english: "What do you like to eat?",
            context: "Restaurant Conversations"
        },
        {
            arabic: "وين رايح؟",
            transliteration: "Wein rayeh?",
            english: "Where are you going?",
            context: "Common Questions"
        }
    ];

    const faqItems = [
        {
            question: "Is it really 100% free?",
            answer: "Yes! All our learning resources including flashcards, quizzes, and practice materials are completely free to use."
        },
        {
            question: "Which Arabic dialect do you teach?",
            answer: "We focus on Levantine Arabic - the everyday language spoken across Jordan, Lebanon, Palestine, and Syria. This is the practical dialect you'll hear in real conversations."
        },
        {
            question: "Do I need any previous Arabic experience?",
            answer: "Not at all! We start from the basics and gradually build your skills through practical phrases and everyday conversations."
        },
        {
            question: "How much time do I need to practice?",
            answer: "You can learn at your own pace! Our bite-sized lessons and flashcards are designed for flexible learning, whether you have 5 minutes or an hour."
        }
    ];

    const mainFeatures = [
        {
            icon: <Book size={32} className="gold" />,
            title: "Interactive Tools",
            description: "Master essential Arabic vocabulary and grammar through engaging practice sessions"
        },
        {
            icon: <Brain size={32} className="gold" />,
            title: "Practical Quizzes",
            description: "Test your knowledge and track your learning progress"
        },
        {
            icon: <MessageSquare size={32} className="gold" />,
            title: "Real Levantine Arabic",
            description: "Learn authentic Arabic as spoken across Jordan, Lebanon, Palestine, and Syria"
        }
    ];

    const randomTitle = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];

    return (
        <div className="homepage ">
            {/* Hero Section */}
            <div className="hero-section">
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col md={8} lg={6}>
                            <img
                                src="/logo_main.svg"
                                alt="My Arabic Learner Logo"
                                className="homepage-logo mb-4"
                            />

                            <h1 className="hero-title mb-3">
                                {randomTitle.main}
                                <div className="gold">
                                    {randomTitle.sub}
                                </div>
                            </h1>

                            <p className="lead text-light mb-4">
                                Start your journey to speaking Levantine Arabic through interactive lessons
                                designed for practical, everyday conversations.
                            </p>

                            <div className="d-flex justify-content-center gap-4 pb-4">
                                <span
                                    className="text-light fs-5"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        onNavigate('tools');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Click to Begin
                                </span>
                                <span
                                    className="text-light fs-5"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        onNavigate('tutorial');
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    View Tutorial
                                </span>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Demo Section */}
            <div className="demo-section">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={10} lg={8}>
                            <h2 className="text-center display-4 mb-4">Common Arabic Phrases</h2>
                            <p className="text-center lead mb-4">
                                Here are some everyday phrases you'll learn to master
                            </p>
                            <div className="demo-card">
                                <div className="demo-body">
                                    <Carousel
                                        interval={3500}
                                        indicators={false}
                                        className="phrase-carousel"
                                        prevIcon={<div className="carousel-arrow">❮</div>}
                                        nextIcon={<div className="carousel-arrow">❯</div>}
                                    >
                                        {examplePhrases.map((phrase, idx) => (
                                            <Carousel.Item key={idx}>
                                                <div className="demo-content text-center">
                                                    <div className="context-label mb-4">
                                                        {phrase.context}
                                                    </div>
                                                    <div className="gold noto-kufi-regular display-6 mb-3">
                                                        {phrase.arabic}
                                                    </div>
                                                    <div className="lead translation">
                                                        {phrase.english}
                                                    </div>
                                                    <div className="transliteration lead ">
                                                        {phrase.transliteration}
                                                    </div>
                                                </div>
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Features Section */}
            <div className="features-section">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={10} lg={8}>
                            <h2 className="text-center display-4 mb-5">How You'll Learn</h2>
                            <Row className="g-4">
                                {mainFeatures.map((feature, idx) => (
                                    <Col key={idx} md={4}>
                                        <div className="feature-card py-4 px-3 text-center">
                                            <div className="mb-3">{feature.icon}</div>
                                            <h4 className="mb-3">{feature.title}</h4>
                                            <p className='accent-color'>{feature.description}</p>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={10} lg={8}>
                            <h2 className="text-center display-4 mb-5">Common Questions</h2>
                            <Row className="g-4">
                                {faqItems.map((item, idx) => (
                                    <Col key={idx} md={6}>
                                        <div className="faq-card">
                                            <h3 className="faq-question mb-3">{item.question}</h3>
                                            <p className="accent-color mb-0">{item.answer}</p>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Final CTA Section */}
            <div className="final-cta-section py-5">
                <Container className="py-5">
                    <Row className="justify-content-center">
                        <Col md={8} className="text-center">
                            <h2 className="display-4 text-light mb-4">Ready to Start Speaking Arabic?</h2>
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <Button
                                    variant="outline-light"
                                    size="lg"
                                    className="main-cta-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        onNavigate('tools');
                                    }}
                                >
                                    Practice Now
                                </Button>
                                <Button
                                    variant="outline-light"
                                    size="lg"
                                    className="main-cta-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        onNavigate('tutorial');
                                    }}
                                >
                                    Watch Tutorial
                                </Button>
                                <Button
                                    variant="outline-light"
                                    size="lg"
                                    className="main-cta-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        onNavigate('about');
                                    }}
                                >
                                    Learn More
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default HomePage;