// src/theme.js
import { createTheme, alpha } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#2563eb', light: '#60a5fa', dark: '#1d4ed8' },
    secondary: { main: '#10b981', light: '#34d399', dark: '#059669' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },

  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.01em' },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box', transition: 'background-color 0.2s ease, color 0.2s ease' },
        body: { margin: 0, padding: 0 },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: '2px solid transparent',
          boxSizing: 'border-box',
          transition: 'border-color 0.3s ease',
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '8px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& svg': {
            fontSize: '1.25rem !important',
            width: '1.25rem !important',
            height: '1.25rem !important',
          },
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem !important',
          width: '1.25rem !important',
          height: '1.25rem !important',
          flexShrink: 0,
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '40px',
          '& svg': {
            fontSize: '1.25rem !important',
            width: '1.25rem !important',
            height: '1.25rem !important',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: 'none',
          fontSize: '0.95rem',
        },
        contained: {
          background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1d4ed8 30%, #3b82f6 90%)',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
          background: alpha('#ffffff', 0.9),
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },
});

export default theme;



