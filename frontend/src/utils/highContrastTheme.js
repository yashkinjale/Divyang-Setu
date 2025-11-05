// src/highContrastTheme.js
import { createTheme } from '@mui/material/styles';

const buttonSize = '40px';
const iconSize = '24px';

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
    button: { textTransform: 'none', fontWeight: 600, lineHeight: 1 },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#ffff00',
          boxSizing: 'border-box',
          outline: 'none', // prevent high contrast outlines
        },
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
          backgroundColor: '#000000 !important',
          color: '#ffff00 !important',
          border: 'none',
          '&:hover': { backgroundColor: '#111111 !important', border: 'none', color: '#ffff00 !important' },
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
          backgroundColor: '#000000 !important',
          color: '#ffff00 !important',
          boxShadow: 'none',
          border: 'none',
          borderRadius: 12,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000 !important',
          color: '#ffff00 !important',
          boxShadow: 'none',
          border: 'none',
          borderRadius: 12,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000 !important',
          color: '#ffff00',
          borderRadius: 12,
          lineHeight: 1,
          border: 'none',
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
        },
        input: { color: '#ffff00', lineHeight: 1 },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: { lineHeight: 1, color: '#ffff00', backgroundColor: '#000000 !important', border: 'none' },
      },
    },
  },

  shadows: Array(25).fill('none'),
});

export default highContrastTheme;








