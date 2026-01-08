'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Trash2, RefreshCw } from 'lucide-react';

interface Report {
  filename: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [query, setQuery] = useState('请分析我的整体健康状况');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports/generate');
      const result = await response.json();

      if (result.success) {
        setReports(result.reports || []);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!query.trim() || generating) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const result = await response.json();

      if (result.success) {
        alert(`报告生成成功！\n文件：${result.paths.htmlPath || ''}`);
        await loadReports();
      } else {
        alert(`报告生成失败：${result.error}`);
      }
    } catch (error) {
      console.error('Generate report error:', error);
      alert('报告生成失败，请检查配置');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = (filename: string) => {
    window.open(`/history-chart/generated-reports/${filename}`, '_blank');
  };

  const handleDeleteReport = async (filename: string) => {
    if (!confirm(`确定要删除报告 "${filename}" 吗？`)) return;

    // This would require a DELETE endpoint
    alert('删除功能将在下个版本实现');
  };

  const suggestedQueries = [
    '请分析我的整体健康状况',
    '分析我的体重和BMI变化趋势',
    '解读我最近的化验结果',
    '评估我的慢性病风险',
    '提供健康改善建议'
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">报告中心</h1>
            <p className="text-gray-600">
              生成和管理健康分析报告
            </p>
          </div>
        </div>
      </header>

      {/* Generate Report Section */}
      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#FF6B6B]" />
          生成新报告
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分析主题
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入你想了解的健康问题..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">快速选择：</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggested, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggested)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {suggested}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={generating || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                生成报告
              </>
            )}
          </button>
        </div>
      </section>

      {/* Reports List */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            历史报告
            <span className="text-sm font-normal text-gray-500">
              ({reports.length} 份)
            </span>
          </h2>
          <button
            onClick={loadReports}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
            <p>加载报告列表中...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">暂无报告</p>
            <p className="text-sm">生成你的第一份健康分析报告吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[#FFF5F5] rounded">
                    <FileText className="w-5 h-5 text-[#FF6B6B]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{report.filename}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadReport(report.filename)}
                    className="p-2 text-[#FF6B6B] hover:bg-[#FFFBF0] rounded-lg transition"
                    title="下载报告"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.filename)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="删除报告"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="mt-8 bg-[#FFFBF0] border-l-4 border-blue-400 p-6 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              关于报告
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• 报告以 HTML 格式保存到 <code className="bg-[#FFF5F5] px-1 rounded">history-chart/generated-reports/</code> 目录</p>
              <p>• 每份报告包含 AI 分析、用户档案、化验结果汇总等信息</p>
              <p>• 报告支持在浏览器中打开、打印和分享</p>
              <p>• 所有报告均保存在本地，确保数据隐私</p>
            </div>
          </div>
        </div>
      </section>

      {/* Output Directory Info */}
      <section className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">输出目录</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• HTML 报告: <code className="bg-white px-2 py-1 rounded">history-chart/generated-reports/</code></p>
          <p>• 导出的图表: <code className="bg-white px-2 py-1 rounded">history-chart/charts/</code></p>
        </div>
      </section>
    </div>
  );
}
