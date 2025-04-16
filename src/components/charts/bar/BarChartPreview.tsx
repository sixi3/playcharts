import React, { useRef, useCallback, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import { BarDataPoint, BarChartStyles } from '@/app/page';
import { toPng, toSvg } from 'html-to-image';
import PreviewHeader from '../common/PreviewHeader';

interface BarChartPreviewProps {
  data: BarDataPoint[];
  styles: BarChartStyles;
}

export default function BarChartPreview({ data, styles }: BarChartPreviewProps) {
  const isVertical = styles.orientation === 'vertical';
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const axisColor = theme.palette.text.secondary;

  // Transform data for Recharts
  const chartData = data.map(bar => ({
    name: bar.label,
    value: bar.value,
    color: bar.color,
    id: bar.id,
  }));

  // Calculate bar size based on barWidth (0.1 to 1.0)
  const barSize = Math.max(5, Math.min(50, styles.barWidth * 50));
  
  const handleDownloadPng = useCallback(async () => {
    if (!chartContainerRef.current) {
      console.error("Chart container ref not found.");
      alert('Could not capture chart image.');
      return;
    }

    try {
      const dataUrl = await toPng(chartContainerRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      const baseName = 'PlayChartsBarChart';
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
      const svgData = await toSvg(chartContainerRef.current, { cacheBust: true });
      const link = document.createElement('a');
      const baseName = 'PlayChartsBarChart';
      link.download = `${baseName}.svg`;
      link.href = svgData;
      link.click();
    } catch (error) {
      console.error('Error generating SVG:', error);
      alert('Failed to download SVG image.');
    }
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      bgcolor: 'background.paper',
      position: 'relative',
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

      {/* Chart Container */}
      <Box 
        ref={chartContainerRef}
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          pt: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
          mt: 2
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          {isVertical ? (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              barGap={styles.barSpacing * 20}
            >
              {styles.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />}
              {styles.showXAxis && <XAxis dataKey="name" stroke={axisColor} />}
              {styles.showYAxis && <YAxis stroke={axisColor} />}
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                  padding: '8px 12px',
                }}
              />
              {styles.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                name={styles.yAxisLabel || 'Value'}
                barSize={barSize}
                radius={[styles.barCornerRadius, styles.barCornerRadius, 0, 0]}
                stroke={styles.barBorder ? styles.barBorderColor : 'none'}
                strokeWidth={styles.barBorderWidth}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
              barGap={styles.barSpacing * 20}
            >
              {styles.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />}
              {styles.showYAxis && <YAxis type="category" dataKey="name" stroke={axisColor} />}
              {styles.showXAxis && <XAxis type="number" stroke={axisColor} />}
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                  padding: '8px 12px',
                }}
              />
              {styles.showLegend && <Legend />}
              <Bar 
                dataKey="value" 
                name={styles.xAxisLabel || 'Value'}
                barSize={barSize}
                radius={[0, styles.barCornerRadius, styles.barCornerRadius, 0]}
                stroke={styles.barBorder ? styles.barBorderColor : 'none'}
                strokeWidth={styles.barBorderWidth}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
} 