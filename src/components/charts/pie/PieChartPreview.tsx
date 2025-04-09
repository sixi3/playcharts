'use client'; // Mark as a Client Component

import React, { useRef, useCallback } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import type { Segment, PieChartStyles, ChartOptions } from '@/app/page';
import { toPng, toSvg } from 'html-to-image';
import { Download } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';

interface PieChartPreviewProps {
  segments: Segment[];
  styles: PieChartStyles;
  options: ChartOptions;
}

const PieChartPreview: React.FC<PieChartPreviewProps> = ({ segments, styles, options }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = useCallback(async () => {
    if (!chartContainerRef.current) {
      console.error("Chart container ref not found.");
      alert('Could not capture chart image.');
      return;
    }

    try {
      const dataUrl = await toPng(chartContainerRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'PlayChartsPieChart.png';
      link.href = dataUrl;
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Failed to download PNG image.');
    }
  }, []);

  const handleDownloadSvg = useCallback(async () => {
    if (!chartContainerRef.current) {
      console.error("Chart container ref not found.");
      alert('Could not capture chart image.');
      return;
    }

    try {
      const dataUrl = await toSvg(chartContainerRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = 'PlayChartsPieChart.svg';
      link.href = dataUrl;
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating SVG:', error);
      alert('Failed to download SVG image.');
    }
  }, []);

  // Ensure segments are valid before rendering
  const validSegments = segments.filter(s => s.value > 0);

  // Prevent rendering chart if no valid data
  if (validSegments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Add segments with positive values to see the chart.
      </div>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Title */}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          position: 'absolute',
          top: 16, // Adjust as needed
          left: 16, // Adjust as needed
          color: 'text.primary',
          fontWeight: 600,
        }}
      >
        Live Preview
      </Typography>

      {/* Download Buttons - Updated with file type-specific labels */}
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
          startIcon={<Download sx={{ color: '#4F6370', fontSize: '0.875rem' }} />}
          onClick={handleDownloadPng}
          sx={{
            borderColor: 'divider',
            color: '#4F6370',
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
              borderColor: 'grey.400',
              bgcolor: 'grey.50',
              transform: 'translateY(-1px)',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.02) 0px 2px 4px -1px',
            },
          }}
        >
          .PNG
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Download sx={{ color: '#4F6370', fontSize: '0.875rem' }} />}
          onClick={handleDownloadSvg}
          sx={{
            borderColor: 'divider',
            color: '#4F6370',
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
              borderColor: 'grey.400',
              bgcolor: 'grey.50',
              transform: 'translateY(-1px)',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.02) 0px 2px 4px -1px',
            },
          }}
        >
          .SVG
        </Button>
      </Box>

      {/* Chart container */}
      <Box ref={chartContainerRef} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <PieChart
          series={[
            {
              data: validSegments.map((segment) => ({
                id: segment.id,
                value: segment.value,
                label: segment.label,
                color: segment.color,
              })),
              innerRadius: styles.innerRadius,
              outerRadius: styles.outerRadius,
              paddingAngle: styles.paddingAngle,
              cornerRadius: styles.cornerRadius,
              startAngle: styles.startAngle,
              endAngle: styles.endAngle,
              cx: 250,
              cy: 200,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
            },
          ]}
          width={500}
          height={400}
          slotProps={{
            legend: { hidden: !options.showLegend },
          }}
          sx={{ margin: 0, padding: 0 }}
        />
      </Box>
    </Box>
  );
};

export default PieChartPreview; 