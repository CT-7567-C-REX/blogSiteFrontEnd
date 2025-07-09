import React, { useState } from 'react';
import { Button, Typography, Box, Alert } from '@mui/material';
import { jwtTestNeedToLogInFirst } from '../services/blogPosts/routes';

function Test() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await jwtTestNeedToLogInFirst();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
      <Button variant="contained" color="primary" onClick={handleClick} disabled={loading}>
        {loading ? 'Sending...' : 'Send Test Request'}
      </Button>
      {response && (
        <Box mt={3}>
          <Typography variant="subtitle1">Response:</Typography>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>{response}</pre>
        </Box>
      )}
      {error && (
        <Box mt={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </Box>
  );
}

export default Test;
