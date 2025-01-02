import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { Container, Form, Table, Card } from 'react-bootstrap';
import { API_URL } from '../../config';
import { authManager, capitaliseWords } from '../../utils';

const pronounMapping = {
    'i': 'أنا',
    'you_m': 'أنت',
    'you_f': 'أنتِ',
    'he': 'هو',
    'she': 'هي',
    'we': 'إحنا',
    'they': 'هم'
};

const VerbConjunctionVisualiserPage = () => {
    const [verbs, setVerbs] = useState([]);
    const [selectedVerb, setSelectedVerb] = useState('');
    const [conjugations, setConjugations] = useState([]);

    useEffect(() => {
        fetchVerbs();
    }, []);

    const fetchVerbs = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(`${API_URL}/visualisers/get-verbs`, {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );
            setVerbs(response.data);
        } catch (error) {
            console.error('Error fetching verbs:', error);
        }
    };

    const fetchConjugations = async (verbId) => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(`${API_URL}/visualisers/get-verb-table`, { verbId: verbId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );
            setConjugations(response.data);
        } catch (error) {
            console.error('Error fetching conjugations:', error);
        }
    };

    const handleVerbChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        const verbId = e.target.options[selectedIndex].getAttribute('data-id');
        setSelectedVerb(e.target.value);
        if (verbId) {
            fetchConjugations(verbId);
        } else {
            setConjugations([]);
        }
    };

    const renderConjugations = () => {
        const tenses = ['past', 'present', 'future'];
        const pronouns = [...new Set(conjugations.map(conjugation => conjugation.pronoun))];

        return pronouns.map(pronoun => {
            const row = { pronoun: pronounMapping[pronoun] || pronoun };
            tenses.forEach(tense => {
                const conjugation = conjugations.find(c => c.pronoun === pronoun && c.tense === tense);
                row[tense] = conjugation ? conjugation.conjugation : '';
            });
            return row;
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-2" style={{ minHeight: "100vh" }}>
            <Container >
                <motion.div
                    className="text-center mb-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl font-bold text-center gold pt-5 pb-2 display-4">
                        Verb Conjugation Visualiser
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-5"
                >
                    <Form.Group className='mb-4'>
                        <Form.Label>Select Verb</Form.Label>
                        <Form.Control as="select" onChange={handleVerbChange} value={selectedVerb}>
                            <option value="">Choose A Verb</option>
                            {verbs.map(verb => (
                                <option key={verb.id} value={verb.verb} data-id={verb.id}>{capitaliseWords(verb.verb)}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Card className="text-white">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table className="table-dark mb-0" hover striped>
                                    <thead>
                                        <tr>
                                            <th className="text-center h5 py-3">Past</th>
                                            <th className="text-center h5 py-3">Present</th>
                                            <th className="text-center h5 py-3">Future</th>
                                            <th className="text-center h5 py-3">Pronoun</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {conjugations.length > 0 ? (
                                            renderConjugations().map((row, index) => (
                                                <tr key={index}>
                                                    <td className="text-center py-3 lead">{row.past}</td>
                                                    <td className="text-center py-3 lead">{row.present}</td>
                                                    <td className="text-center py-3 lead">{row.future}</td>
                                                    <td className="text-center py-3 lead">{row.pronoun}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-3 lead">Choose A Verb</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default VerbConjunctionVisualiserPage;