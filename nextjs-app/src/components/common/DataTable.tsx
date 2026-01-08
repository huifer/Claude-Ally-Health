'use client';

import { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  hoverable?: boolean;
  striped?: boolean;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  hoverable = true,
  striped = true,
  onRowClick,
  emptyMessage = '暂无数据',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Handle sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const key = String(column.key);

    if (sortColumn === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortOrder('asc');
    }
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === bValue) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    const comparison = aValue < bValue ? -1 : 1;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  // Reset to first page if current page is out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  // Render sort icon
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const key = String(column.key);
    if (sortColumn !== key) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }

    return sortOrder === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1 text-macos-accent-coral" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-macos-accent-coral" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-macos-border">
        <table className="w-full">
          <thead className="bg-macos-bg-secondary">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-xs font-semibold text-macos-text-primary uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-macos-bg-hover' : ''
                  }`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-macos-border ${
              striped ? 'bg-macos-bg-card' : ''
            }`}
          >
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  striped && rowIndex % 2 === 0 ? 'bg-macos-bg-secondary' : ''
                } ${
                  hoverable && onRowClick
                    ? 'hover:bg-macos-bg-hover cursor-pointer transition-colors'
                    : ''
                }`}
                onClick={() => onRowClick?.(row, startIndex + rowIndex)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-sm text-macos-text-secondary whitespace-nowrap"
                  >
                    {column.render
                      ? column.render(row[column.key as keyof T], row, startIndex + rowIndex)
                      : String(row[column.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-macos-text-muted">{emptyMessage}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-macos-text-muted">
            显示 {startIndex + 1} - {Math.min(startIndex + pageSize, sortedData.length)} / 共{' '}
            {sortedData.length} 条
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-macos-text-primary hover:bg-macos-bg-hover'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[2rem] px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-macos-accent-coral text-white'
                        : 'text-macos-text-primary hover:bg-macos-bg-hover'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-macos-text-primary hover:bg-macos-bg-hover'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
