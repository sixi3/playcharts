import React from 'react';
import { Box, Typography, IconButton, AppBar, Toolbar, Select, MenuItem } from '@mui/material'; // Add IconButton and Select
import Image from 'next/image';
import { useThemeMode } from '@/components/ThemeRegistry/ThemeRegistry'; // Import the context hook
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Import icons

interface HeaderProps {
  chartType: 'pie' | 'bar';
  onChartTypeChange: (type: 'pie' | 'bar') => void;
}

const Header = ({ chartType, onChartTypeChange }: HeaderProps) => {
  const { mode, toggleThemeMode } = useThemeMode(); // Use the hook

  return (
    <AppBar position="static" elevation={0} sx={(theme) => ({
      background: theme.palette.mode === 'light' 
        ? 'rgba(255, 255, 255, 0.8)'
        : theme.palette.background.default,
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
      color: theme.palette.mode === 'light' ? theme.palette.primary.main : '#fff',
      borderRadius: 0
    })}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PlayCharts
        </Typography>
        <Box sx={{ minWidth: 120 }}>
          <Select
            value={chartType}
            defaultValue="pie"
            onChange={(e) => onChartTypeChange(e.target.value as 'pie' | 'bar')}
            size="small"
            sx={(theme) => ({
              minWidth: 120,
              mr: 2,
              height: 40,
              '.MuiSelect-select': {
                py: 1,
                px: 1.5,
              },
              bgcolor: theme.palette.mode === 'light' 
                ? 'rgba(255, 255, 255, 0.5)'
                : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.1)'
                  : 'rgba(255, 255, 255, 0.1)',
                borderWidth: '1px',
                transition: 'all 0.2s ease-in-out',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.mode === 'light'
                  ? 'rgba(0, 0, 0, 0.2)'
                  : 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.mode === 'light'
                  ? theme.palette.primary.main
                  : 'rgba(255, 255, 255, 0.3)',
                borderWidth: '1px',
              }
            })}
            MenuProps={{
              PaperProps: {
                sx: (theme) => ({
                  bgcolor: theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(0, 0, 0, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${
                    theme.palette.mode === 'light'
                      ? 'rgba(0, 0, 0, 0.1)'
                      : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  borderRadius: '8px',
                  mt: 1,
                  '& .MuiMenuItem-root': {
                    px: 1.5,
                    py: 1,
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.04)'
                        : 'rgba(255, 255, 255, 0.1)',
                    },
                    '&.Mui-selected': {
                      bgcolor: theme.palette.mode === 'light'
                        ? 'rgba(0, 104, 204, 0.08)'
                        : 'rgba(255, 255, 255, 0.15)',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'light'
                          ? 'rgba(0, 104, 204, 0.12)'
                          : 'rgba(255, 255, 255, 0.2)',
                      }
                    }
                  }
                })
              }
            }}
          >
            <MenuItem value="pie">Pie Chart</MenuItem>
            <MenuItem value="bar">Bar Chart</MenuItem>
          </Select>
        </Box>
        <IconButton onClick={toggleThemeMode} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 