// src/theme.js
import { createTheme, alpha } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#3b82f6', light: '#93c5fd', dark: '#2563eb' },
    secondary: { main: '#10b981', light: '#34d399', dark: '#059669' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },

  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': { fontSize: '2.5rem' }
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': { fontSize: '2rem' }
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': { fontSize: '1.75rem' }
    },
    h4: {
      fontWeight: 600,
      '@media (max-width:600px)': { fontSize: '1.5rem' }
    },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: '0.01em' },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          overflowX: 'hidden',
          width: '100%',
          maxWidth: '100%',
        },
        body: {
          margin: 0,
          padding: 0,
          overflowX: 'hidden',
          width: '100%',
          maxWidth: '100%',
        },
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
          '@media (max-width:600px)': {
            padding: '0 12px',
          },
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
          background: 'linear-gradient(45deg, #3b82f6 30%, #93c5fd 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #2563eb 30%, #60a5fa 90%)',
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



