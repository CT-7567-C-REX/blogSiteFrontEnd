import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignIn() {
    const navigate = useNavigate();
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ padding: 4, minWidth: 300, borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>
                <Box component="form" display="flex" flexDirection="column" gap={2}>
                    <TextField label="Email" type="email" fullWidth required />
                    <TextField label="Password" type="password" fullWidth required />
                    <Button type="submit" variant="contained" fullWidth>
                        Sign In
                    </Button>
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