import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = isNewUser ? { email, username } : { email };
            const response = await axios.post('http://127.0.0.1:5000/auth/login', payload);
            setMessage(response.data.message);
            if (response.data.authenticated) {
                onLogin(response.data.token);
            } else {
                setShowTokenInput(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage('User not found. Please enter a username to create an account.');
                setIsNewUser(true);
            } else {
                setMessage(error.response ? error.response.data.error : 'An error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:5000/auth/verify', { email, token });
            setMessage(response.data.message);
            onLogin(response.data.token);
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-5 login-page-container">
            {!showTokenInput ? (
                <Card className="mt-3 login-card">
                    <Card.Header className="text-center">
                        <h3 style={{ fontSize: "1.5rem" }}>Login</h3>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            {isNewUser && (
                                <Form.Group className="mb-3" controlId="formBasicUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            )}

                            <div className="d-flex justify-content-center">
                                <Button
                                    variant="outline-light"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? 'Sending...'
                                        : (isNewUser ? 'Create Account' : 'Send Login Token')
                                    }
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="mt-3 login-card">
                    <Card.Header className="text-center">
                        <h3 style={{ fontSize: "1.5rem" }}>Enter Token</h3>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleVerify}>
                            <Form.Group className="mb-3" controlId="formBasicToken">
                                <Form.Label>Enter Token</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <div className="d-flex justify-content-center">
                                <Button
                                    variant="outline-light"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Token'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            )}
            {message && <Alert className="mt-3">{message}</Alert>}
        </div>
    );
};

export default LoginPage;