/**
 * Chart export utilities for saving ECharts as images
 */

export interface ChartExportOptions {
  filename?: string;
  format?: 'png' | 'jpeg' | 'svg';
  quality?: number;
  pixelRatio?: number;
  backgroundColor?: string;
}

/**
 * Export a single chart instance as an image
 */
export async function exportChartAsImage(
  chartInstance: any,
  options: ChartExportOptions = {}
): Promise<string> {
  const {
    filename = `chart-${Date.now()}`,
    format = 'png',
    quality = 1,
    pixelRatio = 2,
    backgroundColor = '#fff'
  } = options;

  return new Promise((resolve, reject) => {
    try {
      const url = chartInstance.getDataURL({
        type: format,
        pixelRatio: pixelRatio,
        backgroundColor: backgroundColor
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `${filename}.${format}`;
      link.href = url;
      link.click();

      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Export multiple chart instances
 */
export async function exportMultipleCharts(
  charts: Map<string, any>,
  options: ChartExportOptions = {}
): Promise<void> {
  const promises = Array.from(charts.entries()).map(([name, chart]) => {
    return exportChartAsImage(chart, {
      ...options,
      filename: `${name}-${Date.now()}`
    });
  });

  await Promise.all(promises);
}

/**
 * Get chart instance from DOM element
 */
export function getChartInstance(containerId: string): any {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Chart container not found: ${containerId}`);
  }

  // ECharts stores instance on DOM element
  const echartsInstance = (container as any).__echarts_instance__;
  if (!echartsInstance) {
    throw new Error(`No ECharts instance found on container: ${containerId}`);
  }

  return echartsInstance;
}

/**
 * Export all charts on the current page
 */
export async function exportAllChartsOnPage(
  options: ChartExportOptions = {}
): Promise<number> {
  // Find all ECharts containers
  const chartContainers = document.querySelectorAll('[class*="echarts"]');
  let exportedCount = 0;

  for (const container of Array.from(chartContainers)) {
    try {
      const instance = (container as any).__echarts_instance__;
      if (instance) {
        await exportChartAsImage(instance, {
          ...options,
          filename: `chart-${exportedCount + 1}-${Date.now()}`
        });
        exportedCount++;
      }
    } catch (error) {
      console.error('Failed to export chart:', error);
    }
  }

  return exportedCount;
}

/**
 * Save chart data as JSON
 */
export function saveChartDataAsJson(chartData: any, filename: string = 'chart-data.json'): void {
  const json = JSON.stringify(chartData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Generate a report with charts and data
 */
export interface ReportGenerationOptions {
  title: string;
  analysis: string;
  metadata: {
    generatedAt: string;
    reportId: string;
    dataPoints: number;
  };
}

export function generateReportBlob(content: string): Blob {
  return new Blob([content], { type: 'text/html' });
}

export function downloadReport(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
