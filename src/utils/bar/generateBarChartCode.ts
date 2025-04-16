import { BarDataPoint, BarChartStyles } from '@/app/page'; // Adjust path if needed

export function generateBarChartCode(
  data: BarDataPoint[],
  styles: BarChartStyles,
): string {
  const imports = `import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis'; // Retained for potential future use
`;

  const datasetString = JSON.stringify(data.map(d => ({ label: d.label, value: d.value, color: d.color, id: d.id })), null, 2);

  // Build the series configuration
  const seriesString = `
    series={[
      {
        dataKey: 'value',
        label: 'Value', // Default label, could be customized later
        idKey: 'id',
        ${styles.barCornerRadius > 0 ? `cornerRadius: ${styles.barCornerRadius},` : ''} // Add cornerRadius
        ${styles.isStacked ? `stack: 'total', // Enable stacking if isStacked is true` : ''}
        // Border styling (barBorder, barBorderColor, barBorderWidth) usually requires
        // custom styling or slotProps to target individual bar elements.
        // Example: slotProps={{ bar: { /* ... custom styles ... */ } }}
      },
    ]}
  `.trim();

  // Build the axis configurations conditionally
  const xAxisConfig = styles.showXAxis
    ? `xAxis={[{
        scaleType: 'band',
        dataKey: 'label',
        ${styles.xAxisLabel ? `label: '${styles.xAxisLabel}',` : ''}
      }]}`
    : ''; // Omit prop entirely if not shown

  const yAxisConfig = styles.showYAxis
    ? `yAxis={[{
        ${styles.yAxisLabel ? `label: '${styles.yAxisLabel}',` : ''}
      }]}`
    : ''; // Omit prop entirely if not shown

  // Build the grid configuration using computed property name
  const gridConfig = `grid={{ ${styles.orientation === 'horizontal' ? 'vertical' : 'horizontal'}: ${styles.showGrid} }}`;

  // Build the legend configuration
  const legendConfig = styles.showLegend ? '' : 'slotProps={{ legend: { hidden: true } }}'; // Hide if not shown, default is visible

  // Build the BarChart component string
  const chartComponent = `<BarChart
  dataset={dataset}
  layout="${styles.orientation}"
  ${styles.barSpacing !== undefined ? `barGapRatio={${styles.barSpacing}}` : ''}
  ${styles.barWidth !== undefined ? `barWidth={${styles.barWidth}}` : ''}
  ${seriesString}
  ${xAxisConfig}
  ${yAxisConfig}
  ${gridConfig}
  ${legendConfig}
  // Default width/height for snippet clarity
  width={500}
  height={300}
/>`;

  // Combine imports, data, and component
  const code = `
${imports}

// Data for the chart
const dataset = ${datasetString};

// Component definition
export default function MyBarChart() {
  return (
    ${chartComponent}
  );
}
`;

  return code.trim();
}