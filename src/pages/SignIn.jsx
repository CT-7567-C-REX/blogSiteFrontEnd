import { Box, TextField, Button, Paper, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { login } from '../services/authentication/routes';

function SignIn() {
    const navigate = useNavigate();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ emailOrUsername, password });
            navigate('/'); // Redirect to home or dashboard on success
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ padding: 4, minWidth: 300, borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>
                <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
                    <TextField label="Email or Username" fullWidth required value={emailOrUsername} onChange={e => setEmailOrUsername(e.target.value)} />
                    <TextField label="Password" type="password" fullWidth required value={password} onChange={e => setPassword(e.target.value)} />
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
                <Box mt={3} textAlign="center">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Don't have an account?
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={() => navigate('/signup')}>
                        Sign Up
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default SignIn;