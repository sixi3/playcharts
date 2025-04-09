import type { Segment, PieChartStyles, ChartOptions } from '@/app/page';

/**
 * Generates a JSX string representation of the MUI PieChart component
 * based on the provided segments, styles, and options.
 *
 * @param segments - Array of segment data.
 * @param styles - Object containing pie chart styling properties.
 * @param options - Object containing other chart options (e.g., legend visibility).
 * @returns A string containing the formatted JSX code.
 */
export function generatePieChartCode(
  segments: Segment[],
  styles: PieChartStyles,
  options: ChartOptions
): string {
  // Filter out segments with non-positive values as they aren't rendered
  const validSegments = segments.filter(s => s.value > 0);

  // Construct the data array string with proper indentation
  const dataString = validSegments
    .map(
      (segment) =>
        `      { id: '${segment.id}', value: ${segment.value}, label: '${segment.label}', color: '${segment.color}' }`
    )
    .join(',\n'); // Join with comma and newline

  // Construct the main PieChart component string
  const codeString = `import { PieChart } from '@mui/x-charts/PieChart';

export default function MyPieChart() {
  return (
    <PieChart
      series={[
        {
          data: [
${dataString}
          ],
          innerRadius: ${styles.innerRadius},
          outerRadius: ${styles.outerRadius},
          paddingAngle: ${styles.paddingAngle},
          cornerRadius: ${styles.cornerRadius},
          startAngle: ${styles.startAngle},
          endAngle: ${styles.endAngle},
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
          // Hover transitions
          transition: {
            duration: 400,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      ]}
      width={400}
      height={300}
      slotProps={{
        legend: { hidden: ${!options.showLegend} },
      }}
      sx={{
        // Add smooth transitions for all chart interactions
        '& .MuiChartsLegend-mark': {
          transition: 'all 0.3s ease-in-out',
          borderRadius: 1,
        },
        '& .MuiChartsLegend-label': {
          transition: 'color 0.3s ease-in-out',
        },
        '& .MuiChartsLegend-series': {
          transition: 'opacity 0.3s ease-in-out',
        },
      }}
    />
  );
}`;

  return codeString.trim(); // Trim leading/trailing whitespace
} 