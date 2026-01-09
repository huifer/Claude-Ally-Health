'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileSpreadsheet, FileJson, FileText } from 'lucide-react';
import { ExportConfig } from '@/lib/types/analytics';

interface ExportPanelProps {
  onExport: (config: ExportConfig) => void;
  isExporting?: boolean;
}

export function ExportPanel({ onExport, isExporting = false }: ExportPanelProps) {
  const [dataType, setDataType] = useState<ExportConfig['dataType']>('health-trends');
  const [format, setFormat] = useState<ExportConfig['format']>('csv');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);

  const handleExport = () => {
    const config: ExportConfig = {
      dataType,
      dateRange: {
        start: '2018-01-01',
        end: new Date().toISOString().split('T')[0]
      },
      format,
      includeCharts,
      includeSummary
    };
    onExport(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Download className="w-5 h-5" />
          数据导出
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Type Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            数据类型
          </label>
          <Tabs value={dataType} onValueChange={(v) => setDataType(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="health-trends">健康趋势</TabsTrigger>
              <TabsTrigger value="lab-trends">检查趋势</TabsTrigger>
              <TabsTrigger value="statistics">统计数据</TabsTrigger>
              <TabsTrigger value="all">全部数据</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Format Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            导出格式
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={format === 'csv' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFormat('csv')}
              className={format === 'csv' ? 'bg-green-600' : ''}
            >
              <FileSpreadsheet className="w-4 h-4 mr-1" />
              CSV
            </Button>
            <Button
              variant={format === 'json' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFormat('json')}
              className={format === 'json' ? 'bg-green-600' : ''}
            >
              <FileJson className="w-4 h-4 mr-1" />
              JSON
            </Button>
            <Button
              variant={format === 'pdf' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFormat('pdf')}
              className={format === 'pdf' ? 'bg-green-600' : ''}
            >
              <FileText className="w-4 h-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={includeCharts}
              onChange={(e) => setIncludeCharts(e.target.checked)}
              className="rounded"
            />
            <span>包含图表</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={includeSummary}
              onChange={(e) => setIncludeSummary(e.target.checked)}
              className="rounded"
            />
            <span>包含汇总分析</span>
          </label>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isExporting ? '导出中...' : '导出数据'}
        </Button>
      </CardContent>
    </Card>
  );
}
