import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'coral' | 'apricot' | 'mint' | 'teal' | 'purple';
}

export function StatusCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = 'default'
}: StatusCardProps) {
  const colorClasses = {
    default: 'bg-macos-bg-card border-macos-border',
    coral: 'bg-gradient-to-br from-macos-accent-coral/10 to-macos-accent-coral/5 border-macos-accent-coral/20',
    apricot: 'bg-gradient-to-br from-macos-accent-apricot/10 to-macos-accent-apricot/5 border-macos-accent-apricot/20',
    mint: 'bg-gradient-to-br from-macos-accent-mint/10 to-macos-accent-mint/5 border-macos-accent-mint/20',
    teal: 'bg-gradient-to-br from-macos-accent-teal/10 to-macos-accent-teal/5 border-macos-accent-teal/20',
    purple: 'bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20',
  };

  return (
    <div className={`p-6 rounded-2xl border shadow-sm ${colorClasses[color]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-macos-text-muted mb-1">{title}</p>
          <p className="text-3xl font-bold text-macos-text-primary mb-1">
            {value}
          </p>
          {description && (
            <p className="text-xs text-macos-text-muted">{description}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-macos-bg-secondary rounded-lg">
            <Icon className="w-5 h-5 text-macos-text-secondary" />
          </div>
        )}
      </div>
    </div>
  );
}
