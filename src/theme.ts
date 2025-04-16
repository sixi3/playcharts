import { PaletteMode } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';

// TODO: Import actual fonts (e.g., from Google Fonts or self-hosted)
// See: https://mui.com/material-ui/customization/typography/#adding-amp-using-fonts

// Common settings
const commonSettings = {
  shape: {
    borderRadius: 12,
  },
  typography: {
    // Use -apple-system to target SF Pro on Apple platforms, with fallbacks
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h6: {
      fontWeight: 600,
    },
  },
};

// Function to create the theme based on mode
export const getAppTheme = (mode: PaletteMode) => createTheme({
  ...commonSettings,
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: { main: '#0068CC' },
          secondary: { main: '#2EC183' },
          success: { main: '#2EC183' },
          background: { default: '#F0F4F6', paper: '#FFFFFF' },
          text: { primary: '#2A3135', secondary: '#545D6B' },
          divider: '#DAE6E8',
          // Add specific light mode overrides if needed
          action: {
            hover: 'rgba(0, 0, 0, 0.04)', // Default light hover
          },
        }
      : {
          // Dark mode palette (adjust colors as needed)
          primary: { main: '#66B2FF' }, // Lighter blue
          secondary: { main: '#4AED9E' }, // Lighter green
          success: { main: '#4AED9E' },
          background: { default: '#121212', paper: '#1E1E1E' }, // Dark backgrounds
          text: { primary: '#E0E0E0', secondary: '#A0A0A0' }, // Lighter text
          divider: '#424242', // Darker divider
          action: {
            hover: 'rgba(255, 255, 255, 0.08)', // Default dark hover
          },
        }),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: (themeParam: Theme) => ({
          backgroundColor: themeParam.palette.background.default,
          color: themeParam.palette.text.primary,
          transition: themeParam.transitions.create(['background-color', 'color'], {
            duration: themeParam.transitions.duration.short,
          }),
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({
          theme
        }) => ({
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: commonSettings.shape.borderRadius,
          boxShadow: theme.palette.mode === 'light' 
            ? 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
            : 'rgba(0, 0, 0, 0.3) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -2px',
          backgroundColor: theme.palette.background.paper,
          transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow'], {
            duration: theme.transitions.duration.short,
          }),
          '&.MuiPaper-elevation0': {
            boxShadow: 'none',
          },
        })
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: ({
          theme
        }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: commonSettings.shape.borderRadius,
            backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : theme.palette.background.paper,
            transition: theme.transitions.create(['background-color', 'border-color'], {
              duration: theme.transitions.duration.short,
            }),
            backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none', // Keep glassmorphic conditional
            '& fieldset': { borderColor: theme.palette.divider },
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.primary.main // Apply border color on hover consistently
            },
            '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main, borderWidth: '1px' },
          },
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
            transition: theme.transitions.create(['color'], {
              duration: theme.transitions.duration.short,
            }),
          },
        })
      }
    },
    MuiButton: {
      styleOverrides: {
        root: ({
          theme
        }) => ({
          textTransform: 'none',
          borderRadius: commonSettings.shape.borderRadius,
          padding: '14px 16px',
          transition: 'all 0.3s ease-in-out',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: theme.palette.mode === 'light' 
              ? 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
              : 'rgba(0, 0, 0, 0.3) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -2px',
            transform: 'translateY(-1px)',
          }
        })
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: ({
          theme
        }) => ({
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16,
            backgroundColor: theme.palette.background.paper, // Thumb background matches paper
            border: `1px solid ${theme.palette.divider}`,
          },
          '& .MuiSlider-track': {
            height: 6,
            borderRadius: 3,
          },
          '& .MuiSlider-rail': {
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.divider, // Use divider color for rail
            opacity: 0.5,
          }
        })
      }
    },
    // Add other component overrides if needed
  },
}); 