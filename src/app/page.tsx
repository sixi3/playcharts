'use client'; // Mark this component as a Client Component

import Header from "@/components/layout/Header";
import PieChartEditor from "@/components/charts/pie/PieChartEditor";
import PieChartPreview from "@/components/charts/pie/PieChartPreview";
import CodePanel from "@/components/shared/CodePanel";
import BarChartEditor from "@/components/charts/bar/BarChartEditor";
import BarChartPreview from "@/components/charts/bar/BarChartPreview";
import React, { useState } from 'react';
import { Box, Paper } from '@mui/material'; // Import Box and Paper for layout/styling

// Define the type for a single segment
export interface Segment {
  id: string; // Unique ID for React keys
  label: string;
  value: number;
  color: string;
}

// Define the type for styling properties
export interface PieChartStyles {
  innerRadius: number;
  outerRadius: number;
  paddingAngle: number;
  cornerRadius: number;
  startAngle: number;
  endAngle: number; // Added endAngle as it's common for pie charts
}

// Define the type for other chart options
export interface ChartOptions {
  showLegend?: boolean;
}

// Bar Chart Types
export interface BarDataPoint {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface BarChartStyles {
  orientation: 'horizontal' | 'vertical';
  barSpacing: number;
  barWidth: number;
  isStacked: boolean;
  showXAxis: boolean;
  showYAxis: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  showGrid: boolean;
  showLegend: boolean;
  barBorder: boolean;
  barBorderColor: string;
  barBorderWidth: number;
  barCornerRadius: number;
}

// Function to generate a simple unique ID
const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export default function Home() {
  // Add chart type state
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // State for the segments
  const [segments, setSegments] = useState<Segment[]>([
    { id: generateId(), label: 'Segment 1', value: 10, color: '#03C171' },
    { id: generateId(), label: 'Segment 2', value: 20, color: '#0068CC' },
    { id: generateId(), label: 'Segment 3', value: 15, color: '#FF0000' },
  ]);

  // State for bar chart data
  const [barData, setBarData] = useState<BarDataPoint[]>([
    { id: generateId(), label: 'Bar 1', value: 10, color: '#03C171' },
    { id: generateId(), label: 'Bar 2', value: 20, color: '#0068CC' },
    { id: generateId(), label: 'Bar 3', value: 15, color: '#FF0000' },
  ]);

  // State for styling properties
  const [styles, setStyles] = useState<PieChartStyles>({
    innerRadius: 30,
    outerRadius: 100,
    paddingAngle: 1,
    cornerRadius: 5,
    startAngle: 0,
    endAngle: 360,
  });

  // State for bar chart styles
  const [barStyles, setBarStyles] = useState<BarChartStyles>({
    orientation: 'vertical',
    barSpacing: 0.2,
    barWidth: 0.8,
    isStacked: false,
    showXAxis: true,
    showYAxis: true,
    xAxisLabel: '',
    yAxisLabel: '',
    showGrid: true,
    showLegend: false,
    barBorder: false,
    barBorderColor: '#000000',
    barBorderWidth: 1,
    barCornerRadius: 0,
  });

  // State for other chart options
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    showLegend: false
  });

  // Function to add a new segment
  const addSegment = () => {
    setSegments([
      ...segments,
      { id: generateId(), label: `Segment ${segments.length + 1}`, value: 10, color: '#CCCCCC' },
    ]);
  };

  // Function to remove a segment by id
  const removeSegment = (id: string) => {
    setSegments(segments.filter(segment => segment.id !== id));
  };

  // Function to update a specific segment
  const updateSegment = (id: string, updatedValues: Partial<Omit<Segment, 'id'>>) => {
    setSegments(segments.map(segment =>
      segment.id === id ? { ...segment, ...updatedValues } : segment
    ));
  };

  // --- Styling Functions ---
  const updateStyle = (updatedValues: Partial<PieChartStyles>) => {
    setStyles(prevStyles => ({ ...prevStyles, ...updatedValues }));
  };

  // Function to update chart options (like the switch)
  const updateChartOption = (updatedValues: Partial<ChartOptions>) => {
    setChartOptions(prevOptions => ({ ...prevOptions, ...updatedValues }));
  };

  // --- Bar Chart Handlers ---
  const addBar = () => {
    setBarData([
      ...barData,
      { id: generateId(), label: `Bar ${barData.length + 1}`, value: 10, color: '#CCCCCC' },
    ]);
  };

  const removeBar = (id: string) => {
    setBarData(barData.filter(bar => bar.id !== id));
  };

  const updateBar = (id: string, updatedValues: Partial<Omit<BarDataPoint, 'id'>>) => {
    setBarData(barData.map(bar =>
      bar.id === id ? { ...bar, ...updatedValues } : bar
    ));
  };

  const updateBarStyle = (updatedValues: Partial<BarChartStyles>) => {
    setBarStyles(prevStyles => ({ ...prevStyles, ...updatedValues }));
  };

  return (
    // Outermost container for full viewport height and padding
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <Header chartType={chartType} onChartTypeChange={setChartType} />
      {/* Main content area - Allow scroll on XS, hide on LG */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Takes remaining vertical space
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: { xs: 2, sm: 3 },
          p: { xs: 2, sm: 3 },
          overflowX: 'hidden', // Prevent horizontal scroll
          overflowY: { xs: 'auto', lg: 'hidden' } // Allow vertical scroll only on small screens
        }}
      >
        {/* Left Column - Adjust height behavior */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
          flexBasis: { xs: 'auto', lg: '30%' }, // Changed from 66% to 30%
          flexGrow: { lg: 1 }, // Only grow on lg
          height: { lg: '100%' }, // Full height only on lg
          // No overflow hidden here
        }}>
          {/* Live Preview Panel */}
          <Paper
            elevation={0}
            sx={{
              p: 0,
              flexGrow: { lg: 1 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 300, sm: 400 },
              width: '100%', // Ensure full width of container
              maxWidth: '100%', // Prevent growing beyond container
              overflow: 'hidden', // Hide overflow
              position: 'relative', // For absolute positioning of scrollable content
              border: '1px solid', // Ensure consistent border
              borderColor: 'divider', // Use theme's divider color
              borderRadius: 2, // Ensure consistent border radius
              '& > *': { // Target direct children (the chart)
                width: '100%',
                maxWidth: '100%',
                overflowX: 'auto', // Enable horizontal scrolling
                padding: 2, // Add some padding around the chart
              }
            }}
          >
            {chartType === 'pie' ? (
              <PieChartPreview
                segments={segments}
                styles={styles}
                options={chartOptions}
              />
            ) : (
              <BarChartPreview
                data={barData}
                styles={barStyles}
              />
            )}
          </Paper>

          {/* Code Panel */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              minHeight: 200,
              maxHeight: { xs: 300, lg: '40%' }, // Allow slightly more height on xs if needed
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0
            }}
          >
            <CodePanel
              chartType={chartType}
              segments={segments}
              pieStyles={styles}
              options={chartOptions}
              barData={barData}
              barStyles={barStyles}
            />
          </Paper>
        </Box>

        {/* Right Column (Editor Panel) - Adjust height behavior */}
        <Box sx={{
          flexBasis: { xs: 'auto', lg: '80%' }, // Changed from 70% to 80%
          flexGrow: { lg: 1 }, // Only grow on lg
          height: { lg: '100%' }, // Full height only on lg
          minWidth: 0, // Prevent content from forcing width expansion
          // No overflow hidden here
        }}>
          {/* Editor Panel Paper - Height auto on xs, scroll internal on lg */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: { lg: '100%' }, // Full height only on lg
              overflow: { lg: 'auto' } // Internal scroll only on lg
              // On xs, the main container scrolls, so internal scroll is less critical
            }}
          >
            {chartType === 'pie' ? (
              <PieChartEditor
                segments={segments}
                styles={styles}
                options={chartOptions}
                onAddSegment={addSegment}
                onRemoveSegment={removeSegment}
                onUpdateSegment={updateSegment}
                onUpdateStyle={updateStyle}
                onUpdateOption={updateChartOption}
              />
            ) : (
              <BarChartEditor
                data={barData}
                styles={barStyles}
                onAddBar={addBar}
                onRemoveBar={removeBar}
                onUpdateBar={updateBar}
                onUpdateStyle={updateBarStyle}
              />
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
