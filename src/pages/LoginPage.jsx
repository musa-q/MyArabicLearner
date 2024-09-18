import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); // For new user registration
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false); // Track if it's a new user

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const payload = isNewUser ? { email, username } : { email };
            const response = await axios.post('http://127.0.0.1:5000/auth/login', payload);
            setMessage(response.data.message);
            setShowTokenInput(true);
        } catch (error) {
            if (error.response.status === 404) {
                setMessage('User not found. Please enter a username to create an account.');
                setIsNewUser(true);
            } else {
                setMessage(error.response.data.error);
            }
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/verify', { email, token });
            setMessage(response.data.message);
            onLogin(response.data.user_id, response.data.token);  // Pass both user_id and token
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            {!showTokenInput ? (
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

                    <Button variant="primary" type="submit">
                        {isNewUser ? 'Create Account' : 'Send Login Token'}
                    </Button>
                </Form>
            ) : (
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
                    <Button variant="primary" type="submit">
                        Verify Token
                    </Button>
                </Form>
            )}
            {message && <Alert className="mt-3">{message}</Alert>}
        </div>
    );
};

export default LoginPage;
