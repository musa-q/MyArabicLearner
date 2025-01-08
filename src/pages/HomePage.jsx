import React from 'react';
import { Container, Row, Col, Button, Carousel, Form } from 'react-bootstrap';
import { Book, Brain, MessageSquare, SmilePlus } from 'lucide-react';
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
            icon: <SmilePlus size={32} className="gold" />,
            title: "100% Free",
            description: "Access all learning materials and tools without any cost or subscription"
        },
        {
            icon: <Book size={32} className="gold" />,
            title: "Interactive Tools and Quizzes",
            description: "Master and track your vocabulary and grammer progress through engaging practice sessions"
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
            <div className="hero-section pb-5">
                <Container>
                    <Row>
                        <Col md={7} className="text-section">
                            <div className="text-center">
                                <img
                                    src="/logo_main.svg"
                                    alt="My Arabic Learner Logo"
                                    className="hero-logo"
                                    style={{ maxWidth: '100px' }}
                                />
                            </div>
                            <div className="pb-2">
                                <h1 className="hero-title mb-3 text-center">
                                    {randomTitle.main}
                                    <div className="gold">
                                        {randomTitle.sub}
                                    </div>
                                </h1>

                                <p className="lead text-light mb-4 text-center">
                                    Learn Levantine Arabic effortlessly—free lessons and learning tools designed for for real-life conversations
                                </p>
                            </div>

                            {/* Signup Box */}
                            <Row className="signup-row justify-content-center">
                                <div className="signup-box">
                                    {!username ? (
                                        <Form className="w-100" onSubmit={(e) => {
                                            e.preventDefault();
                                            localStorage.setItem('email', e.target.elements.formBasicEmail.value);
                                            onNavigate('');
                                        }}>
                                            <Row className="mb-3">
                                                <Form.Group controlId="formBasicEmail">
                                                    <Form.Control
                                                        type="email"
                                                        placeholder="Email"
                                                        className="py-2"
                                                        required
                                                    />
                                                </Form.Group>
                                            </Row>

                                            <div className="d-flex justify-content-center w-100 mb-2">
                                                <Button
                                                    className='button w-100 py-3 lead'
                                                    size="lg"
                                                    variant="primary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        localStorage.setItem('email', e.target.form.elements.formBasicEmail.value);
                                                        onNavigate('');
                                                    }}
                                                >
                                                    I Want To Speak Arabic Today!
                                                </Button>
                                            </div>
                                            <Row>
                                                <div className="text-light text-center small">
                                                    We will never share your email with anyone
                                                </div>
                                            </Row>
                                        </Form>
                                    ) : (
                                        <div className="text-center w-100">
                                            <div className="display-6 gold mb-4 pb-2">
                                                Welcome Back, {username}!
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                className="w-100 py-3 lead"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onNavigate('tools');
                                                }}
                                            >
                                                I Want To Continue Learning!
                                            </Button>

                                        </div>
                                    )}
                                </div>
                            </Row>

                            <Row>
                                <div className="social-proof pt-5">
                                    <div className="d-flex">
                                        <p className="mb-0 me-2 lead">Used by students and teachers worldwide on</p>
                                        <a href="https://preply.com" target="_blank" rel="noopener noreferrer">
                                            <img
                                                src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Preply-logo.png"
                                                alt="Preply Logo"
                                                className="preply-logo"
                                                style={{ height: '30px' }}
                                            />
                                        </a>
                                    </div>
                                </div>
                            </Row>
                        </Col>

                        <Col md={5} className="image-section">
                            <img
                                src="/hero_img.webp"
                                // src="/logo_main.svg"
                                alt="My Arabic Learner Logo"
                                className="hero-image  pt-4"
                            />
                            <img
                            />
                        </Col>
                    </Row>

                </Container>
            </div >

            {/* Features Section */}
            < div className="features-section" >
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={10}>
                        <h2 className="text-center display-4 mb-5">Here's Why My Arabic Learner:</h2>
                        <Row className="g-4">
                            {mainFeatures.map((feature, idx) => (
                                <Col key={idx} xs={12} sm={6} md={4}>
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

            </div >



            {/* FAQ Section */}
            < div className="faq-section" >
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={8}>
                        <h2 className="text-center display-4 mb-5">Common Questions</h2>
                        <Row className="g-4">
                            {faqItems.map((item, idx) => (
                                <Col key={idx} xs={12} sm={6}>
                                    <div className="faq-card">
                                        <h3 className="faq-question mb-3">{item.question}</h3>
                                        <p className="accent-color mb-0">{item.answer}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </div >

            {/* Demo Section */}
            < div className="demo-section" >
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={8}>
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
                                                <div className="context-label mb-3">
                                                    {phrase.context}
                                                </div>
                                                <div className="gold noto-kufi-regular display-6 mb-2">
                                                    {phrase.arabic}
                                                </div>
                                                <div className="lead translation">
                                                    {phrase.english}
                                                </div>
                                                <div className="transliteration lead">
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
            </div >

            {/* Final CTA Section */}
            < div className="final-cta-section py-5" >
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
            </div >
        </div >
    );
};

export default HomePage;
