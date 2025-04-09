'use client'; // Mark this component as a Client Component

import Header from "@/components/layout/Header";
import PieChartEditor from "@/components/charts/pie/PieChartEditor";
import PieChartPreview from "@/components/charts/pie/PieChartPreview";
import CodePanel from "@/components/shared/CodePanel";
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

// Function to generate a simple unique ID
const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export default function Home() {
  // State for the segments
  const [segments, setSegments] = useState<Segment[]>([
    { id: generateId(), label: 'Segment 1', value: 10, color: '#03C171' },
    { id: generateId(), label: 'Segment 2', value: 20, color: '#0068CC' },
    { id: generateId(), label: 'Segment 3', value: 15, color: '#FF0000' }, // Mismatched color from image, corrected
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

  return (
    // Outermost container for full viewport height and padding
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <Header />
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
          // Remove fixed height calculation, rely on flexGrow
        }}
      >
        {/* Left Column - Adjust height behavior */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
          flexBasis: { xs: 'auto', lg: '66%' }, // Basis auto on xs
          flexGrow: { lg: 1 }, // Only grow on lg
          height: { lg: '100%' }, // Full height only on lg
          // No overflow hidden here
        }}>
          {/* Live Preview Panel */}
          <Paper
            elevation={2}
            sx={{
              p: 0,
              flexGrow: { lg: 1 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 300, sm: 400 },
              overflow: 'hidden'
            }}
          >
            <PieChartPreview
              segments={segments}
              styles={styles}
              options={chartOptions}
            />
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
              segments={segments}
              styles={styles}
              options={chartOptions}
            />
          </Paper>
        </Box>

        {/* Right Column (Editor Panel) - Adjust height behavior */}
        <Box sx={{
          flexBasis: { xs: 'auto', lg: '34%' }, // Basis auto on xs
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
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
