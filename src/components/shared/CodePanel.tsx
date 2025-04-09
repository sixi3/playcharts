'use client'; // Mark as a Client Component

import React, { useState, useEffect } from 'react';
import type { Segment, PieChartStyles, ChartOptions } from '@/app/page';
import { generatePieChartCode } from '@/utils/pie/generatePieChartCode';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import copy from 'copy-to-clipboard';
import { Button, Box } from '@mui/material';
import { ContentCopy, Download } from '@mui/icons-material';

interface CodePanelProps {
  segments: Segment[];
  styles: PieChartStyles;
  options: ChartOptions;
}

const CodePanel: React.FC<CodePanelProps> = ({ segments, styles, options }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Code');
  const [codeString, setCodeString] = useState(''); // Initialize empty to avoid hydration mismatch

  // Generate code string on the client side only, passing options
  useEffect(() => {
    setCodeString(generatePieChartCode(segments, styles, options));
  }, [segments, styles, options]); // Add options to dependency array

  // Handle copying the code to the clipboard
  const handleCopy = () => {
    if (copy(codeString)) {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy Code'), 2000); // Reset after 2 seconds
    } else {
      alert('Failed to copy code.'); // Basic error feedback
    }
  };

  // Handle downloading the code as a .tsx file
  const handleDownload = () => {
    try {
      const blob = new Blob([codeString], { type: 'text/typescript;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'PlayChartsPieChart.tsx'; // Default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up blob URL
    } catch (error) {
      console.error("Download failed:", error);
      alert('Failed to download code.'); // Basic error feedback
    }
  };

  return (
    // Use Box as the root flex container
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Box to wrap the SyntaxHighlighter and make it scrollable */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        borderRadius: '12px', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        background: '#1E1F2D', 
        mb: 2 
      }}>
        <SyntaxHighlighter
          language="tsx"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '24px',
            paddingLeft: '12px', // 24px + 12px left margin
            paddingTop: '12px', // 24px + 12px top margin
            fontSize: '0.9rem',
            fontFamily: 'var(--font-geist-mono), monospace',
            minHeight: '100%',
          }}
          PreTag={({ children, ...props }) => (
            <pre
              {...props}
              style={{
                ...props.style,
                margin: 0,
                padding: 0,
                background: 'none',
                boxShadow: 'none',
                border: 'none',
                height: '100%',
              }}
            >
              {children}
            </pre>
          )}
        >
          {codeString}
        </SyntaxHighlighter>
      </Box>

      {/* Box for buttons - fixed at the bottom */}
      <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
        <Button
          variant="outlined"
          startIcon={<ContentCopy sx={{ color: '#4F6370' }} />}
          onClick={handleCopy}
          disabled={copyButtonText === 'Copied!'}
          fullWidth
          sx={{
            py: '14px',
            borderColor: 'divider',
            color: '#4F6370',
            bgcolor: 'background.paper',
            borderRadius: '12px',
            transition: 'all 0.3s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              borderColor: 'grey.400',
              bgcolor: 'grey.50',
              transform: 'translateY(-1px)',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
            }
          }}
        >
          {copyButtonText}
        </Button>
        <Button
          variant="contained"
          startIcon={<Download sx={{ color: '#FFFFFF' }} />}
          onClick={handleDownload}
          disableElevation
          fullWidth
          sx={{
            py: '15px',
            bgcolor: '#2EC183',
            color: '#FFFFFF',
            borderRadius: '12px',
            transition: 'all 0.3s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#25a870',
              transform: 'translateY(-1px)',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
            }
          }}
        >
          Download Code
        </Button>
      </Box>
    </Box>
  );
};

export default CodePanel; 