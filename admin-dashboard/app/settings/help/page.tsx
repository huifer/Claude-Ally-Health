'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink } from 'lucide-react';

export default function SettingsHelpPage() {
  const faqs = [
    {
      category: '使用指南',
      questions: [
        {
          q: '如何查看我的健康报告？',
          a: '在"分析报告"页面可以生成综合健康报告，或在"检查记录"中查看具体的检查结果。',
        },
        {
          q: '如何管理我的用药计划？',
          a: '在"药物管理"页面可以查看当前用药、设置服药提醒、查看用药历史和相互作用。',
        },
        {
          q: '如何设置筛查提醒？',
          a: '在"预防保健"页面可以查看筛查计划，在"提醒设置"中配置通知方式。',
        },
      ],
    },
    {
      category: '数据管理',
      questions: [
        {
          q: '如何备份我的数据？',
          a: '在"设置" > "数据备份"页面可以创建完整备份，或启用自动备份功能。',
        },
        {
          q: '如何导出数据？',
          a: '在"数据分析" > "数据导出"页面可以导出为CSV、JSON或PDF格式。',
        },
        {
          q: '我的数据安全吗？',
          a: '所有数据仅存储在本地设备，不会上传到云端，确保您的隐私安全。',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">帮助中心</h1>
        <p className="text-gray-600 mt-1">获取使用帮助和支持</p>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            快速链接
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a href="/profile" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Book className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">用户指南</p>
                <p className="text-sm text-gray-600">查看完整的使用文档</p>
              </div>
            </a>
            <a href="/settings" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <HelpCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">系统设置</p>
                <p className="text-sm text-gray-600">配置应用偏好</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      {faqs.map((section, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {section.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.questions.map((faq, faqIdx) => (
                <div key={faqIdx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <p className="font-medium text-gray-900 mb-2">{faq.q}</p>
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            联系支持
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <Mail className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-medium text-gray-900">邮件支持</p>
                <p className="text-sm text-gray-600">support@his.example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-900">在线反馈</p>
                <p className="text-sm text-gray-600">提交问题和建议</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-500">
            <p>个人健康信息系统 (HIS) Admin Dashboard</p>
            <p className="mt-1">版本 1.0.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
