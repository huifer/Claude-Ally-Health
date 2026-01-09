import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReminderData } from '@/lib/types';
import { Calendar, Clock } from 'lucide-react';

interface Props {
  reminders: ReminderData;
}

export function UpcomingReminders({ reminders }: Props) {
  const upcomingReminders = reminders.reminders
    .filter(r => r.status === 'pending')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-danger';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-primary-400';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>即将到来的提醒</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingReminders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">暂无待办提醒</p>
          ) : (
            upcomingReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-primary-50 hover:border-primary-200 transition-all cursor-pointer"
              >
                <div className={`w-2 h-2 rounded-full ${getPriorityColor(reminder.priority)} mt-2`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {reminder.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {reminder.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(reminder.due_date).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
                <Badge variant={getPriorityBadge(reminder.priority) as any} className="shrink-0">
                  {reminder.priority === 'high' ? '高' : reminder.priority === 'medium' ? '中' : '低'}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
