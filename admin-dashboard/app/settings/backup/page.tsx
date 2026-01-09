import { Card, CardContent } from '@/components/ui/card';
import { DatabaseBackup } from 'lucide-react';

export default function SettingsBackupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">数据备份</h1>
        <p className="text-gray-600 mt-1">备份和恢复您的健康数据</p>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <DatabaseBackup className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">功能开发中</p>
            <p className="text-sm mt-1">该功能即将上线,敬请期待</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
