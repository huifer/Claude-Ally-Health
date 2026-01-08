interface SeverityBadgeProps {
  severity: number;
  reactionType?: string;
}

export function SeverityBadge({ severity, reactionType }: SeverityBadgeProps) {
  const getSeverityConfig = (level: number) => {
    if (level >= 4 || reactionType === 'Anaphylaxis') {
      return {
        label: '严重',
        colorClass: 'bg-red-100 text-red-700 border-red-200',
        dotClass: 'bg-red-500'
      };
    }
    if (level === 3) {
      return {
        label: '中度',
        colorClass: 'bg-orange-100 text-orange-700 border-orange-200',
        dotClass: 'bg-orange-500'
      };
    }
    return {
      label: '轻度',
      colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      dotClass: 'bg-yellow-500'
    };
  };

  const config = getSeverityConfig(severity);

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.colorClass}`}>
      <span className={`w-2 h-2 rounded-full ${config.dotClass} mr-2`}></span>
      {config.label}
    </div>
  );
}
