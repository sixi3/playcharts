'use client'; // Mark as a Client Component

import React from 'react';
import type { Segment, PieChartStyles, ChartOptions } from '@/app/page';
import {
  Box,
  TextField,
  Slider,
  Button,
  IconButton,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface PieChartEditorProps {
  segments: Segment[];
  styles: PieChartStyles;
  options: ChartOptions;
  onAddSegment: () => void;
  onRemoveSegment: (id: string) => void;
  onUpdateSegment: (id: string, updatedValues: Partial<Omit<Segment, 'id'>>) => void;
  onUpdateStyle: (updatedValues: Partial<PieChartStyles>) => void;
  onUpdateOption: (updatedValues: Partial<ChartOptions>) => void;
}

const PieChartEditor: React.FC<PieChartEditorProps> = ({
  segments,
  styles,
  options,
  onAddSegment,
  onRemoveSegment,
  onUpdateSegment,
  onUpdateStyle,
  onUpdateOption,
}) => {
  const handleInputChange = (
    id: string,
    field: keyof Omit<Segment, 'id'>,
    value: string | number
  ) => {
    if (field === 'value') {
      const numValue = Number(value);
      if (value !== '' && (isNaN(numValue) || numValue < 0)) return;
      onUpdateSegment(id, { [field]: value === '' ? 0 : numValue });
    } else {
      onUpdateSegment(id, { [field]: value });
    }
  };

  const handleStyleChange = (
    field: keyof PieChartStyles,
    value: number | number[]
  ) => {
    if (typeof value === 'number' && !isNaN(value)) {
      onUpdateStyle({ [field]: value });
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateOption({ [event.target.name]: event.target.checked });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Segments Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography 
            variant="h6" 
            component="h3"
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}
          >
            Data
          </Typography>
          {/* Options Container */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={options.showLegend ?? false}
                  onChange={handleOptionChange}
                  name="showLegend"
                  size="small"
                  sx={(theme) => ({
                    padding: 0,
                    width: 40,
                    height: 24,
                    '& .MuiSwitch-switchBase': {
                      padding: '3px',
                      '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                          backgroundColor: 'secondary.main',
                          opacity: 1,
                          border: 0,
                        },
                        '&.Mui-disabled + .MuiSwitch-track': {
                          opacity: 0.5,
                        },
                      },
                      '&.Mui-focusVisible .MuiSwitch-thumb': {
                        color: 'secondary.main',
                        boxShadow: '0 4px 4px 0 rgba(0,0,0,.25)',
                      },
                      '&.Mui-disabled .MuiSwitch-thumb': {
                        color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600],
                      },
                      '&.Mui-disabled + .MuiSwitch-track': {
                        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      boxSizing: 'border-box',
                      width: 18,
                      height: 18,
                      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
                      ...(theme.palette.mode === 'dark' && {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                      }),
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 24 / 2,
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#CFD6DA'}`,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#EAEEF0',
                      opacity: 1,
                      transition: theme.transitions.create(['background-color', 'border'], {
                        duration: 500,
                      }),
                      ...(theme.palette.mode === 'dark' && {
                        backdropFilter: 'blur(8px)',
                      }),
                    },
                  })}
                />
              }
              label="Legend"
              labelPlacement="start"
              sx={{ mr: 0, gap: 1, color: 'text.secondary', typography: 'body2', mb: 1 }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {segments.map((segment, index) => (
            <Box key={segment.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Label Input - Updated Styles */}
              <TextField
                variant="outlined"
                size="small"
                placeholder={`Segment ${index + 1}`}
                value={segment.label}
                onChange={(e) => handleInputChange(segment.id, 'label', e.target.value)}
                sx={(theme) => ({
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#FFFFFF',
                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                    transition: theme.transitions.create(['background-color', 'border-color', 'backdrop-filter'], {
                      duration: theme.transitions.duration.short,
                    }),
                    '& fieldset': { 
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : theme.palette.divider,
                      transition: theme.transitions.create(['border-color'], {
                        duration: theme.transitions.duration.short,
                      }),
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : theme.palette.action.hover,
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': { 
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : theme.palette.primary.main, 
                      borderWidth: '1px' 
                    },
                  },
                  '& .MuiInputBase-input': {
                    py: '10px',
                    fontSize: '0.875rem',
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
                    transition: theme.transitions.create(['color'], {
                      duration: theme.transitions.duration.short,
                    }),
                  }
                })}
              />
              {/* Color Picker - Updated Styles */}
              <Box sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : theme.palette.divider,
                borderRadius: '8px',
                p: '6px 8px',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#FFFFFF',
                backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                height: 40,
                minWidth: 95,
                transition: theme.transitions.create(['background-color', 'border-color', 'backdrop-filter'], {
                  duration: theme.transitions.duration.short,
                }),
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : theme.palette.action.hover,
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.primary.main,
                }
              })}>
                <Box
                  component="input"
                  type="color"
                  aria-label={`Segment ${index + 1} Color Swatch`}
                  value={segment.color}
                  onChange={(e) => handleInputChange(segment.id, 'color', e.target.value)}
                  sx={{
                    width: 20,
                    height: 20,
                    border: 'none',
                    padding: 0,
                    bgcolor: 'transparent',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&::-webkit-color-swatch-wrapper': { padding: 0 },
                    '&::-webkit-color-swatch': { border: 'none', borderRadius: '4px' }
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={(theme) => ({ 
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.secondary, 
                    fontFamily: 'monospace', 
                    lineHeight: 1, 
                    transition: theme.transitions.create(['color'], {
                      duration: theme.transitions.duration.short,
                    }),
                  })}
                >
                  {segment.color.toUpperCase()}
                </Typography>
              </Box>
              {/* Value Input - Updated Styles */}
              <TextField
                variant="outlined"
                size="small"
                type="number"
                placeholder="Value"
                value={segment.value}
                onChange={(e) => handleInputChange(segment.id, 'value', e.target.value)}
                inputProps={{ min: 0, step: "any" }}
                sx={(theme) => ({
                  width: '70px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#FFFFFF',
                    backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
                    transition: theme.transitions.create(['background-color', 'border-color', 'backdrop-filter'], {
                      duration: theme.transitions.duration.short,
                    }),
                    '& fieldset': { 
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : theme.palette.divider,
                      transition: theme.transitions.create(['border-color'], {
                        duration: theme.transitions.duration.short,
                      }),
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : theme.palette.action.hover,
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': { 
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : theme.palette.primary.main, 
                      borderWidth: '1px' 
                    },
                  },
                  '& .MuiInputBase-input': {
                    py: '10px',
                    fontSize: '0.875rem',
                    textAlign: 'right',
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
                    transition: theme.transitions.create(['color'], {
                      duration: theme.transitions.duration.short,
                    }),
                  },
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                })}
              />
              {/* Remove Button - Updated Style */}
              <IconButton
                onClick={() => onRemoveSegment(segment.id)}
                size="small"
                aria-label={`Remove Segment ${index + 1}`}
                sx={(theme) => ({
                  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#99A6AE',
                  transition: theme.transitions.create(['color', 'background-color'], {
                    duration: theme.transitions.duration.short,
                  }),
                  '&:hover': { 
                    color: theme.palette.mode === 'dark' ? '#FFCCCC' : '#D12711',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(209, 39, 17, 0.2)' : 'rgba(209, 39, 17, 0.08)'
                  }
                })}
              >
                <RemoveCircleOutline fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutline sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : '#2A3135' }} />}
          onClick={onAddSegment}
          fullWidth
          sx={(theme) => ({
            mt: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F1F5F6',
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#2A3135',
            borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#DAE6E8',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            py: 1.25,
            fontSize: '0.875rem',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#E7EBEC',
              borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#DAE6E8',
              boxShadow: 'none',
            }
          })}
        >
          Add Segment
        </Button>
      </Box>

      {/* Styling Section */}
      <Box>
        <Typography 
          variant="h6" 
          component="h3" 
          mb={2}
          sx={{ 
            color: 'text.primary',
            fontWeight: 500,
            fontSize: '1.1rem',
            letterSpacing: '0.5px'
          }}
        >
          Styling
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {(Object.keys(styles) as Array<keyof PieChartStyles>).map((key) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            let min = 0, max = 100, step = 1;
            if (key === 'outerRadius') { max = 200; min = 10; }
            if (key === 'paddingAngle') { max = 30; step = 0.5; }
            if (key === 'cornerRadius') { max = 50; }
            if (key === 'startAngle') { min = -360; max = 360; }
            if (key === 'endAngle') { min = -360; max = 360; }

            return (
              <Box key={key}>
                {/* Label and Value Box */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }} id={`${key}-slider-label`}>
                    {label}
                  </Typography>
                  <Box sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '6px',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'divider',
                    }
                  }}>
                    <TextField
                      value={styles[key]}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          handleStyleChange(key, 0);
                        } else {
                          const numValue = parseFloat(value);
                          if (!isNaN(numValue) && numValue >= min && numValue <= max) {
                            handleStyleChange(key, numValue);
                          }
                        }
                      }}
                      variant="standard"
                      size="small"
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                          '&:before, &:after': {
                            display: 'none',
                          },
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                        '& .MuiInputBase-input': {
                          padding: 0,
                          textAlign: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          height: '100%',
                        },
                      }}
                      inputProps={{
                        min,
                        max,
                        step,
                      }}
                    />
                  </Box>
                </Box>
                {/* Slider - Updated Styles */}
                <Slider
                  aria-labelledby={`${key}-slider-label`}
                  value={styles[key]}
                  onChange={(e, newValue) => handleStyleChange(key, newValue)}
                  min={min}
                  max={max}
                  step={step}
                  size="small"
                  sx={{
                    color: 'primary.main',
                    height: 6,
                    padding: '13px 0',
                    '& .MuiSlider-track': {
                      border: 'none',
                      height: 6,
                      borderRadius: 3,
                    },
                    '& .MuiSlider-rail': {
                      opacity: 1,
                      backgroundColor: '#EAEEF0',
                      height: 6,
                      borderRadius: 3,
                    },
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                      backgroundColor: '#fff',
                      border: '1px solid #CFD6DA',
                      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                        boxShadow: '0px 0px 0px 6px rgba(0, 104, 204, 0.16)',
                      },
                      '&:before': {
                        display: 'none',
                      },
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default PieChartEditor; 