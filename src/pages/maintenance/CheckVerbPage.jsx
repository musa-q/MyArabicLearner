import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Table, Button, Modal } from 'react-bootstrap';
import { API_URL } from '../../config';

const CheckVerbPage = () => {
    const [verbs, setVerbs] = useState([]);
    const [selectedVerb, setSelectedVerb] = useState('');
    const [conjugations, setConjugations] = useState([]);
    const [editConjugation, setEditConjugation] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchVerbs();
    }, []);

    const fetchVerbs = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(`${API_URL}/maintenance/get-all-verbs`,
                {},
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
            const response = await axios.post(`${API_URL}/maintenance/get-verb-conjugations?verb_id=${verbId}`, {},
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
        const verbId = e.target.value;
        setSelectedVerb(verbId);
        if (verbId) {
            fetchConjugations(verbId);
        } else {
            setConjugations([]);
        }
    };

    const handleEditConjugation = (conjugation) => {
        setEditConjugation(conjugation);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditConjugation(null);
    };

    const handleSaveConjugation = async () => {
        const deviceId = authManager.getDeviceId();
        const token = localStorage.getItem(`authToken_${deviceId}`);
        try {
            const response = await axios.post(`${API_URL}/maintenance/update-conjugation`, {
                id: editConjugation.id,
                conjugation: editConjugation.conjugation
            },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Device-ID': deviceId,
                    }
                }
            );

            if (response.data.success) {
                const updatedConjugations = conjugations.map(c =>
                    c.id === editConjugation.id ? editConjugation : c
                );
                setConjugations(updatedConjugations);
                handleCloseModal();
            } else {
                console.error('Error updating conjugation:', response.data.message);
            }
        } catch (error) {
            console.error('Error saving conjugation:', error);
        }
    };

    const handleInputChange = (e) => {
        setEditConjugation({ ...editConjugation, conjugation: e.target.value });
    };

    return (
        <Container>
            <h1 className='pt-4 text-center'>Check Verb Conjugations</h1>
            <Form.Group className='mb-4'>
                <Form.Label>Select Verb</Form.Label>
                <Form.Control as="select" onChange={handleVerbChange} value={selectedVerb}>
                    <option value="">Choose a verb</option>
                    {verbs.map(verb => (
                        <option key={verb.id} value={verb.id}>{verb.verb}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            {conjugations.length > 0 && (
                <Table striped bordered hover className='mb-5'>
                    <thead>
                        <tr>
                            <th>Tense</th>
                            <th>Pronoun</th>
                            <th>Conjugation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conjugations.map(conjugation => (
                            <tr key={conjugation.id}>
                                <td>{conjugation.tense}</td>
                                <td>{conjugation.pronoun}</td>
                                <td>{conjugation.conjugation}</td>
                                <td>
                                    <Button variant="primary" onClick={() => handleEditConjugation(conjugation)}>Edit</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Conjugation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editConjugation && (
                        <Form>
                            <Form.Group>
                                <Form.Label>Tense: {editConjugation.tense}</Form.Label>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Pronoun: {editConjugation.pronoun}</Form.Label>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Conjugation</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editConjugation.conjugation}
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
                    <Button variant="primary" onClick={handleSaveConjugation}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CheckVerbPage;