'use client';

import { useState } from 'react';
import { FileText, Download, Copy, Check } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: string;
  metadata?: {
    model: string;
    timestamp: string;
    dataPoints: number;
  };
  className?: string;
}

export function AnalysisPanel({ analysis, metadata, className = '' }: AnalysisPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([analysis], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">分析结果</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="复制分析"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="下载分析"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metadata */}
      {metadata && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span>模型: {metadata.model}</span>
            <span>数据点: {metadata.dataPoints}</span>
            <span>
              时间: {new Date(metadata.timestamp).toLocaleString('zh-CN')}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {analysis}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-yellow-50 border-t border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>免责声明：</strong>本分析仅供参考，不作为医疗诊断依据。所有诊疗决策需咨询专业医生。
        </p>
      </div>
    </div>
  );
}
