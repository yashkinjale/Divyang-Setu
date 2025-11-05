// src/highContrastTheme.js
import { createTheme } from '@mui/material/styles';

const highContrastTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffff00', contrastText: '#000000' },
    secondary: { main: '#ffeb3b', contrastText: '#000000' },
    background: { default: '#000000', paper: '#000000' },
    text: { primary: '#ffff00', secondary: '#e0e0e0' },
  },

  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", sans-serif',
    allVariants: { color: '#ffff00' },
    button: { textTransform: 'none', fontWeight: 600, color: '#ffffff' },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#ffff00',
          boxSizing: 'border-box',
        },
      },
    },

    // Apply Now button
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '0.95rem',
          backgroundColor: '#000000 !important',
          color: '#ffffff !important',
          border: '1px solid #ffff00',
          boxSizing: 'border-box',
          '&:hover': {
            backgroundColor: '#111111 !important',
            border: '1px solid #ffeb3b',
            color: '#ffffff !important',
          },
        },
      },
    },

    // Paper & Card styling
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000 !important',
          color: '#ffff00 !important',
          boxShadow: '0 0 10px rgba(255,255,0,0.3)',
          border: '1px solid #ffff00',
          boxSizing: 'border-box',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000 !important',
          color: '#ffff00 !important',
          border: '1px solid #ffff00',
          boxSizing: 'border-box',
        },
      },
    },

    // Inputs & Selects (Government Schemes) - Fix vertical lines
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000 !important',
          color: '#ffff00',
          borderRadius: '8px',
          border: '1px solid #ffff00',
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',

          // Remove MUI notched outline completely
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none !important',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none !important',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: 'none !important',
          },
        },
        input: { color: '#ffff00' },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000 !important',
          color: '#ffff00',
          border: '1px solid #ffff00',
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',

          // Remove internal notched outline if rendered
          '& .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
          '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
        },
        icon: { color: '#ffff00' },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000 !important',
          color: '#ffff00',
          border: '1px solid #ffff00',
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
        },
        input: {
          color: '#ffff00',
          '&::placeholder': { color: '#ffeb3b', opacity: 0.8 },
        },
      },
    },

    // Icons
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '8px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffff00',
          '& svg': {
            fontSize: '1.25rem !important',
            width: '1.25rem !important',
            height: '1.25rem !important',
          },
          '&:hover': { backgroundColor: '#222222' },
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem !important',
          width: '1.25rem !important',
          height: '1.25rem !important',
          color: '#ffff00 !important',
          flexShrink: 0,
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          '& svg': {
            color: '#ffff00 !important',
            fontSize: '1.25rem !important',
            width: '1.25rem !important',
            height: '1.25rem !important',
            display: 'block',
          },
        },
      },
    },

    MuiListItemText: {
      styleOverrides: { primary: { color: '#ffff00', fontWeight: 500 } },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: '#333333',
          '&::after': { background: 'linear-gradient(90deg, transparent, #555555, transparent)' },
        },
      },
    },
  },
});

export default highContrastTheme;




