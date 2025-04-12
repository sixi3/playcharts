'use client'; // Mark as a Client Component

import React, { useRef, useCallback, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import type { Segment, PieChartStyles, ChartOptions } from '@/app/page';
import { toPng, toSvg } from 'html-to-image';
import { Download, ContentCopy, LightbulbOutlined } from '@mui/icons-material';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PieChartPreviewProps {
  segments: Segment[];
  styles: PieChartStyles;
  options: ChartOptions;
}

const PieChartPreview: React.FC<PieChartPreviewProps> = ({ segments, styles, options }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [lockedHighlightId, setLockedHighlightId] = useState<string | null>(null);
  const [downloadButtonSuffix, setDownloadButtonSuffix] = useState<string>('');
  const [lastClickInfo, setLastClickInfo] = useState<{ id: string | null; time: number }>({ id: null, time: 0 });
  const [tooltipInfo, setTooltipInfo] = useState<{ content: string; x: number; y: number } | null>(null);
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
      const suffix = lockedHighlightId ? `_hover_${lockedHighlightId}` : '';
      link.download = `${baseName}${suffix}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert('Failed to download PNG image.');
    }
  }, [lockedHighlightId]);

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
      const viewBoxParts = viewBox.split(' ').map(Number);
      const viewBoxWidth = viewBoxParts[2] || svgWidth;
      const viewBoxHeight = viewBoxParts[3] || svgHeight;

      let finalSvgString = '';
      const svgStart = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">`;
      const svgEnd = `</svg>`;
      let defs = '';
      let tooltipSvg = '';

      // 2. Check if tooltip needs to be added
      if (tooltipInfo && lockedHighlightId) {
        const segment = validSegments.find(s => s.id === lockedHighlightId);
        const segmentColor = segment?.color || theme.palette.grey[400];

        // 3. Estimate SVG coordinates (simple scaling - might need refinement)
        // Convert pixel coords relative to container top-left to SVG viewBox coords
        const svgX = (tooltipInfo.x / chartContainerRef.current.clientWidth) * viewBoxWidth + viewBoxParts[0];
        const svgY = (tooltipInfo.y / chartContainerRef.current.clientHeight) * viewBoxHeight + viewBoxParts[1];

        // 4. Generate SVG elements for the tooltip
        const textContent = tooltipInfo.content;
        const fontSize = 10; // Approx 0.75rem
        const estimatedTextWidth = textContent.length * (fontSize * 0.6); // Rough estimation
        const paddingX = 6;
        const paddingY = 2;
        const dotRadius = 3;
        const dotMargin = 4;
        const rectHeight = 20;
        const rectWidth = estimatedTextWidth + (paddingX * 2) + (dotRadius * 2) + dotMargin;
        const rectX = paddingX; // Relative to group transform
        const rectY = -rectHeight / 2; // Center vertically
        const arrowWidth = 4;

        defs = `
          <defs>
            <filter id="tooltip-shadow" x="-20%" y="-40%" width="140%" height="180%">
              <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.1"/>
            </filter>
          </defs>`;

        tooltipSvg = `
          <g transform="translate(${svgX + 8}, ${svgY})" style="pointer-events: none;">
            <path d="M-${arrowWidth},0 L0,-${arrowWidth} L0,${arrowWidth} Z" fill="white" filter="url(#tooltip-shadow)" transform="translate(-${rectX}, 0)"/>
            <rect x="${rectX - arrowWidth}" y="${rectY}" width="${rectWidth}" height="${rectHeight}" rx="4" ry="4" fill="white" filter="url(#tooltip-shadow)"/>
            <circle cx="${rectX + dotRadius}" cy="0" r="${dotRadius}" fill="${segmentColor}"/>
            <text x="${rectX + (dotRadius * 2) + dotMargin}" y="0" dy=".3em" fill="black" font-family="system-ui, sans-serif" font-size="${fontSize}px" font-weight="500">
              ${textContent}
            </text>
          </g>`;
      }

      // 5. Combine SVG strings
      finalSvgString = `${svgStart}${defs}${chartContent}${tooltipSvg}${svgEnd}`;

      // Create data URL and link
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(finalSvgString)}`;
      const link = document.createElement('a');
      const baseName = 'PlayChartsPieChart';
      const suffix = lockedHighlightId ? `_hover_${lockedHighlightId}` : '';
      link.download = `${baseName}${suffix}.svg`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error('Error generating SVG:', error);
      alert('Failed to download SVG image.');
    }
  }, [lockedHighlightId, tooltipInfo, theme, validSegments]);

  const handleSegmentDoubleClick = (
    event: React.MouseEvent,
    itemIdentifier: any,
    itemData: { id: string | number }
  ) => {
    const currentTime = Date.now();
    const clickedId = itemData.id as string;

    if (
      clickedId === lastClickInfo.id &&
      currentTime - lastClickInfo.time < 300
    ) {
      if (clickedId === lockedHighlightId) {
        setLockedHighlightId(null);
        setDownloadButtonSuffix('');
        setTooltipInfo(null);
      } else {
        setLockedHighlightId(clickedId);
        setDownloadButtonSuffix(' (Hover)');
        const segment = validSegments.find(s => s.id === clickedId);
        if (segment && chartContainerRef.current) {
          const rect = chartContainerRef.current.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          setTooltipInfo({ content: `${segment.label}: ${segment.value}`, x, y });
        }
      }
      setLastClickInfo({ id: null, time: 0 });
      if (clickedId === lockedHighlightId) {
        setTooltipInfo(null);
      }
    } else {
      setLastClickInfo({ id: clickedId, time: currentTime });
      if (!lockedHighlightId) {
        setTooltipInfo(null);
      }
    }
  };

  // Prevent rendering chart if no valid data
  if (validSegments.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Add segments with positive values to see the chart.
      </div>
    );
  }

  // Reverted to using highlightedDataIndex based on lockedHighlightId only
  const highlightedDataIndex = lockedHighlightId !== null
    ? validSegments.findIndex(segment => segment.id === lockedHighlightId)
    : -1;

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
      {/* Title */}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          position: 'absolute',
          top: 16, // Adjust as needed
          left: 16, // Adjust as needed
          color: 'text.primary',
          fontWeight: 500,
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
          startIcon={<Download sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : '#4F6370', fontSize: '0.875rem' }} />}
          onClick={handleDownloadPng}
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
          onClick={handleDownloadSvg}
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
            tooltip: {
              trigger: lockedHighlightId !== null ? 'none' : 'item',
            }
          }}
          sx={{ margin: 0, padding: 0 }}
          onItemClick={handleSegmentDoubleClick}
          highlightedItem={
            highlightedDataIndex !== -1
              ? { seriesId: 'pieSeries', dataIndex: highlightedDataIndex }
              : null
          }
        />
        {tooltipInfo && (
          <Box
            sx={{
              position: 'absolute',
              top: tooltipInfo.y,
              left: tooltipInfo.x,
              transform: 'translate(8px, -50%)',
              bgcolor: 'common.white',
              color: 'common.black',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              zIndex: 1300,
              pointerEvents: 'none',
              boxShadow: '0px 1px 2px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '20px',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -4,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                borderRight: '4px solid white',
              },
            }}
          >
            <Box 
              component="span" 
              sx={{ 
                display: 'inline-block', 
                width: '6px',
                height: '6px', 
                borderRadius: '50%', 
                bgcolor: (theme) => validSegments.find(s => s.id === lockedHighlightId)?.color || theme.palette.grey[400],
                mr: 0.5
              }} 
            />
            {tooltipInfo.content}
          </Box>
        )}
        
        {/* Disclaimer text */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            fontSize: '0.75rem',
            fontWeight: 400,
            bgcolor: 'background.paper',
            padding: '4px 8px',
            borderRadius: '6px',
            boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
          }}
        >
          <Typography variant="caption" sx={{ fontSize: 'inherit' }}>
            {lockedHighlightId ? 'Double click to cancel' : 'Double click on a segment to lock its hover state'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PieChartPreview; 