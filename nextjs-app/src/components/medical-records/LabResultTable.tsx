import { useState } from 'react';
import { LabResult } from '@/types/health-data';
import { ArrowUpDown, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { AbnormalHighlighter } from './AbnormalHighlighter';

interface LabResultTableProps {
  results: LabResult[];
  showAbnormalOnly?: boolean;
}

type SortField = 'date' | 'type' | 'hospital' | 'abnormal_count';
type SortOrder = 'asc' | 'desc';

export function LabResultTable({ results, showAbnormalOnly = false }: LabResultTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterAbnormal, setFilterAbnormal] = useState(showAbnormalOnly);

  // Sort and filter results
  const processedResults = results
    .filter(r => !filterAbnormal || (r.summary?.abnormal_count || 0) > 0)
    .sort((a, b) => {
      let comparison = 0;

      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (sortField === 'hospital') {
        comparison = a.hospital.localeCompare(b.hospital);
      } else if (sortField === 'abnormal_count') {
        comparison = (a.summary?.abnormal_count || 0) - (b.summary?.abnormal_count || 0);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-macos-text-muted" />
          <button
            onClick={() => setFilterAbnormal(!filterAbnormal)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filterAbnormal
                ? 'bg-orange-100 text-orange-700'
                : 'bg-macos-bg-secondary text-macos-text-secondary hover:bg-macos-bg-hover'
            }`}
          >
            只显示异常
          </button>
        </div>
        <span className="text-sm text-macos-text-muted">
          共 {processedResults.length} 份报告
        </span>
      </div>

      {/* Table */}
      <div className="bg-macos-bg-card rounded-2xl border border-macos-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-macos-bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center space-x-1 text-sm font-semibold text-macos-text-primary hover:text-macos-accent-coral"
                  >
                    <span>日期</span>
                    {getSortIcon('date')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('type')}
                    className="flex items-center space-x-1 text-sm font-semibold text-macos-text-primary hover:text-macos-accent-coral"
                  >
                    <span>检查类型</span>
                    {getSortIcon('type')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort('hospital')}
                    className="flex items-center space-x-1 text-sm font-semibold text-macos-text-primary hover:text-macos-accent-coral"
                  >
                    <span>医院</span>
                    {getSortIcon('hospital')}
                  </button>
                </th>
                <th className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleSort('abnormal_count')}
                    className="flex items-center justify-center space-x-1 text-sm font-semibold text-macos-text-primary hover:text-macos-accent-coral"
                  >
                    <span>异常项</span>
                    {getSortIcon('abnormal_count')}
                  </button>
                </th>
                <th className="px-6 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-macos-border">
              {processedResults.map((result, index) => (
                <tr key={index} className="hover:bg-macos-bg-hover transition-colors">
                  <td className="px-6 py-4 text-sm text-macos-text-primary">
                    {result.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-macos-text-primary">
                    {result.type}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-macos-text-primary">{result.hospital}</div>
                    <div className="text-xs text-macos-text-muted">{result.department}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {(result.summary?.abnormal_count || 0) > 0 ? (
                      <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        {result.summary?.abnormal_count || 0}
                      </span>
                    ) : (
                      <span className="text-sm text-green-600">正常</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-macos-accent-coral hover:underline">
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {processedResults.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm text-macos-text-muted">没有找到匹配的化验结果</p>
          </div>
        )}
      </div>
    </div>
  );
}
