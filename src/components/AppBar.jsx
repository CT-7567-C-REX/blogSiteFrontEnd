import * as React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  Divider,
  MenuItem,
  Drawer,
  alpha,
  styled,
} from "@mui/material";
import { useThemeMode } from "../theme/ThemeProvider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import { useNavigate } from 'react-router-dom';
import { signedIn, removeAccessToken } from '../services/session';
import { logout } from '../services/authentication/routes';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(signedIn());
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(signedIn());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await logout();
    } catch (e) {
      // ignore error, always remove token
    }
    removeAccessToken();
    setIsLoggedIn(false);
    setSigningOut(false);
    navigate('/signin');
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const { mode, toggleColorMode } = useThemeMode();

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button variant="text">Features</Button>
              <Button variant="text">Testimonials</Button>
              <Button variant="text">Highlights</Button>
              <Button variant="text">Pricing</Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {isLoggedIn ? (
              <>
                <Button color="primary" variant="contained" size="small" onClick={() => navigate('/profile')}>
                  Profile
                </Button>
                <Button color="secondary" variant="outlined" size="small" onClick={handleSignOut} disabled={signingOut}>
                  {signingOut ? 'Signing Out...' : 'Sign Out'}
                </Button>
              </>
            ) : (
              <Button color="primary" variant="text" size="small" onClick={() => navigate('/signin')}>
                Sign in
              </Button>
            )}
            <IconButton
              onClick={toggleColorMode}
              sx={{ color: mode === "light" ? "#000" : "#fff" }}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton
              onClick={toggleColorMode}
              sx={{ color: mode === "light" ? "#000" : "#fff" }}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem>Features</MenuItem>
                <MenuItem>Testimonials</MenuItem>
                <MenuItem>Highlights</MenuItem>
                <MenuItem>Pricing</MenuItem>
                <MenuItem>FAQ</MenuItem>
                <MenuItem>Blog</MenuItem>
                <Divider sx={{ my: 3 }} />
                {isLoggedIn ? (
                  <>
                    <MenuItem>
                      <Button color="primary" variant="contained" fullWidth onClick={() => { setOpen(false); navigate('/profile'); }}>
                        Profile
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button color="secondary" variant="outlined" fullWidth onClick={() => { setOpen(false); handleSignOut(); }} disabled={signingOut}>
                        {signingOut ? 'Signing Out...' : 'Sign Out'}
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem>
                    <Button color="primary" variant="outlined" fullWidth onClick={() => { setOpen(false); navigate('/signin'); }}>
                      Sign in
                    </Button>
                  </MenuItem>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
