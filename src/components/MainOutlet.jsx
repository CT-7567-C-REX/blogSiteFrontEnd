import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Outlet, useNavigate } from 'react-router-dom';

const MainOutlet = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ pt: { xs: '56px', md: '64px' }, position: 'relative', minHeight: '80vh' }}>
      <Outlet />
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }}
        onClick={() => navigate('/createPost')}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default MainOutlet; 