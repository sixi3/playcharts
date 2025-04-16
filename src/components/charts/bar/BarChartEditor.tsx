import React from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import { BarDataPoint, BarChartStyles } from '@/app/page';

interface BarChartEditorProps {
  data: BarDataPoint[];
  styles: BarChartStyles;
  onAddBar: () => void;
  onRemoveBar: (id: string) => void;
  onUpdateBar: (id: string, updatedValues: Partial<Omit<BarDataPoint, 'id'>>) => void;
  onUpdateStyle: (updatedValues: Partial<BarChartStyles>) => void;
}

export default function BarChartEditor({
  data,
  styles,
  onAddBar,
  onRemoveBar,
  onUpdateBar,
  onUpdateStyle,
}: BarChartEditorProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Data Management Section */}
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={styles.showLegend}
                  onChange={(e) => onUpdateStyle({ showLegend: e.target.checked })}
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
          {data.map((bar, index) => (
            <Box key={bar.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Label Input */}
              <TextField
                variant="outlined"
                size="small"
                placeholder={`Segment ${index + 1}`}
                value={bar.label}
                onChange={(e) => onUpdateBar(bar.id, { label: e.target.value })}
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
              
              {/* Color Picker */}
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
                  value={bar.color}
                  onChange={(e) => onUpdateBar(bar.id, { color: e.target.value })}
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
                  {bar.color.toUpperCase()}
                </Typography>
              </Box>
              
              {/* Value Input */}
              <TextField
                variant="outlined"
                size="small"
                placeholder="0"
                type="number"
                value={bar.value}
                onChange={(e) => onUpdateBar(bar.id, { value: Number(e.target.value) })}
                sx={(theme) => ({
                  width: 70,
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
                    textAlign: 'center',
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
                    transition: theme.transitions.create(['color'], {
                      duration: theme.transitions.duration.short,
                    }),
                    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                      WebkitAppearance: 'none',
                      margin: 0,
                    },
                    '&[type=number]': {
                      MozAppearance: 'textfield',
                    },
                  }
                })}
              />
              
              {/* Remove Button */}
              <IconButton
                onClick={() => onRemoveBar(bar.id)}
                size="small"
                sx={{
                  color: 'error.main',
                  padding: '8px',
                  '&:hover': {
                    backgroundColor: 'error.lighter',
                  }
                }}
              >
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddCircleOutline sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : '#2A3135' }} />}
          onClick={onAddBar}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          {/* Toggles Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={styles.showXAxis}
                  onChange={(e) => onUpdateStyle({ showXAxis: e.target.checked })}
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
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      boxSizing: 'border-box',
                      width: 18,
                      height: 18,
                      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
                      ...(theme.palette.mode === 'dark' && {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }),
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 24 / 2,
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#CFD6DA'}`,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#EAEEF0',
                      opacity: 1,
                    },
                  })}
                />
              }
              label={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Show X-Axis</Typography>}
              labelPlacement="start"
              sx={{ gap: 1, justifyContent: 'space-between', ml: 0, width: '100%' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={styles.showYAxis}
                  onChange={(e) => onUpdateStyle({ showYAxis: e.target.checked })}
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
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      boxSizing: 'border-box',
                      width: 18,
                      height: 18,
                      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
                      ...(theme.palette.mode === 'dark' && {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }),
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 24 / 2,
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#CFD6DA'}`,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#EAEEF0',
                      opacity: 1,
                    },
                  })}
                />
              }
              label={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Show Y-Axis</Typography>}
              labelPlacement="start"
              sx={{ gap: 1, justifyContent: 'space-between', ml: 0, width: '100%' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={styles.showGrid}
                  onChange={(e) => onUpdateStyle({ showGrid: e.target.checked })}
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
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      boxSizing: 'border-box',
                      width: 18,
                      height: 18,
                      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
                      ...(theme.palette.mode === 'dark' && {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }),
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 24 / 2,
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#CFD6DA'}`,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#EAEEF0',
                      opacity: 1,
                    },
                  })}
                />
              }
              label={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Show Grid</Typography>}
              labelPlacement="start"
              sx={{ gap: 1, justifyContent: 'space-between', ml: 0, width: '100%' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={styles.barBorder}
                  onChange={(e) => onUpdateStyle({ barBorder: e.target.checked })}
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
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      boxSizing: 'border-box',
                      width: 18,
                      height: 18,
                      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
                      ...(theme.palette.mode === 'dark' && {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      }),
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: 24 / 2,
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#CFD6DA'}`,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#EAEEF0',
                      opacity: 1,
                    },
                  })}
                />
              }
              label={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Show Bar Border</Typography>}
              labelPlacement="start"
              sx={{ gap: 1, justifyContent: 'space-between', ml: 0, width: '100%' }}
            />
          </Box>

          {/* Layout Controls */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Orientation
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{
                  display: 'flex',
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#F1F5F6',
                  borderRadius: '6px',
                  padding: '2px',
                }}>
                  <Button
                    size="small"
                    disableRipple
                    onClick={() => onUpdateStyle({ orientation: 'vertical' })}
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      py: 0.75,
                      textTransform: 'none',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      backgroundColor: styles.orientation === 'vertical' ? (theme) => 
                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#FFFFFF' : 'transparent',
                      color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary',
                      boxShadow: styles.orientation === 'vertical' ? (theme) =>
                        theme.palette.mode === 'dark' ? 'none' : '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                      '&:hover': {
                        backgroundColor: styles.orientation === 'vertical' ? (theme) => 
                          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#FFFFFF' : 'transparent',
                      }
                    }}
                  >
                    Vertical
                  </Button>
                  <Button
                    size="small"
                    disableRipple
                    onClick={() => onUpdateStyle({ orientation: 'horizontal' })}
                    sx={{
                      minWidth: 'auto',
                      px: 2,
                      py: 0.75,
                      textTransform: 'none',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      backgroundColor: styles.orientation === 'horizontal' ? (theme) =>
                        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#FFFFFF' : 'transparent',
                      color: (theme) => theme.palette.mode === 'dark' ? '#FFFFFF' : 'text.primary',
                      boxShadow: styles.orientation === 'horizontal' ? (theme) =>
                        theme.palette.mode === 'dark' ? 'none' : '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                      '&:hover': {
                        backgroundColor: styles.orientation === 'horizontal' ? (theme) =>
                          theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : '#FFFFFF' : 'transparent',
                      }
                    }}
                  >
                    Horizontal
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Bar Width Control */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Bar Width
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
                  value={styles.barWidth}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0.1 && value <= 1) {
                      onUpdateStyle({ barWidth: value });
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
                    min: 0.1,
                    max: 1,
                    step: 0.1,
                  }}
                />
              </Box>
            </Box>
            <Slider
              value={styles.barWidth}
              onChange={(_, value) => onUpdateStyle({ barWidth: value as number })}
              min={0.1}
              max={1}
              step={0.1}
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

          {/* Bar Border Controls */}
          {styles.barBorder && (
            <>
              {/* Border Color */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Border Color
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
                    backgroundColor: styles.barBorderColor,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      opacity: 0.8,
                    }
                  }}
                  onClick={(e) => {
                    const target = e.currentTarget;
                    const picker = target.nextElementSibling as HTMLElement;
                    if (picker) {
                      picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
                    }
                  }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 1,
                      display: 'none',
                      mt: 1,
                    }}
                  >
                    <ChromePicker
                      color={styles.barBorderColor}
                      onChange={(color: { hex: string }) => onUpdateStyle({ barBorderColor: color.hex })}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Border Width */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Border Width
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
                      value={styles.barBorderWidth}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1 && value <= 5) {
                          onUpdateStyle({ barBorderWidth: value });
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
                        min: 1,
                        max: 5,
                        step: 1,
                      }}
                    />
                  </Box>
                </Box>
                <Slider
                  value={styles.barBorderWidth}
                  onChange={(_, value) => onUpdateStyle({ barBorderWidth: value as number })}
                  min={1}
                  max={5}
                  step={1}
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
            </>
          )}

          {/* Corner Radius */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Corner Radius
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
                  value={styles.barCornerRadius}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 20) {
                      onUpdateStyle({ barCornerRadius: value });
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
                    min: 0,
                    max: 20,
                    step: 1,
                  }}
                />
              </Box>
            </Box>
            <Slider
              value={styles.barCornerRadius}
              onChange={(_, value) => onUpdateStyle({ barCornerRadius: value as number })}
              min={0}
              max={20}
              step={1}
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
        </Box>
      </Box>
    </Box>
  );
} 