import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Download } from '@mui/icons-material';

interface PreviewHeaderProps {
  title?: string;
  onDownloadPng: () => void;
  onDownloadSvg: () => void;
  downloadButtonSuffix?: string;
}

const PreviewHeader: React.FC<PreviewHeaderProps> = ({ 
  title = 'Live Preview', 
  onDownloadPng, 
  onDownloadSvg,
  downloadButtonSuffix = ''
}) => {
  return (
    <>
      {/* Title */}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: 'text.primary',
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>

      {/* Download Buttons */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          gap: 1
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<Download sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : '#4F6370', fontSize: '0.875rem' }} />}
          onClick={onDownloadPng}
          sx={(theme) => ({
            borderColor: 'divider',
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#4F6370',
            bgcolor: 'background.paper',
            borderRadius: '6px',
            textTransform: 'none',
            py: 0.5,
            px: 1.5,
            minWidth: 'auto',
            fontWeight: 500,
            fontSize: '0.75rem',
            transition: 'all 0.3s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'grey.400',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'grey.50',
              transform: 'translateY(-1px)',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.02) 0px 2px 4px -1px',
            },
          })}
        >
          .PNG{downloadButtonSuffix}
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Download sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : '#4F6370', fontSize: '0.875rem' }} />}
          onClick={onDownloadSvg}
          sx={(theme) => ({
            borderColor: 'divider',
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#4F6370',
            bgcolor: 'background.paper',
            borderRadius: '6px',
            textTransform: 'none',
            py: 0.5,
            px: 1.5,
            minWidth: 'auto',
            fontWeight: 500,
            fontSize: '0.75rem',
            transition: 'all 0.3s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'grey.400',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'grey.50',
              transform: 'translateY(-1px)',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.02) 0px 2px 4px -1px',
            },
          })}
        >
          .SVG{downloadButtonSuffix}
        </Button>
      </Box>
    </>
  );
};

export default PreviewHeader; 