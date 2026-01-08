interface StatusBadgeProps {
  status: 'normal' | 'abnormal' | 'overdue';
  result?: string;
}

export function StatusBadge({ status, result }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (status === 'overdue') {
      return {
        label: '逾期',
        colorClass: 'bg-red-100 text-red-700 border-red-200',
      };
    }
    if (status === 'abnormal' || result?.toLowerCase().includes('abnormal')) {
      return {
        label: '异常',
        colorClass: 'bg-orange-100 text-orange-700 border-orange-200',
      };
    }
    return {
      label: '正常',
      colorClass: 'bg-green-100 text-green-700 border-green-200',
    };
  };

  const config = getStatusConfig();

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.colorClass}`}>
      {config.label}
    </span>
  );
}
