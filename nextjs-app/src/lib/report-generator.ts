import fs from 'fs';
import path from 'path';
import { HealthData } from '@/types/health-data';

const OUTPUT_DIR = path.join(process.cwd(), '../history-chart');

export interface ReportMetadata {
  reportId: string;
  generatedAt: string;
  dateRange?: { start: string; end: string };
  dataPoints: number;
}

export interface ReportContent {
  html?: string;
  json?: any;
  metadata: ReportMetadata;
}

/**
 * Ensure output directory exists
 */
async function ensureOutputDir(): Promise<void> {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.promises.mkdir(path.join(OUTPUT_DIR, 'generated-reports'), { recursive: true });
  await fs.promises.mkdir(path.join(OUTPUT_DIR, 'charts'), { recursive: true });
}

/**
 * Generate and save health report
 */
export async function generateAndSaveReport(
  reportContent: ReportContent
): Promise<{ htmlPath?: string; jsonPath?: string }> {
  await ensureOutputDir();

  const { reportId, generatedAt } = reportContent.metadata;
  const timestamp = generatedAt.split('T')[0];
  const baseFilename = `health-report-${timestamp}-${reportId}`;

  const filePaths: { htmlPath?: string; jsonPath?: string } = {};

  // Save HTML report
  if (reportContent.html) {
    const htmlPath = path.join(OUTPUT_DIR, 'generated-reports', `${baseFilename}.html`);
    await fs.promises.writeFile(htmlPath, reportContent.html, 'utf-8');
    filePaths.htmlPath = htmlPath;
  }

  // Save JSON data
  if (reportContent.json) {
    const jsonPath = path.join(OUTPUT_DIR, 'generated-reports', `${baseFilename}.json`);
    await fs.promises.writeFile(
      jsonPath,
      JSON.stringify(reportContent.json, null, 2),
      'utf-8'
    );
    filePaths.jsonPath = jsonPath;
  }

  return filePaths;
}

/**
 * Generate HTML health report
 */
export function generateHTMLReport(
  analysis: string,
  healthData: Partial<HealthData>,
  metadata: ReportMetadata
): string {
  const { generatedAt, dateRange, dataPoints } = metadata;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>健康分析报告 - ${new Date(generatedAt).toLocaleDateString('zh-CN')}</title>

  <!-- Tailwind CSS v3.4 -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Lucide Icons v0.263 -->
  <script src="https://unpkg.com/lucide@0.263.0/dist/umd/lucide.js"></script>

  <!-- ECharts v5.5 -->
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>

  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1F2937;
      background-color: #f9fafb;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
      section {
        page-break-inside: avoid;
      }
    }

    .chart-container {
      width: 100%;
      height: 400px;
      min-height: 400px;
    }
  </style>
</head>
<body>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <header class="mb-8 bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <i data-lucide="activity" class="text-blue-600"></i>
            健康分析报告
          </h1>
          <p class="text-gray-600">
            生成时间: ${new Date(generatedAt).toLocaleString('zh-CN')} |
            数据点: ${dataPoints} 项
            ${dateRange ? `| 分析周期: ${dateRange.start} 至 ${dateRange.end}` : ''}
          </p>
        </div>
        <div class="flex gap-2 no-print">
          <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <i data-lucide="printer" class="w-4 h-4"></i>
            打印报告
          </button>
          <button onclick="exportAllCharts()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
            <i data-lucide="download" class="w-4 h-4"></i>
            导出图表
          </button>
        </div>
      </div>
    </header>

    <!-- AI Analysis -->
    <section class="mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <i data-lucide="brain" class="text-purple-600"></i>
        AI 分析结果
      </h2>
      <div class="prose max-w-none">
        <div class="whitespace-pre-wrap text-gray-700 leading-relaxed">
          ${analysis}
        </div>
      </div>
    </section>

    <!-- Profile Summary -->
    ${healthData.profile ? `
    <section class="mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <i data-lucide="user" class="text-blue-600"></i>
        用户档案
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p class="text-sm text-gray-600">年龄</p>
          <p class="text-lg font-semibold">${healthData.profile.calculated?.age_years || 'N/A'} 岁</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">BMI</p>
          <p class="text-lg font-semibold">${healthData.profile.calculated?.bmi?.toFixed(1) || 'N/A'}</p>
        </div>
        <div>
          <p class="text-sm text-gray-600">体表面积</p>
          <p class="text-lg font-semibold">${healthData.profile.calculated?.body_surface_area?.toFixed(2) || 'N/A'} m²</p>
        </div>
      </div>
    </section>
    ` : ''}

    <!-- Lab Results Summary -->
    ${healthData.labResults && healthData.labResults.length > 0 ? `
    <section class="mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <i data-lucide="test-tubes" class="text-purple-600"></i>
        化验结果汇总
      </h2>
      <div class="space-y-4">
        ${healthData.labResults.map(lab => `
          <div class="border-b pb-4 last:border-0">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="font-semibold">${lab.type}</p>
                <p class="text-sm text-gray-600">${lab.date} | ${lab.hospital}</p>
              </div>
              ${lab.summary ? `
                <div class="text-right">
                  <p class="text-sm text-gray-600">${lab.summary.total_items} 项检查</p>
                  ${lab.summary.abnormal_count > 0 ? `
                    <p class="text-sm font-semibold text-red-600">
                      ${lab.summary.abnormal_count} 项异常
                    </p>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Statistics Cards -->
    <section class="mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
        <i data-lucide="bar-chart" class="text-green-600"></i>
        数据统计
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-600">体重记录</p>
          <p class="text-2xl font-bold text-blue-900">${healthData.profile?.history?.length || 0}</p>
          <p class="text-sm text-blue-600">条记录</p>
        </div>
        <div class="p-4 bg-purple-50 rounded-lg">
          <p class="text-sm text-purple-600">化验结果</p>
          <p class="text-2xl font-bold text-purple-900">${healthData.labResults?.length || 0}</p>
          <p class="text-sm text-purple-600">次检查</p>
        </div>
        <div class="p-4 bg-green-50 rounded-lg">
          <p class="text-sm text-green-600">疫苗接种</p>
          <p class="text-2xl font-bold text-green-900">${healthData.vaccinations?.statistics?.total_doses_administered || 0}</p>
          <p class="text-sm text-green-600">剂次</p>
        </div>
        <div class="p-4 bg-orange-50 rounded-lg">
          <p class="text-sm text-orange-600">过敏记录</p>
          <p class="text-2xl font-bold text-orange-900">${healthData.allergies?.statistics?.total_allergies || 0}</p>
          <p class="text-sm text-orange-600">项过敏</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded">
      <h3 class="text-lg font-semibold text-yellow-800 mb-2">免责声明</h3>
      <p class="text-yellow-700 text-sm">
        本报告由 Claude AI 分析生成，仅供参考，不作为医疗诊断依据。
        所有诊疗决策需咨询专业医生。本分析基于提供的健康数据，可能存在局限性。
      </p>
      <p class="text-yellow-700 text-sm mt-2">
        生成时间: ${new Date(generatedAt).toLocaleString('zh-CN')} |
        报告 ID: ${metadata.reportId}
      </p>
    </footer>
  </div>

  <!-- Initialize Icons -->
  <script>
    lucide.createIcons();
  </script>
</body>
</html>`;
}

/**
 * List all generated reports
 */
export async function listReports(): Promise<
  Array<{ filename: string; path: string; createdAt: Date }>
> {
  const reportsDir = path.join(OUTPUT_DIR, 'generated-reports');

  if (!fs.existsSync(reportsDir)) {
    return [];
  }

  const files = await fs.promises.readdir(reportsDir);
  const reports = [];

  for (const file of files) {
    if (file.endsWith('.html')) {
      const filePath = path.join(reportsDir, file);
      const stats = await fs.promises.stat(filePath);
      reports.push({
        filename: file,
        path: filePath,
        createdAt: stats.mtime
      });
    }
  }

  return reports.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
