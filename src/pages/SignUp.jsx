import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authentication/routes';

function SignUp() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Passwords must be the same!');
            return;
        }
        setLoading(true);
        try {
            await register({ username, fullName, email, password, passwordAgain: confirmPassword });
            navigate('/signin'); // Redirect to sign in after successful registration
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ padding: 4, minWidth: 300, borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign Up
                </Typography>
                <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
                    <TextField label="Username" type="text" fullWidth required value={username} onChange={e => setUsername(e.target.value)} />
                    <TextField label="Name" type="text" fullWidth required value={fullName} onChange={e => setFullName(e.target.value)} />
                    <TextField label="Email" type="email" fullWidth required value={email} onChange={e => setEmail(e.target.value)} />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
            </Paper>
        </Box>
    );
}

export default SignUp; 