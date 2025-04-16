'use client'; // Mark as a Client Component

import React, { useState, useEffect, useRef } from 'react';
import type {
  Segment,
  PieChartStyles,
  ChartOptions,
  BarDataPoint,
  BarChartStyles,
} from '@/app/page'; // Import all necessary types
import { generatePieChartCode } from '@/utils/pie/generatePieChartCode';
import { generateBarChartCode } from '@/utils/bar/generateBarChartCode'; // Import bar code generator
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import copy from 'copy-to-clipboard';
import { Button, Box } from '@mui/material';
import { ContentCopy, Download } from '@mui/icons-material';

interface CodePanelProps {
  chartType: 'pie' | 'bar'; // Add chartType prop
  // Pie Chart Props
  segments: Segment[];
  pieStyles: PieChartStyles; // Renamed from styles
  options: ChartOptions;
  // Bar Chart Props
  barData: BarDataPoint[];
  barStyles: BarChartStyles;
}

const CodePanel: React.FC<CodePanelProps> = ({
  chartType,
  segments,
  pieStyles,
  options,
  barData,
  barStyles,
}) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy Code');
  const [codeString, setCodeString] = useState('');
  const [previousCodeString, setPreviousCodeString] = useState('');
  const [downloadFilename, setDownloadFilename] = useState('');
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null); // State for highlighted line (0-indexed)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Find the first line that differs between two strings
  const findFirstDifferenceLine = (oldStr: string, newStr: string): number => {
    const oldLines = oldStr.split('\n');
    const newLines = newStr.split('\n');
    
    for (let i = 0; i < newLines.length; i++) {
      if (i >= oldLines.length || oldLines[i] !== newLines[i]) {
        return i; // Return 0-indexed line number
      }
    }
    
    return -1; // No difference found
  };

  // Scroll to a specific line in the code
  const scrollToLine = (lineNumber: number) => {
    if (!scrollContainerRef.current || lineNumber < 0) return;
    
    const container = scrollContainerRef.current;
    const lineElements = Array.from(container.querySelectorAll('pre > code > span'));

    if (lineNumber >= 0 && lineNumber < lineElements.length) {
      const lineElement = lineElements[lineNumber] as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const lineRect = lineElement.getBoundingClientRect();
      
      const isVisible = (
        lineRect.top >= containerRect.top &&
        lineRect.bottom <= containerRect.bottom &&
        lineRect.left >= containerRect.left &&
        lineRect.right <= containerRect.right
      );
      
      if (!isVisible) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Generate code string based on chartType
  useEffect(() => {
    let generatedCode = '';
    let filename = '';

    if (chartType === 'pie') {
      generatedCode = generatePieChartCode(segments, pieStyles, options);
      filename = 'PlayChartsPieChart.tsx';
    } else if (chartType === 'bar') {
      generatedCode = generateBarChartCode(barData, barStyles);
      filename = 'PlayChartsBarChart.tsx';
    }

    if (generatedCode !== codeString) {
        setPreviousCodeString(codeString);
    }
    setCodeString(generatedCode);
    setDownloadFilename(filename);

  }, [chartType, segments, pieStyles, options, barData, barStyles, codeString]);

  // Handle scrolling and highlighting when code updates
  useEffect(() => {
    if (codeString && previousCodeString && codeString !== previousCodeString) {
      const changedLineNumber = findFirstDifferenceLine(previousCodeString, codeString);
      
      if (changedLineNumber !== -1) {
        setHighlightedLine(changedLineNumber); // Set the line to highlight (0-indexed)

        const scrollTimer = setTimeout(() => {
          scrollToLine(changedLineNumber);
        }, 50); // Short delay for scroll after state update

        const highlightTimer = setTimeout(() => {
          setHighlightedLine(null); // Clear highlight after 1.5 seconds
        }, 1500);
        
        // Cleanup timers
        return () => {
          clearTimeout(scrollTimer);
          clearTimeout(highlightTimer);
        };
      }
    }
  }, [codeString, previousCodeString]);

  // Function to pass to lineProps for highlighting
  const getLineProps = (lineNumber: number): React.HTMLAttributes<HTMLElement> => {
    // lineNumber from props is 1-based, highlightedLine state is 0-based
    if (lineNumber - 1 === highlightedLine) {
      return {
        style: {
          backgroundColor: 'rgba(255, 255, 100, 0.3)', // Yellowish highlight
          display: 'block', // Ensure background covers the whole line
          transition: 'background-color 0.3s ease-in-out',
        },
      };
    }
    // Apply transition even when not highlighted for smooth fade-out
    return { 
      style: { 
        display: 'block', 
        transition: 'background-color 0.5s ease-in-out' 
      } 
    };
  };

  // Handle copying the code
  const handleCopy = () => {
    if (copy(codeString)) {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy Code'), 2000);
    } else {
      alert('Failed to copy code.');
    }
  };

  // Handle downloading the code
  const handleDownload = () => {
    if (!codeString || !downloadFilename) return; // Don't download if empty
    try {
      const blob = new Blob([codeString], { type: 'text/typescript;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = downloadFilename; // Use dynamic filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download code.');
    }
  };

  return (
    // Use Box as the root flex container
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Box to wrap the SyntaxHighlighter and make it scrollable */}
      <Box 
        ref={scrollContainerRef}
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          borderRadius: '12px', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          background: '#1E1F2D', 
          mb: 2 
        }}
      >
        <SyntaxHighlighter
          language="tsx"
          style={vscDarkPlus}
          showLineNumbers={true} 
          wrapLines={true}
          lineProps={getLineProps} // Pass the function here
          lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#888' }}
          customStyle={{
            margin: 0,
            padding: '24px',
            paddingLeft: '12px',
            paddingTop: '12px',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-geist-mono), monospace',
            minHeight: '100%',
            overflow: 'visible' 
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
                overflow: 'visible' 
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
          startIcon={<ContentCopy sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : '#4F6370' }} />}
          onClick={handleCopy}
          disabled={copyButtonText === 'Copied!'}
          fullWidth
          sx={(theme) => ({
            py: '14px',
            borderColor: 'divider',
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#4F6370',
            bgcolor: 'background.paper',
            borderRadius: '12px',
            transition: 'all 0.3s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'grey.400',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'grey.50',
              transform: 'translateY(-1px)',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
            }
          })}
        >
          {copyButtonText}
        </Button>
        <Button
          variant="contained"
          startIcon={<Download sx={{ color: '#FFFFFF' }} />}
          onClick={handleDownload}
          disableElevation
          fullWidth
          sx={(theme) => ({
            py: '15px',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#2CA0BA',
            color: '#FFFFFF',
            borderRadius: '12px',
            transition: 'all 0.3s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#25a870',
              transform: 'translateY(-1px)',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px'
            }
          })}
        >
          Download Code
        </Button>
      </Box>
    </Box>
  );
};

export default CodePanel; 