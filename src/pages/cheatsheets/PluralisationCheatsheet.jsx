import React from "react";
import { motion } from "framer-motion";
import { Book, Layers } from 'lucide-react';
import { Container, Card, Table } from 'react-bootstrap';

const PluralisationPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const pluralExamples = [
        { pattern: "Sound Masculine", arabic: "معلّم -> معلّمون", transliteration: "muʿallim -> muʿallimūn", english: "Teacher -> Teachers (m)" },
        { pattern: "Sound Feminine", arabic: "معلّمة -> معلّمات", transliteration: "muʿallima -> muʿallimāt", english: "Teacher -> Teachers (f)" },
        { pattern: "Broken Plural 1", arabic: "كتاب -> كتب", transliteration: "kitāb -> kutub", english: "Book -> Books" },
        { pattern: "Broken Plural 2", arabic: "مدينة -> مدن", transliteration: "madīna -> mudun", english: "City -> Cities" },
    ];

    const tips = [
        "Sound plurals add endings based on gender: '-ūn' (masculine) or '-āt' (feminine).",
        "Broken plurals involve changing the structure of the singular word.",
        "Master common broken plural patterns to improve fluency.",
        "Pay attention to context, as some words might use irregular plurals."
    ];

    return (
        <Container className="pt-2 pb-5">
            <motion.div
                className="text-center mb-5"
                {...fadeIn}
            >
                <h1 className="gold display-4 mb-4">
                    Pluralisation in Arabic
                </h1>
                <p className="lead">
                    Learn how to form plurals in Levantine Arabic
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
                                {pluralExamples.map((row, index) => (
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
                        <Layers className="me-2" size={20} />
                        <h2 className="h5 mb-0 display-6">Quick Guide</h2>
                    </Card.Header>
                    <Card.Body className="lead">
                        <ul>
                            {tips.map((tip, index) => (
                                <li key={index} className="mb-2">{tip}</li>
                            ))}
                        </ul>
                        <p>
                            Pluralisation in Arabic is a mix of patterns and structures. While sound plurals
                            follow predictable rules, broken plurals require memorization of specific forms.
                            Practice with real-world examples to master this important skill!
                        </p>
                    </Card.Body>
                </Card>
            </motion.div>
        </Container>
    );
};

export default PluralisationPage;
