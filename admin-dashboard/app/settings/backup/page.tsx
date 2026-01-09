'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatabaseBackup, Download, Upload, Clock } from 'lucide-react';
import { Badge } from 'antd';

export default function SettingsBackupPage() {
  const backups = [
    {
      id: '1',
      date: '2025-12-20 10:30',
      size: '2.3 MB',
      type: '手动备份',
    },
    {
      id: '2',
      date: '2025-12-15 02:00',
      size: '2.2 MB',
      type: '自动备份',
    },
    {
      id: '3',
      date: '2025-12-08 02:00',
      size: '2.1 MB',
      type: '自动备份',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">数据备份</h1>
        <p className="text-gray-600 mt-1">备份和恢复您的健康数据</p>
      </div>

      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            备份操作
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">创建完整备份</p>
                <p className="text-sm text-gray-600">备份所有健康数据到本地文件</p>
              </div>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                立即备份
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">从备份恢复</p>
                <p className="text-sm text-gray-600">从备份文件恢复数据</p>
              </div>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                选择文件
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-800">
              备份历史
            </CardTitle>
            <Badge count={backups.length} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <DatabaseBackup className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{backup.type}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {backup.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{backup.size}</span>
                  <Button variant="outline" size="sm">下载</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            自动备份设置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">启用自动备份</p>
                <p className="text-sm text-gray-600">每天自动创建备份</p>
              </div>
              <Badge status="success" text="已开启" />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">保留备份数量</p>
                <p className="text-sm text-gray-600">最多保留的备份文件数量</p>
              </div>
              <span className="text-sm text-gray-600">7个</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
