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
            icon: <Book className="h-8 w-8 mb-4 text-purple-400" />,
            title: "Comprehensive Resources",
            description: "Access cheat sheets and flashcards covering essential grammar and vocabulary"
        },
        {
            icon: <Brain className="h-8 w-8 mb-4 text-purple-400" />,
            title: "Interactive Learning",
            description: "Practice with quizzes and track your progress over time"
        },
        {
            icon: <MessageSquare className="h-8 w-8 mb-4 text-purple-400" />,
            title: "AI Conversation Partner",
            description: "Coming soon: Practice conversations with our AI chatbot"
        },
        {
            icon: <Users className="h-8 w-8 mb-4 text-purple-400" />,
            title: "Community Focus",
            description: "Learn the Levantine dialect used across Jordan, Lebanon, Palestine, and Syria"
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto" style={{ maxWidth: '70%' }}>
                <motion.div
                    className="text-center mb-16"
                    {...fadeIn}
                >
                    <h1 className="text-4xl font-bold pt-5 mb-4 gold">
                        About My Arabic Learner
                    </h1>
                    <p className="text-xl text-gray-300">
                        Your journey to mastering Levantine Arabic starts here
                    </p>
                </motion.div>

                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <div className="">
                        <p className="text-lg text-gray-300 leading-relaxed text-center pb-3">
                            Whether you're just starting out or want to level up your Arabic conversations,
                            we're here to make learning Levantine Arabic easy, fun, and practical. Our platform
                            combines modern learning techniques with traditional language education to create
                            an effective learning experience.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 gap-8 mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="p-6 hover:shadow-xl duration-300 py-2"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="text-center">
                                {feature.icon}
                                <h3 className="text-xl font-semibold mb-2 gold">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
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
                    <div className="p-8 pt-4">
                        <h2 className="text-2xl font-bold mb-4 gold">Ready to Begin?</h2>
                        <p className="text-lg text-gray-300 mb-6">
                            Start your journey into the beautiful world of Levantine Arabic today!
                        </p>
                        <Button
                            variant="outline-light"
                            type="button"
                            className="button text-white mt-4 py-3 px-8 duration-300"
                            style={{ maxWidth: '300px' }}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                onNavigate('wordsflashcard');
                            }}
                        >
                            Get Started
                        </Button>
                    </div>
                </motion.div>
            </div >
        </div >
    );
};

export default AboutPage;