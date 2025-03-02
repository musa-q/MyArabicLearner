import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import { API_URL } from '../../config';
import { authManager } from '../../utils';

const CheckVocabPage = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [editedFlashcard, setEditedFlashcard] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newFlashcard, setNewFlashcard] = useState({
        english: '',
        arabic: '',
        transliteration: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(`${API_URL}/flashcards/get-all-category-names`,
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

    const fetchFlashcards = async (categoryId) => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(`${API_URL}/flashcards/get-category-flashcards`,
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
            setFlashcards(response.data.words);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        if (categoryId) {
            fetchFlashcards(categoryId);
        } else {
            setFlashcards([]);
        }
    };

    const handleEditFlashcard = (flashcard) => {
        setEditedFlashcard({ ...flashcard });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditedFlashcard(null);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setNewFlashcard({
            english: '',
            arabic: '',
            transliteration: ''
        });
    };

    const handleSaveFlashcard = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(`${API_URL}/maintenance/update-flashcard`,
                {
                    word_id: editedFlashcard.id,
                    category_name: categories.find(cat => cat.id === parseInt(selectedCategory)).category_name,
                    new_english: editedFlashcard.english,
                    new_arabic: editedFlashcard.arabic,
                    new_transliteration: editedFlashcard.transliteration
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );

            if (response.data.success) {
                const updatedFlashcards = flashcards.map(f =>
                    f.id === editedFlashcard.id ? editedFlashcard : f
                );
                setFlashcards(updatedFlashcards);
                handleCloseModal();
            } else {
                console.error('Error updating flashcard:', response.data.message);
            }
        } catch (error) {
            console.error('Error saving flashcard:', error);
        }
    };

    const handleAddFlashcard = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(`${API_URL}/maintenance/add-flashcard`,
                {
                    category_id: selectedCategory,
                    english: newFlashcard.english.toLowerCase(),
                    arabic: newFlashcard.arabic,
                    transliteration: newFlashcard.transliteration
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );

            if (response.data.success) {
                fetchFlashcards(selectedCategory);
                handleCloseAddModal();
            } else {
                console.error('Error adding flashcard:', response.data.message);
            }
        } catch (error) {
            console.error('Error adding flashcard:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedFlashcard(prev => ({ ...prev, [name]: value }));
    };

    const handleNewFlashcardChange = (e) => {
        const { name, value } = e.target;
        setNewFlashcard(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Container>
            <h1 className='pt-4 text-center'>Check Vocab Page</h1>
            <Form.Group className='mb-4'>
                <Form.Label>Select Category</Form.Label>
                <Form.Control as="select" onChange={handleCategoryChange} value={selectedCategory}>
                    <option value="">Choose a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.category_name}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            {selectedCategory && (
                <div className="mb-3">
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        Add New Word
                    </Button>
                </div>
            )}

            {flashcards.length > 0 && (
                <Table striped bordered hover className='mb-5'>
                    <thead>
                        <tr>
                            <th>English</th>
                            <th>Arabic</th>
                            <th>Transliteration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flashcards.map(flashcard => (
                            <tr key={flashcard.id}>
                                <td>{flashcard.english}</td>
                                <td>{flashcard.arabic}</td>
                                <td>{flashcard.transliteration}</td>
                                <td>
                                    <div style={{ cursor: 'pointer' }} onClick={() => handleEditFlashcard(flashcard)}>
                                        Edit
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Flashcard</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editedFlashcard && (
                        <Form>
                            <Form.Group>
                                <Form.Label>English</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="english"
                                    value={editedFlashcard.english}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Arabic</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="arabic"
                                    value={editedFlashcard.arabic}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Transliteration</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="transliteration"
                                    value={editedFlashcard.transliteration}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveFlashcard}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Word</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>English</Form.Label>
                            <Form.Control
                                type="text"
                                name="english"
                                value={newFlashcard.english}
                                onChange={handleNewFlashcardChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Arabic</Form.Label>
                            <Form.Control
                                type="text"
                                name="arabic"
                                value={newFlashcard.arabic}
                                onChange={handleNewFlashcardChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Transliteration</Form.Label>
                            <Form.Control
                                type="text"
                                name="transliteration"
                                value={newFlashcard.transliteration}
                                onChange={handleNewFlashcardChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddFlashcard}>
                        Add Word
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CheckVocabPage;