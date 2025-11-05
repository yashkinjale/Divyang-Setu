// src/theme.js
import { createTheme, alpha } from '@mui/material';

const buttonSize = '40px';
const iconSize = '24px';

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb', light: '#60a5fa', dark: '#1d4ed8' },
    secondary: { main: '#10b981', light: '#34d399', dark: '#059669' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },

  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 500, lineHeight: 1, letterSpacing: '0.01em' },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box', transition: 'background-color 0.2s ease, color 0.2s ease' },
        body: { margin: 0, padding: 0 },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minHeight: buttonSize,
          lineHeight: 1,
          padding: '0 16px',
          boxSizing: 'border-box',
          verticalAlign: 'middle',
          borderRadius: 12,
        },
        startIcon: {
          width: buttonSize,
          height: buttonSize,
          display: 'inline-flex !important',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '8px !important',
          lineHeight: 0,
          flexShrink: 0,
        },
        endIcon: {
          width: buttonSize,
          height: buttonSize,
          display: 'inline-flex !important',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '8px !important',
          lineHeight: 0,
          flexShrink: 0,
        },
        contained: {
          background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
          '&:hover': { background: 'linear-gradient(45deg, #1d4ed8 30%, #3b82f6 90%)' },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          width: buttonSize,
          height: buttonSize,
          padding: 0,
          margin: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          boxSizing: 'border-box',
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          width: iconSize,
          height: iconSize,
          display: 'block',
          verticalAlign: 'middle',
          flexShrink: 0,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: '#ffffff',
          borderRadius: 12,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: 'none',
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          lineHeight: 1,
        },
        input: {
          lineHeight: 1,
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          lineHeight: 1,
        },
      },
    },
  },
});

export default theme;


