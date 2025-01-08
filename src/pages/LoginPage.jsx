import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './LoginPage.css';
import { API_URL } from '../config';
import { v4 as uuidv4 } from 'uuid';
import { authManager } from '../utils';

const LoginPage = ({ onLogin, sessionExpired }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [showTokenInput, setShowTokenInput] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [storedEmail, setStoredEmail] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    useEffect(() => {
        if (sessionExpired) {
            setMessage('Your session has expired. Please log in again.');
        }
    }, [sessionExpired]);

    useEffect(() => {
        let storedDeviceId = localStorage.getItem('deviceId');
        if (!storedDeviceId) {
            storedDeviceId = uuidv4();
            localStorage.setItem('deviceId', storedDeviceId);
        }
        setDeviceId(storedDeviceId);

        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setStoredEmail(storedEmail);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const payload = {
                'email': email || storedEmail,
                'username': isNewUser ? username : undefined,
                'device_id': deviceId
            };
            const response = await axios.post(`${API_URL}/auth/login`, payload);
            setMessage(response.data.message);
            setShowTokenInput(true);
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
            const response = await axios.post(`${API_URL}/auth/verify`, {
                'email': email || storedEmail,
                'token': token,
                'device_id': deviceId
            });

            onLogin(response.data.token, response.data.refresh_token, email || storedEmail);
            setMessage('Login successful!');
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-container">
            {!showTokenInput ? (
                <div className="login-container">
                    <div className="login-header text-center">
                        <h3 className="display-3">Login / Signup</h3>
                    </div>
                    <div className="login-body">
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-4" controlId="formBasicEmail">
                                <Form.Label className='lead'>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    value={email || storedEmail || ''}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setStoredEmail(null);
                                    }}
                                    required
                                />
                            </Form.Group>

                            {isNewUser && (
                                <Form.Group className="mb-4" controlId="formBasicUsername">
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
                                    className='button'
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
                    </div>
                </div>
            ) : (
                <div className="login-container">
                    <div className="login-header text-center">
                        <h3 style={{ fontSize: "1.5rem" }}>Enter Token</h3>
                    </div>
                    <div className="login-body">
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
                                    className='button'
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Token'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
            {message && (
                <Alert
                    className="mt-3"
                    variant={sessionExpired ? "warning" : "primary"}
                >
                    {message}
                </Alert>
            )}
        </div>
    );

};

export default LoginPage;