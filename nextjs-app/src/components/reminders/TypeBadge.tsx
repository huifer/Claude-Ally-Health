interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const getTypeConfig = (type: string) => {
    const typeMap: Record<string, { label: string; colorClass: string }> = {
      medication: {
        label: '用药',
        colorClass: 'bg-blue-100 text-blue-700 border-blue-200',
      },
      appointment: {
        label: '预约',
        colorClass: 'bg-purple-100 text-purple-700 border-purple-200',
      },
      screening: {
        label: '筛查',
        colorClass: 'bg-orange-100 text-orange-700 border-orange-200',
      },
      vaccination: {
        label: '疫苗',
        colorClass: 'bg-green-100 text-green-700 border-green-200',
      },
    };

    return (
      typeMap[type.toLowerCase()] || {
        label: type,
        colorClass: 'bg-gray-100 text-gray-700 border-gray-200',
      }
    );
  };

  const config = getTypeConfig(type);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.colorClass}`}>
      {config.label}
    </span>
  );
}
