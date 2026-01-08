'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/analysis/ChatInterface';
import { AnalysisPanel } from '@/components/analysis/AnalysisPanel';
import { PageHeader } from '@/components/navigation';
import { Brain, Lightbulb } from 'lucide-react';

export default function AnalysisPage() {
  const [latestAnalysis, setLatestAnalysis] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const handleSendMessage = async (message: string): Promise<string> => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: message,
        focusAreas: [],
        dateRange: null
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    const result = await response.json();

    if (result.success) {
      setLatestAnalysis(result.analysis);
      setMetadata(result.metadata);
      return result.analysis;
    } else {
      throw new Error(result.error || 'Analysis failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#FFF5F5] rounded-lg">
            <Brain className="w-6 h-6 text-[#FF6B6B]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI 健康分析</h1>
            <p className="text-gray-600">
              基于 Claude 的智能健康数据分析和建议
            </p>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      <div className="mb-6 bg-[#FFFBF0] border-l-4 border-[#FFB347] p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <Lightbulb className="h-5 w-5 text-[#FFB347]" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-[#FF8787] mb-1">
              使用提示
            </h3>
            <div className="text-sm text-[#FF6B6B] space-y-1">
              <p>• 你可以用自然语言提问，例如：&ldquo;分析我的体重趋势&rdquo;</p>
              <p>• 询问化验结果解读、健康风险评估等</p>
              <p>• 所有分析仅基于你的本地健康数据</p>
              <p>• 分析结果仅供参考，不替代专业医疗建议</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <div>
          <ChatInterface onSendMessage={handleSendMessage} />
        </div>

        {/* Analysis Panel */}
        <div>
          {latestAnalysis ? (
            <AnalysisPanel
              analysis={latestAnalysis}
              metadata={metadata}
              className="min-h-[600px]"
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center min-h-[600px]">
              <div className="text-center text-gray-500">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">等待分析</p>
                <p className="text-sm">在左侧输入问题开始 AI 分析</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Example Queries */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">示例问题</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: '趋势分析',
              query: '分析我的体重和BMI变化趋势',
              icon: '📈'
            },
            {
              title: '化验解读',
              query: '解读我最近的血常规和生化检查结果',
              icon: '🔬'
            },
            {
              title: '风险评估',
              query: '根据我的健康数据评估慢性病风险',
              icon: '⚠️'
            },
            {
              title: '综合建议',
              query: '给出改善健康状况的具体建议',
              icon: '💡'
            }
          ].map((example, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                const chatInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (chatInput) {
                  chatInput.value = example.query;
                  chatInput.focus();
                }
              }}
            >
              <div className="text-2xl mb-2">{example.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{example.title}</h3>
              <p className="text-sm text-gray-600">{example.query}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">功能特性</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🔒 数据隐私</h3>
            <p className="text-sm text-gray-600">
              所有健康数据保存在本地，仅在请求分析时发送必要信息到 Claude API
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">🧠 智能分析</h3>
            <p className="text-sm text-gray-600">
              基于 Claude 3.5 Sonnet 的强大推理能力，提供深入的健康洞察
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">📊 多维分析</h3>
            <p className="text-sm text-gray-600">
              综合分析体检、化验、症状、用药等多方面健康数据
            </p>
          </div>
        </div>
      </section>

      {/* API Status */}
      <section className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">API 配置状态</h3>
            <p className="text-sm text-gray-600">
              {process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
                ? '✅ API Key 已配置（仅用于开发测试）'
                : '⚠️ 需要在 .env.local 配置 ANTHROPIC_API_KEY'}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6B6B] hover:text-[#FF6B6B]"
            >
              获取 API Key →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
