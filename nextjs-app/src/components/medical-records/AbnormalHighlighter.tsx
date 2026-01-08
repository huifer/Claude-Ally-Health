interface AbnormalHighlighterProps {
  value: string;
  isAbnormal: boolean;
  unit?: string;
  reference?: string;
}

export function AbnormalHighlighter({ value, isAbnormal, unit, reference }: AbnormalHighlighterProps) {
  if (isAbnormal) {
    return (
      <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded border border-red-200">
        <span className="font-semibold">{value}</span>
        {unit && <span className="ml-1 text-sm">{unit}</span>}
        {reference && <span className="ml-2 text-xs text-red-600">(参考: {reference})</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center">
      <span>{value}</span>
      {unit && <span className="ml-1 text-sm text-macos-text-muted">{unit}</span>}
    </span>
  );
}
