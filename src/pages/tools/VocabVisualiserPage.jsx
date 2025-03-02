import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { Container, Form, Card, Table } from 'react-bootstrap';
import { API_URL } from '../../config';
import { authManager, capitaliseWords } from '../../utils';

const VocabVisualiserPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [words, setWords] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(
                `${API_URL}/flashcards/get-all-category-names`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchWords = async (categoryId) => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(
                `${API_URL}/flashcards/get-category-flashcards`,
                {
                    category_id: categoryId,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );
            setWords(response.data.words);
        } catch (error) {
            console.error('Error fetching words:', error);
        }
    };

    const handleCategoryChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        const categoryId = e.target.options[selectedIndex].getAttribute('data-id');
        setSelectedCategory(e.target.value);
        if (categoryId) {
            fetchWords(categoryId);
        } else {
            setWords([]);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-2" style={{ minHeight: "100vh" }}>
            <Container>
                <motion.div
                    className="text-center mb-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-3xl font-bold text-center gold pt-5 pb-2 display-4">
                        Vocabulary Visualiser
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-5"
                >
                    <Form.Group className='mb-4'>
                        <Form.Label>Select Category</Form.Label>
                        <Form.Control as="select" onChange={handleCategoryChange} value={selectedCategory}>
                            <option value="">Choose A Category</option>
                            {categories.map(category => (
                                <option
                                    key={category.id}
                                    value={category.category_name}
                                    data-id={category.id}
                                >
                                    {capitaliseWords(category.category_name)}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Card className="text-white">
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table className="table-dark mb-0" hover striped style={{ minWidth: '100%', tableLayout: 'fixed' }}>
                                    <thead>
                                        <tr>
                                            <th className="text-center h5 py-3" style={{ width: '33.33%' }}>English</th>
                                            <th className="text-center h5 py-3" style={{ width: '33.33%' }}>Arabic</th>
                                            <th className="text-center h5 py-3" style={{ width: '33.33%' }}>Transliteration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {words.length > 0 ? (
                                            words.map((word, index) => (
                                                <tr key={index} style={{ cursor: 'pointer' }}>
                                                    <td className="text-center py-3" style={{ fontSize: '0.9rem' }}>{capitaliseWords(word.english)}</td>
                                                    <td className="text-center py-3 arabic-text" >{word.arabic}</td>
                                                    <td className="text-center py-3" style={{ fontSize: '0.9rem' }}>{word.transliteration}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-3">Choose a category to view words</td>
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

export default VocabVisualiserPage;