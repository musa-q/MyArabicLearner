import React from "react";
import { motion } from "framer-motion";
import { Book, Layout } from 'lucide-react';
import { Container, Card } from 'react-bootstrap';

const SentenceConstructionPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const patterns = [
        {
            pattern: "Subject + Verb + Object",
            arabic: "أنا بشرب قهوة",
            transliteration: "ana bashrab qahwa",
            english: "I drink coffee"
        },
        {
            pattern: "Subject + Verb + Location",
            arabic: "هو بروح عالسوق",
            transliteration: "huwe biruh 'al-souq",
            english: "He goes to the market"
        },
        {
            pattern: "Verb + Object + Time",
            arabic: "أكلت الغدا الساعة تنتين",
            transliteration: "akalt el-ghada el-sa'a tintayn",
            english: "I ate lunch at 2 o'clock"
        },
        {
            pattern: "Subject + Adjective + Noun",
            arabic: "عندي سيارة حمرا",
            transliteration: "'indi sayara hamra",
            english: "I have a red car"
        }
    ];

    const tips = [
        "Unlike English, Arabic verbs usually come before the subject in formal speech",
        "Adjectives come after the noun they describe",
        "Time expressions usually come at the end of the sentence",
        "In Levantine Arabic, we often start with the subject followed by the verb"
    ];

    return (
        <Container className="pt-2 pb-5">
            <motion.div
                className="text-center mb-5"
                {...fadeIn}
            >
                <h1 className="gold display-4 mb-4 text-purple-400">
                    Sentence Construction in Arabic
                </h1>
                <p className="lead text-gray-300">
                    Learn how to build basic sentences in Levantine Arabic
                </p>
            </motion.div>

            <motion.div
                className="row g-4 mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                {patterns.map((item, index) => (
                    <motion.div
                        key={index}
                        className="col-12"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <Card className="text-white border-purple-400">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center">
                                        <Layout className="text-purple-400 me-2" size={20} />
                                        <h3 className="h4 mb-0">{item.pattern}</h3>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <p className="text-purple-400 mb-1">English:</p>
                                        <p className="lead">{item.english}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p className="text-purple-400 mb-1">Transliteration:</p>
                                        <p className="lead">{item.transliteration}</p>
                                    </div>
                                    <div className="col-md-4">
                                        <p className="text-purple-400 mb-1">Arabic:</p>
                                        <p className="lead">{item.arabic}</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-5"
            >
                <Card className="text-white">
                    <Card.Header className="d-flex align-items-center">
                        <Book className="text-purple-400 me-2" size={20} />
                        <h2 className="h5 mb-0 display-6">Quick Guide</h2>
                    </Card.Header>
                    <Card.Body className="text-gray-300">
                        <p className="lead">
                            Levantine Arabic sentence structure is relatively flexible, but there are some common patterns
                            that can help you construct basic sentences.
                        </p>
                        <ul className="lead">
                            {tips.map((tip, index) => (
                                <li key={index} className="mb-2">{tip}</li>
                            ))}
                        </ul>
                    </Card.Body>
                </Card>
            </motion.div>
        </Container>
    );
};

export default SentenceConstructionPage;