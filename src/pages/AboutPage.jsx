import React from 'react';
import { motion } from "framer-motion";
import { Book, Users, Brain, MessageSquare } from 'lucide-react';
import { Button } from 'react-bootstrap';

const AboutPage = ({ onNavigate }) => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const features = [
        {
            icon: <Book className="mb-4" />,
            title: "Comprehensive Resources",
            description: "Access cheat sheets and flashcards covering essential grammar and vocabulary"
        },
        {
            icon: <Brain className="mb-4" />,
            title: "Interactive Learning",
            description: "Practice with quizzes and track your progress over time"
        },
        {
            icon: <MessageSquare className="mb-4" />,
            title: "AI Conversation Partner",
            description: "Coming soon: Practice conversations with our AI chatbot"
        },
        {
            icon: <Users className="mb-4" />,
            title: "Community Focus",
            description: "Learn the Levantine dialect used across Jordan, Lebanon, Palestine, and Syria"
        }
    ];

    return (
        <div className="min-h-screen px-4" style={{ minHeight: "100vh" }}>
            <div className=" mx-auto" style={{ maxWidth: '70%' }}>
                <motion.div
                    className="text-center"
                    {...fadeIn}
                >
                    <h1 className="pt-5 mb-4 gold display-4">
                        About My Arabic Learner
                    </h1>
                    <p className="lead">
                        Your journey to mastering Levantine Arabic starts here
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="">
                        <p className="text-center pb-3 lead">
                            Whether you're just starting out or want to level up your Arabic conversations,
                            we're here to make learning Levantine Arabic easy, fun, and practical. Our platform
                            combines modern learning techniques with traditional language education to create
                            an effective learning experience.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className=""
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="py-2"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="text-center">
                                <div className="purple-color-a20">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-2 gold display-6">{feature.title}</h3>
                                <p className="lead">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    <div className="pt-4 mb-4">
                        <h2 className="mb-4 gold display-6">Ready to Begin?</h2>
                        <p className="lead">
                            Start your journey into the beautiful world of Levantine Arabic today!
                        </p>
                        <Button
                            variant="outline-light"
                            type="button"
                            className="main-cta-button mt-4"
                            style={{ maxWidth: '300px' }}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                onNavigate('tools');
                            }}
                        >
                            <div className="lead">
                                Get Started
                            </div>
                        </Button>
                    </div>
                </motion.div>
            </div >
        </div >
    );
};

export default AboutPage;