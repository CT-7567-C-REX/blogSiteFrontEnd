import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Alert } from '@mui/material';
import { createPost } from '../services/api';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        try {
            await createPost({ title, content });
            setSuccess('Post created successfully!');
            setTitle('');
            setContent('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post.');
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={{ xs: 'calc(100vh - 56px)', md: 'calc(100vh - 64px)' }}>
            <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, p: 4, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>Create Post</Typography>
                <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
                    <TextField label="Title" variant="outlined" required fullWidth value={title} onChange={e => setTitle(e.target.value)} />
                    <TextField label="Content" variant="outlined" required fullWidth multiline rows={6} value={content} onChange={e => setContent(e.target.value)} />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Create Post
                    </Button>
                </Box>
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Paper>
        </Box>
    );
}

export default CreatePost;
