import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import './HomePage.css';
import '../fonts.css';
import AppFeedback from '../components/AppFeedback';
import logo from '/logo_main.svg';
import { motion, useAnimation } from "framer-motion";
import TypingAnimation from '../components/TypingAnimation';

const HomePage = ({ onNavigate, username }) => {
    const [showFeedbackToast, setShowFeedbackToast] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const logoControls = useAnimation();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFeedbackToast(true);
        }, 1750);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (imageLoaded) {
            logoControls.start({
                x: 0,
                rotate: 0,
                transition: {
                    type: "spring",
                    damping: 10,
                    stiffness: 75,
                    duration: 1.5
                }
            });

            const intervalId = setInterval(() => {
                logoControls.start({
                    y: [0, -30, 0],
                    transition: {
                        duration: 0.5,
                        times: [0, 0.5, 1],
                        ease: ["easeOut", "easeIn"]
                    }
                });
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [logoControls, imageLoaded]);

    const handleCloseToast = () => setShowFeedbackToast(false);
    const handleShowModal = () => {
        setShowFeedbackModal(true);
        setShowFeedbackToast(false);
    };
    const handleCloseModal = () => setShowFeedbackModal(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <div className="home-page-container">
            {!imageLoaded &&
                <div className="homepage-logo homepage-logo-placeholder gold">
                    <h1>My Arabic Learner</h1>
                    <h2>متعلمو العربية</h2>
                </div>}

            <motion.img
                src={logo}
                alt="Logo"
                className="homepage-logo"
                loading="lazy"
                onLoad={handleImageLoad}
                style={{ display: imageLoaded ? 'block' : 'none' }}
                initial={{ x: "-100%", rotate: -720 }}
                animate={logoControls}
                transition={{
                    type: "spring",
                    damping: 10,
                    stiffness: 75,
                    duration: 10
                }}
            />

            <TypingAnimation text={"أهلاً وسهلاً"} />

            <AppFeedback data-bs-theme="dark" show={showFeedbackModal} handleClose={handleCloseModal} />

            <ToastContainer
                className="p-3"
                position={"bottom-end"}
                style={{ zIndex: 1 }}
            >
                <Toast show={showFeedbackToast} onClose={handleCloseToast} className="feedback-toast" >
                    <Toast.Header>
                        <strong className="me-auto">Feedback</strong>
                    </Toast.Header>
                    <Toast.Body onClick={handleShowModal} style={{ fontSize: "15px", cursor: "pointer" }}>{username}, we'd love your feedback! Click this pop-up!</Toast.Body>
                </Toast>
            </ToastContainer>
        </div >
    );
};

export default HomePage;