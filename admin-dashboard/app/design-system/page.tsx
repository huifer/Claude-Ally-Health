'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function DesignSystemPage() {
  const colors = [
    { name: 'Primary 50', class: 'bg-primary-50', text: 'text-primary-900' },
    { name: 'Primary 100', class: 'bg-primary-100', text: 'text-primary-900' },
    { name: 'Primary 200', class: 'bg-primary-200', text: 'text-primary-900' },
    { name: 'Primary 300', class: 'bg-primary-300', text: 'text-primary-900' },
    { name: 'Primary 400', class: 'bg-primary-400', text: 'text-white' },
    { name: 'Primary 500', class: 'bg-primary-500', text: 'text-white' },
    { name: 'Primary 600', class: 'bg-primary-600', text: 'text-white' },
    { name: 'Primary 700', class: 'bg-primary-700', text: 'text-white' },
    { name: 'Primary 800', class: 'bg-primary-800', text: 'text-white' },
    { name: 'Primary 900', class: 'bg-primary-900', text: 'text-white' },
  ];

  const semanticColors = [
    { name: 'Success', class: 'bg-success', description: '正常指标、成功状态' },
    { name: 'Warning', class: 'bg-warning', description: '警告、需要注意' },
    { name: 'Danger', class: 'bg-danger', description: '危险、异常指标' },
    { name: 'Info', class: 'bg-info', description: '信息提示' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            设计系统 - 暖绿色主题
          </h1>
          <p className="text-gray-600 mt-2">
            Warm Green Healthcare Design System (Hue: 142°) - 单一主题
          </p>
        </div>
      </div>

      {/* Primary Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>Primary 色阶 - 暖绿色</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {colors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={`h-20 rounded-lg ${color.class} flex items-center justify-center`}>
                  <span className={`text-sm font-medium ${color.text}`}>
                    {color.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Semantic Colors */}
      <Card>
        <CardHeader>
          <CardTitle>语义色彩</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {semanticColors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={`h-24 rounded-lg ${color.class} flex flex-col items-center justify-center text-white p-4`}>
                  <span className="text-lg font-bold">{color.name}</span>
                  <span className="text-xs text-center opacity-90">{color.description}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>按钮样式</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-primary-500 hover:bg-primary-600 text-white">
              Primary 500 - 次要按钮
            </Button>
            <Button className="bg-primary-600 hover:bg-primary-700 text-white">
              Primary 600 - 主要按钮
            </Button>
            <Button className="bg-primary-700 hover:bg-primary-800 text-white">
              Primary 700 - 深色按钮
            </Button>
            <Button className="bg-success hover:bg-green-700 text-white">
              Success - 成功操作
            </Button>
            <Button className="bg-warning hover:bg-amber-600 text-white">
              Warning - 警告操作
            </Button>
            <Button className="bg-danger hover:bg-red-600 text-white">
              Danger - 危险操作
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>状态标签</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
              ✓ 正常
            </Badge>
            <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20">
              ⚠ 偏高
            </Badge>
            <Badge className="bg-danger/10 text-danger border-danger/20 hover:bg-danger/20">
              ⚠ 异常
            </Badge>
            <Badge className="bg-info/10 text-info border-info/20 hover:bg-info/20">
              ℹ 信息
            </Badge>
            <Badge className="bg-primary-600 text-white">
              Primary 实心
            </Badge>
            <Badge variant="outline" className="border-primary-600 text-primary-600">
              Primary 描边
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Elements */}
      <Card>
        <CardHeader>
          <CardTitle>交互元素示例</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜索框（带焦点状态）
            </label>
            <Input
              type="search"
              placeholder="搜索健康数据..."
              className="bg-primary-50 border-primary-200 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:border-primary-400 hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  卡片悬停效果
                </h3>
                <p className="text-sm text-gray-600">
                  悬停时边框变为 Primary 颜色，并添加阴影
                </p>
              </CardContent>
            </Card>

            <Card className="bg-primary-50 border-primary-200 hover:bg-primary-100 transition-all cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary-900 mb-2">
                  浅色背景卡片
                </h3>
                <p className="text-sm text-gray-600">
                  使用 Primary 浅色背景
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Typography & Colors */}
      <Card>
        <CardHeader>
          <CardTitle>文字色彩</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-gray-900 text-lg font-semibold">
              主要文本 - text-gray-900
            </p>
            <p className="text-gray-700">
              标准文本 - text-gray-700
            </p>
            <p className="text-gray-600">
              次要文本 - text-gray-600
            </p>
            <p className="text-gray-500">
              辅助文本 - text-gray-500
            </p>
            <p className="text-primary-600 font-medium">
              链接/强调文本 - text-primary-600
            </p>
            <p className="text-success font-medium">
              成功状态文本 - text-success
            </p>
            <p className="text-warning font-medium">
              警告文本 - text-warning
            </p>
            <p className="text-danger font-medium">
              危险文本 - text-danger
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Guidelines */}
      <Card className="border-primary-200">
        <CardHeader>
          <CardTitle className="text-primary-600">使用指南</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            ✓ 正确做法
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>使用 <code className="bg-primary-50 px-2 py-1 rounded">primary-600</code> 作为主要按钮颜色</li>
            <li>使用语义化颜色：<code className="bg-primary-50 px-2 py-1 rounded">success</code>, <code className="bg-primary-50 px-2 py-1 rounded">warning</code>, <code className="bg-primary-50 px-2 py-1 rounded">danger</code></li>
            <li>所有交互元素都应有悬停状态</li>
            <li>使用 <code className="bg-primary-50 px-2 py-1 rounded">cursor-pointer</code> 标记可点击元素</li>
            <li>确保文字对比度 ≥ 4.5:1（WCAG AA 标准）</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">
            ✗ 错误做法
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>不要使用硬编码颜色（如 <code className="bg-gray-100 px-2 py-1 rounded">bg-blue-500</code>）</li>
            <li>不要使用 <code className="bg-gray-100 px-2 py-1 rounded">emerald-*</code>（已替换为 <code className="bg-gray-100 px-2 py-1 rounded">primary-*</code>）</li>
            <li>不要在同一个组件中混合多种绿色</li>
            <li>不要使用 emoji 作为图标</li>
            <li>不要使用暗色模式（已移除）</li>
          </ul>

          <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <h4 className="font-semibold text-primary-900 mb-2">
              🎨 设计系统特点
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>✅ 单一暖绿色主题 (Hue: 142°)</li>
              <li>✅ 干净清爽的亮色界面</li>
              <li>✅ 简化的代码结构</li>
              <li>✅ 更快的加载速度（减少 CSS 体积）</li>
              <li>✅ 更好的可维护性</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
