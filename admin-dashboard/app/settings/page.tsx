'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Bell, Palette, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
        <p className="text-gray-600 mt-1">配置您的应用设置</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              账户设置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a href="/profile" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <User className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">个人信息</p>
                  <p className="text-sm text-gray-600">更新您的基本信息</p>
                </div>
              </a>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">用户名</p>
                    <p className="text-sm text-gray-600">user@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              通知设置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a href="/settings/reminders" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">提醒偏好</p>
                  <p className="text-sm text-gray-600">管理用药和筛查提醒</p>
                </div>
              </a>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">推送通知</p>
                  <p className="text-sm text-gray-600">接收检查结果更新</p>
                </div>
                <span className="text-sm text-green-600">已开启</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">邮件通知</p>
                  <p className="text-sm text-gray-600">接收健康报告邮件</p>
                </div>
                <span className="text-sm text-gray-500">已关闭</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              隐私与安全
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a href="/settings/privacy" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Shield className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-medium text-gray-900">隐私设置</p>
                  <p className="text-sm text-gray-600">管理数据隐私设置</p>
                </div>
              </a>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">数据存储</p>
                  <p className="text-sm text-gray-600">本地存储，不上传云端</p>
                </div>
                <span className="text-sm text-green-600">安全</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              数据管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a href="/settings/backup" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="font-medium text-gray-900">数据备份</p>
                  <p className="text-sm text-gray-600">备份和恢复健康数据</p>
                </div>
              </a>
              <a href="/analytics/export" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Palette className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">数据导出</p>
                  <p className="text-sm text-gray-600">导出您的健康数据</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help & Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            帮助与支持
          </CardTitle>
        </CardHeader>
        <CardContent>
          <a href="/settings/help" className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">帮助中心</p>
              <p className="text-sm text-gray-600">获取使用帮助和常见问题解答</p>
            </div>
          </a>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-gray-500">
            <p>个人健康信息系统 (HIS) Admin Dashboard</p>
            <p className="mt-1">版本 1.0.0</p>
            <p className="mt-1">所有数据仅存储在本地，确保您的隐私安全</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
