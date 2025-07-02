import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const MainOutlet = () => (
  <Box sx={{ pt: { xs: '56px', md: '64px' } }}>
    <Outlet />
  </Box>
);

export default MainOutlet; 