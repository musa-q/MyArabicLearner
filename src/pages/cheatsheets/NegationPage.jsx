import React from "react";
import { motion } from "framer-motion";
import { Book, Slash } from 'lucide-react';
import { Container, Card, Table } from 'react-bootstrap';

const NegationPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const negationExamples = [
        { pattern: "ما + Verb", arabic: "ما بحكي", transliteration: "ma bəhki", english: "I don't speak" },
        { pattern: "مش + Adjective", arabic: "مش تعبان", transliteration: "mish taʿban", english: "Not tired" },
        { pattern: " رح + ما + Verb (Future)", arabic: "ما رح أروح", transliteration: "ma raḥ arūḥ", english: "I will not go" },
        { pattern: "ولا + Noun", arabic: "ما عندي ولا كتاب", transliteration: "ma ʿindi wala kitab", english: "I don't have a single book" },
    ];

    const tips = [
        "Use 'ما' (ma) before verbs to negate actions.",
        "For negating adjectives, use 'مش' (mish).",
        "Future tense negation combines 'ما' (ma) with 'رح' (raḥ).",
        "'ولا' (wala) is used for emphatic negation, meaning 'not a single'."
    ];

    return (
        <Container className="pt-2 pb-5">
            <motion.div
                className="text-center mb-5"
                {...fadeIn}
            >
                <h1 className="gold display-4 mb-4">
                    Negation in Arabic
                </h1>
                <p className="lead">
                    Learn how to negate sentences and phrases in Levantine Arabic
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-5"
            >
                <Card className="text-white">
                    <Card.Body className="p-0">
                        <Table className="table-dark mb-0" hover>
                            <thead>
                                <tr>
                                    <th className="text-center h5 py-3">Pattern</th>
                                    <th className="text-center h5 py-3">Arabic</th>
                                    <th className="text-center h5 py-3">Transliteration</th>
                                    <th className="text-center h5 py-3">English</th>
                                </tr>
                            </thead>
                            <tbody>
                                {negationExamples.map((row, index) => (
                                    <tr key={index}>
                                        <td className="text-center py-3 lead">{row.pattern}</td>
                                        <td className="text-center py-3 lead">{row.arabic}</td>
                                        <td className="text-center py-3 lead">{row.transliteration}</td>
                                        <td className="text-center py-3 lead">{row.english}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-5"
            >
                <Card className="text-white">
                    <Card.Header className="d-flex align-items-center">
                        <Book className="me-2" size={20} />
                        <h2 className="h5 mb-0 display-6">Quick Guide</h2>
                    </Card.Header>
                    <Card.Body className="lead">
                        <ul>
                            {tips.map((tip, index) => (
                                <li key={index} className="mb-2">{tip}</li>
                            ))}
                        </ul>
                        <p>
                            Negation is a fundamental part of constructing sentences in Arabic.
                            By mastering the different negation patterns, you can express ideas clearly
                            and effectively in Levantine Arabic.
                        </p>
                    </Card.Body>
                </Card>
            </motion.div>
        </Container>
    );
};

export default NegationPage;
