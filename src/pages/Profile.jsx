import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, CircularProgress, Alert, Card, CardContent, Grid } from '@mui/material';
import { getProfile } from '../services/users.js/routes';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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

  if (!profile) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="80vh" p={2}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 320, borderRadius: 2, textAlign: 'center', mb: 4 }}>
        <Avatar
          src={profile.profile_image_url}
          alt={profile.fullName || profile.username}
          sx={{ width: 80, height: 80, margin: '0 auto', mb: 2 }}
        >
          {profile.fullName ? profile.fullName[0] : profile.username[0]}
        </Avatar>
        <Typography variant="h5" gutterBottom>{profile.fullName || profile.username}</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>@{profile.username}</Typography>
        <Typography variant="body1" gutterBottom>Email: {profile.email}</Typography>
        {profile.bio && <Typography variant="body2" gutterBottom>Bio: {profile.bio}</Typography>}
      </Paper>
      {Array.isArray(profile.posts) && profile.posts.length > 0 && (
        <Box width="100%" maxWidth={600}>
          <Typography variant="h6" gutterBottom>My Posts</Typography>
          <Grid container spacing={2}>
            {profile.posts.map(post => (
              <Grid item xs={12} sm={6} key={post.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Slug: {post.slug}</Typography>
                    <Typography variant="caption" color="text.secondary">Created: {new Date(post.created_at).toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default Profile;
