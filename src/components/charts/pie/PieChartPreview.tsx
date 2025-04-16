'use client'; // Mark as a Client Component

import React, { useRef, useCallback } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import type { Segment, PieChartStyles, ChartOptions } from '@/app/page';
import { toPng } from 'html-to-image';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PreviewHeader from '../common/PreviewHeader';

interface PieChartPreviewProps {
  segments: Segment[];
  styles: PieChartStyles;
  options: ChartOptions;
}

const PieChartPreview: React.FC<PieChartPreviewProps> = ({ segments, styles, options }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // Ensure segments are valid before rendering
  const validSegments = segments.filter(s => s.value > 0);

  const handleDownloadPng = useCallback(async () => {
    if (!chartContainerRef.current) {
      console.error("Chart container ref not found.");
      alert('Could not capture chart image.');
      return;
    }

    try {
      const dataUrl = await toPng(chartContainerRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      const baseName = 'PlayChartsPieChart';
      link.download = `${baseName}.png`;
      link.href = dataUrl;
      link.click();
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
      // 1. Get the base chart SVG element
      const svgElement = chartContainerRef.current.querySelector('svg');
      if (!svgElement) {
        console.error("Could not find SVG element within the chart container.");
        alert('Failed to find SVG data for download.');
        return;
      }

      // Get viewBox and clone the SVG content
      const viewBox = svgElement.getAttribute('viewBox') || '0 0 500 400'; // Default if not found
      const chartContent = svgElement.innerHTML;
      const svgWidth = svgElement.clientWidth || 500; // Use clientWidth or fallback
      const svgHeight = svgElement.clientHeight || 400;
      
      let finalSvgString = '';
      const svgStart = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">`;
      const svgEnd = `</svg>`;
      
      // 5. Combine SVG strings
      finalSvgString = `${svgStart}${chartContent}${svgEnd}`;

      // Create data URL and link
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(finalSvgString)}`;
      const link = document.createElement('a');
      const baseName = 'PlayChartsPieChart';
      link.download = `${baseName}.svg`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error('Error generating SVG:', error);
      alert('Failed to download SVG image.');
    }
  }, []);

  // Prevent rendering chart if no valid data
  if (validSegments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Add segments with positive values to see the chart.
      </div>
    );
  }

  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.paper',
      backgroundImage: (theme) => 
        theme.palette.mode === 'light' 
          ? 'radial-gradient(rgba(120, 119, 119, 0.1) 1px, transparent 1px)'
          : 'radial-gradient(rgba(210, 230, 255, 0.3) 1px, transparent 1px)',
      backgroundSize: '15px 15px',
    }}>
      <PreviewHeader 
        onDownloadPng={handleDownloadPng}
        onDownloadSvg={handleDownloadSvg}
      />

      {/* Chart container */}
      <Box ref={chartContainerRef} sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <PieChart
          series={[
            {
              id: 'pieSeries',
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
              faded: {
                 additionalRadius: -10,
                 color: 'gray'
              },
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