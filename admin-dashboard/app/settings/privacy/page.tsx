'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database } from 'lucide-react';
import { Badge } from 'antd';

export default function SettingsPrivacyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">隐私设置</h1>
        <p className="text-gray-600 mt-1">管理您的隐私和数据安全设置</p>
      </div>

      {/* Data Storage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            数据存储与安全
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">本地存储</p>
                  <p className="text-sm text-gray-600">所有数据仅存储在您的设备上</p>
                </div>
              </div>
              <Badge status="success" text="安全" />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">数据加密</p>
                  <p className="text-sm text-gray-600">敏感数据采用加密存储</p>
                </div>
              </div>
              <Badge status="success" text="已启用" />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">无云端同步</p>
                  <p className="text-sm text-gray-600">数据不会上传到任何服务器</p>
                </div>
              </div>
              <Badge status="success" text="保护隐私" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            隐私选项
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">匿名使用统计</p>
                <p className="text-sm text-gray-600">帮助改进应用功能</p>
              </div>
              <span className="text-sm text-gray-500">已关闭</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">崩溃报告</p>
                <p className="text-sm text-gray-600">自动发送错误报告</p>
              </div>
              <span className="text-sm text-gray-500">已关闭</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Access */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            数据访问
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="font-medium text-gray-900">查看我的数据</p>
                  <p className="text-sm text-gray-600">导出所有个人健康数据</p>
                </div>
              </div>
              <a href="/analytics/export" className="text-sm text-blue-600 hover:text-blue-800">
                前往导出 →
              </a>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">删除我的数据</p>
                  <p className="text-sm text-gray-600">永久删除所有健康数据</p>
                </div>
              </div>
              <span className="text-sm text-red-600 cursor-pointer">删除数据</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 space-y-2">
            <p>本系统遵循数据最小化原则，仅收集必要的健康信息。</p>
            <p>您可以随时访问、修改或删除您的个人数据。</p>
            <p>如需了解更多隐私信息，请联系 support@his.example.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
