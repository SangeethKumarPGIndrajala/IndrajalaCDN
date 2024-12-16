// src/Login.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check for existing token on component mount
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            navigate('/home'); // Redirect to home if token exists
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validate fields
        if (!email || !password) {
            setErrorMessage('Both fields are required.');
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('https://api.indrajala.in/api/admin/login', {
                email,
                password,
            });

            // Check if the response status is 200 and token exists
            if (response.status === 200 && response.data.token) {
                Cookies.set('token', response.data.token); // Store token in cookies
                setEmail(''); // Clear email field
                setPassword(''); // Clear password field
                navigate('/home'); // Redirect to home page
            } else {
                setErrorMessage('Login failed. Please check your credentials.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error || 'Login failed. Please check your credentials.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container 
            component="main" 
            maxWidth="xs" 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh' 
            }}
        >
            <Typography variant="h4" sx={{ color: 'black', textAlign: 'center' }}>
                CDN Login
            </Typography>
            <Typography variant="h6" sx={{ color: 'black', textAlign: 'center', marginBottom: 2 }}>
                Indrajala
            </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    sx={{ marginTop: 2 }} 
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </Box>

            {/* Snackbar for error messages */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Login;