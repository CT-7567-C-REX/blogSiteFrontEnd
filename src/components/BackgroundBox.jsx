import { Box } from '@mui/material';

const BackgroundBox = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      backgroundImage: 'url(/background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {children}
  </Box>
);

export default BackgroundBox; 