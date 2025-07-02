import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';

function SignUp() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords must be the same!");
        } else {
            setError('');
            // Proceed with sign up logic
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ padding: 4, minWidth: 300, borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign Up
                </Typography>
                <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
                    <TextField label="Name" type="text" fullWidth required />
                    <TextField label="Email" type="email" fullWidth required />
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
                    <Button type="submit" variant="contained" fullWidth>
                        Sign Up
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default SignUp; 