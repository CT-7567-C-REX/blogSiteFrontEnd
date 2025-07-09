// theme/themes.js
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#5d687d",        // Muted steel blue
      light: "#8b95a8",       // Lighter version for hover, etc.
      dark: "#3b4456",        // Darker version
      contrastText: "#ffffff" // Button text on primary
    },
    secondary: {
      main: "#cbced4",        // Soft gray
      light: "#e2e4e9",
      dark: "#a2a6ad",
      contrastText: "#3d414a"
    },
    background: {
      default: "#f7f8fa",     // Light background
      paper: "#ffffff"        // For cards, dialogs, etc.
    },
    text: {
      primary: "#1c1e21",     // Main text
      secondary: "#5d687d",   // Subtle accent text
    },
    divider: "#d1d5da",       // Table and layout dividers
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#ed6c02",
    },
    info: {
      main: "#0288d1",
    },
    success: {
      main: "#2e7d32",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#e3e6ec",
          },
        },
      },
    },
  },
});


export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5d687d",
      light: "#7c869a",
      dark: "#3c4452",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#9ca3af",
      light: "#b1b7c1",
      dark: "#6b7280",
      contrastText: "#ffffff"
    },
    background: {
      default: "#1e1e2f",
      paper: "#2c2c3a"
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#a9b0bb"
    },
    divider: "#4a4a5a",
    error: {
      main: "#ef5350",
    },
    warning: {
      main: "#ffa726",
    },
    info: {
      main: "#29b6f6",
    },
    success: {
      main: "#66bb6a",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#4b566b",
          },
        },
      },
    },
  },
});

