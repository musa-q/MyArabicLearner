import React from "react";
import { motion } from "framer-motion";
import { Book } from 'lucide-react';
import { Container, Card, Table } from 'react-bootstrap';

const VerbConjugationPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const conjugations = [
        { pronoun: "أنا", past: "نمتُ", present: "أنام", future: "رح أنام" },
        { pronoun: "إنتَ", past: "نمتَ", present: "تنام", future: "رح تنام" },
        { pronoun: "إنتِ", past: "نمتي", present: "تنامي", future: "رح تنامي" },
        { pronoun: "هو", past: "نام", present: "ينام", future: "رح ينام" },
        { pronoun: "هي", past: "نامت", present: "تنام", future: "رح تنام" },
        { pronoun: "هم", past: "ناموا", present: "يناموا", future: "رح يناموا" },
        { pronoun: "إحنا", past: "نمنا", present: "ننام", future: "رح ننام" },
    ];

    return (
        <Container className="pt-2 pb-5">
            <motion.div
                className="text-center mb-5"
                {...fadeIn}
            >
                <h1 className="display-4 mb-4gold">
                    Verb Conjugation in Arabic
                </h1>
                <p className="lead">
                    Master verb tenses in Levantine Arabic
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-5"
            >
                <Card className=" text-white">
                    <Card.Body className="p-0">
                        <Table className="table-dark mb-0" hover>
                            <thead >
                                <tr>
                                    <th className="text-center h5 py-3">Pronoun</th>
                                    <th className="text-center h5 py-3">Past</th>
                                    <th className="text-center h5 py-3">Present</th>
                                    <th className="text-center h5 py-3">Future</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conjugations.map((row, index) => (
                                    <tr key={index}>
                                        <td className="text-center py-3 lead">{row.pronoun}</td>
                                        <td className="text-center py-3 lead">{row.past}</td>
                                        <td className="text-center py-3 lead">{row.present}</td>
                                        <td className="text-center py-3 lead">{row.future}</td>
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
                <Card className=" text-white">
                    <Card.Header className="d-flex align-items-center">
                        <Book className="me-2" size={20} />
                        <h2 className="h5 mb-0 display-6">Quick Guide</h2>
                    </Card.Header>
                    <Card.Body>
                        <p className="lead">
                            In Levantine Arabic, verbs are conjugated differently based on the pronoun and tense.
                            The examples above show the conjugation of the verb "نام" (nama) meaning "to sleep" in the past, present, and future tenses.
                        </p>
                        <p className="lead">
                            For the present tense, Levantine Arabic typically uses the prefix "بـ" (b-) attached to the verb. For example,
                            "بنام" (banam) means "I sleep" or "I am sleeping".
                        </p>
                        <p className="lead mb-0">
                            The future tense is formed by adding the particle "رح" (rah) before the present tense verb. For instance,
                            "رح أنام" (rah anam) means "I will sleep".
                        </p>
                    </Card.Body>
                </Card>
            </motion.div>
        </Container>
    );
};

export default VerbConjugationPage;