import React from 'react';
import { Box, Typography, IconButton } from '@mui/material'; // Add IconButton
import Image from 'next/image';
import { useThemeMode } from '@/components/ThemeRegistry/ThemeRegistry'; // Import the context hook
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Import icons

const Header = () => {
  const { mode, toggleThemeMode } = useThemeMode(); // Use the hook

  return (
    <Box 
      component="header" 
      sx={{ 
        bgcolor: 'background.paper', // Use theme's paper color (usually white)
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 4px 6px -1px, rgba(0, 0, 0, 0.02) 0px 2px 4px -1px',
        py: 1.5, // Adjust vertical padding
        px: { xs: 2, sm: 3 }, // Responsive horizontal padding
        borderBottom: '1px solid',
        borderColor: 'divider', // Use theme divider color
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 'xl', mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo container with fixed dimensions */}
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 1.5, 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              src="/images/logo.png"
              alt="PlayCharts Logo"
              width={32}
              height={32}
              priority
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Typography variant="h6" component="span" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            PlayCharts
          </Typography>
        </Box>

        {/* Theme Toggle Button */}
        <IconButton onClick={toggleThemeMode} color="inherit">
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header; 