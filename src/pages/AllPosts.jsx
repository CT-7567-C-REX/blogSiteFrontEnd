import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { allPosts } from '../services/blogPosts/routes';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        allPosts()
            .then(res => {
                setPosts(res.data.posts);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch posts.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box p={2}>
            <Typography variant="h4" align="center" gutterBottom>All Posts</Typography>
            <Grid container spacing={2} justifyContent="center">
                {posts.map(post => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{post.title}</Typography>
                                <Typography variant="body2">{post.content}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default AllPosts; 