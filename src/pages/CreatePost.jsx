import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Alert } from '@mui/material';
import { createPost } from '../services/blogPosts/routes';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [featuredImageUrl, setFeaturedImageUrl] = useState('');
    const [featuredImageAltText, setFeaturedImageAltText] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        setLoading(true);
        try {
            await createPost({
                title,
                content,
                slug: slug || undefined,
                meta_description: metaDescription || undefined,
                keywords: keywords || undefined,
                featured_image_url: featuredImageUrl || undefined,
                featured_image_alt_text: featuredImageAltText || undefined
            });
            setSuccess('Post created successfully!');
            setTitle('');
            setContent('');
            setSlug('');
            setMetaDescription('');
            setKeywords('');
            setFeaturedImageUrl('');
            setFeaturedImageAltText('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={{ xs: 'calc(100vh - 56px)', md: 'calc(100vh - 64px)' }}>
            <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, p: 4, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>Create Post</Typography>
                <Box component="form" display="flex" flexDirection="column" gap={2} onSubmit={handleSubmit}>
                    <TextField label="Title" variant="outlined" required fullWidth value={title} onChange={e => setTitle(e.target.value)} />
                    <TextField label="Content" variant="outlined" required fullWidth multiline rows={6} value={content} onChange={e => setContent(e.target.value)} />
                    <TextField label="Slug (optional)" variant="outlined" fullWidth value={slug} onChange={e => setSlug(e.target.value)} />
                    <TextField label="Meta Description (optional)" variant="outlined" fullWidth value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
                    <TextField label="Keywords (optional)" variant="outlined" fullWidth value={keywords} onChange={e => setKeywords(e.target.value)} />
                    <TextField label="Featured Image URL (optional)" variant="outlined" fullWidth value={featuredImageUrl} onChange={e => setFeaturedImageUrl(e.target.value)} />
                    <TextField label="Featured Image Alt Text (optional)" variant="outlined" fullWidth value={featuredImageAltText} onChange={e => setFeaturedImageAltText(e.target.value)} />
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        {loading ? 'Creating...' : 'Create Post'}
                    </Button>
                </Box>
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </Paper>
        </Box>
    );
}

export default CreatePost;
