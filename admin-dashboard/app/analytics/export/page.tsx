'use client';

import { useState } from 'react';
import { ExportPanel } from '@/components/analytics/ExportPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Eye, Trash2 } from 'lucide-react';
import { ExportConfig } from '@/lib/types/analytics';

interface ExportHistory {
  id: string;
  config: ExportConfig;
  date: string;
  size: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function AnalyticsExportPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([
    {
      id: '1',
      config: {
        dataType: 'health-trends',
        dateRange: { start: '2024-01-01', end: '2025-12-20' },
        format: 'csv',
        includeCharts: true,
        includeSummary: true
      },
      date: '2025-12-20 10:30',
      size: '2.3 MB',
      status: 'completed'
    },
    {
      id: '2',
      config: {
        dataType: 'lab-trends',
        dateRange: { start: '2023-01-01', end: '2025-12-20' },
        format: 'json',
        includeCharts: false,
        includeSummary: true
      },
      date: '2025-12-18 15:45',
      size: '1.8 MB',
      status: 'completed'
    }
  ]);

  const handleExport = async (config: ExportConfig) => {
    setIsExporting(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add to history
    const newExport: ExportHistory = {
      id: Date.now().toString(),
      config,
      date: new Date().toLocaleString('zh-CN'),
      size: '1.5 MB',
      status: 'completed'
    };

    setExportHistory(prev => [newExport, ...prev]);
    setIsExporting(false);

    // Trigger download (in real implementation)
    alert(`导出成功！格式: ${config.format.toUpperCase()}, 类型: ${config.dataType}`);
  };

  const handlePreview = (exportItem: ExportHistory) => {
    alert(`预览导出: ${exportItem.config.dataType} (${exportItem.config.format})`);
  };

  const handleDelete = (id: string) => {
    setExportHistory(prev => prev.filter(item => item.id !== id));
  };

  const getDataTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'health-trends': '健康趋势',
      'lab-trends': '检查趋势',
      'statistics': '统计数据',
      'all': '全部数据'
    };
    return labels[type] || type;
  };

  const getFormatBadge = (format: string) => {
    const styles: Record<string, string> = {
      'csv': 'bg-green-100 text-green-800',
      'json': 'bg-blue-100 text-blue-800',
      'pdf': 'bg-red-100 text-red-800'
    };
    return styles[format] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">数据导出</h1>
        <p className="text-gray-600 mt-1">导出您的健康数据用于备份或分析</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-1">
          <ExportPanel onExport={handleExport} isExporting={isExporting} />

          {/* Export Guide */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">导出说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900 mb-1">CSV 格式</p>
                <p>适合在 Excel 中打开和编辑</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">JSON 格式</p>
                <p>适合开发者和技术分析</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">PDF 格式</p>
                <p>适合打印和分享给医生</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>导出历史</CardTitle>
                <Badge variant="outline">{exportHistory.length} 条记录</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {exportHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Download className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>暂无导出记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {exportHistory.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {getDataTypeLabel(item.config.dataType)}
                          </h4>
                          <Badge className={getFormatBadge(item.config.format)}>
                            {item.config.format.toUpperCase()}
                          </Badge>
                          <Badge
                            variant={item.status === 'completed' ? 'default' : 'secondary'}
                            className="bg-green-100 text-green-800"
                          >
                            {item.status === 'completed' ? '已完成' : '处理中'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">日期范围:</span>{' '}
                            {item.config.dateRange.start} 至 {item.config.dateRange.end}
                          </p>
                          <p className="flex items-center gap-4">
                            <span>导出时间: {item.date}</span>
                            <span>文件大小: {item.size}</span>
                          </p>
                          {item.config.includeCharts && (
                            <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                              包含图表
                            </span>
                          )}
                          {item.config.includeSummary && (
                            <span className="inline-flex items-center text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                              包含汇总
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreview(item)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          预览
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(item.config)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          重新下载
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {exportHistory.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">总导出次数</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {exportHistory.filter(e => e.config.format === 'csv').length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">CSV 导出</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {exportHistory.filter(e => e.config.format === 'pdf').length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">PDF 导出</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
