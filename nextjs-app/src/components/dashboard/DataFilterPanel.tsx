'use client';

import { useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

interface DataFilterPanelProps {
  onFilterChange?: (filters: {
    focusAreas: string[];
    dataTypes: string[];
  }) => void;
  className?: string;
}

export function DataFilterPanel({ onFilterChange, className = '' }: DataFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const focusAreas = [
    { id: 'profile', label: '基础档案' },
    { id: 'lab', label: '化验结果' },
    { id: 'vitals', label: '生命体征' },
    { id: 'medications', label: '用药记录' },
    { id: 'allergies', label: '过敏史' },
    { id: 'cycle', label: '周期追踪' },
    { id: 'screening', label: '筛查记录' },
    { id: 'radiation', label: '辐射记录' }
  ];

  const dataTypes = [
    { id: 'trends', label: '趋势分析' },
    { id: 'correlations', label: '关联分析' },
    { id: 'abnormal', label: '异常值' },
    { id: 'risk', label: '风险评估' }
  ];

  const toggleArea = (areaId: string) => {
    setSelectedAreas(prev => {
      const newAreas = prev.includes(areaId)
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId];

      if (onFilterChange) {
        onFilterChange({
          focusAreas: newAreas,
          dataTypes: selectedTypes
        });
      }

      return newAreas;
    });
  };

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => {
      const newTypes = prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId];

      if (onFilterChange) {
        onFilterChange({
          focusAreas: selectedAreas,
          dataTypes: newTypes
        });
      }

      return newTypes;
    });
  };

  const clearAll = () => {
    setSelectedAreas([]);
    setSelectedTypes([]);

    if (onFilterChange) {
      onFilterChange({
        focusAreas: [],
        dataTypes: []
      });
    }
  };

  const hasActiveFilters = selectedAreas.length > 0 || selectedTypes.length > 0;

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">数据筛选</span>
            {hasActiveFilters && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                {selectedAreas.length + selectedTypes.length}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isOpen ? 'transform rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Filter Options */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Focus Areas */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">关注领域</h4>
            <div className="flex flex-wrap gap-2">
              {focusAreas.map(area => (
                <button
                  key={area.id}
                  onClick={() => toggleArea(area.id)}
                  className={`
                    px-3 py-1.5 text-sm rounded-lg border transition-all
                    ${
                      selectedAreas.includes(area.id)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }
                  `}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data Types */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">分析类型</h4>
            <div className="flex flex-wrap gap-2">
              {dataTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`
                    px-3 py-1.5 text-sm rounded-lg border transition-all
                    ${
                      selectedTypes.includes(type.id)
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                    }
                  `}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                已选择 {selectedAreas.length + selectedTypes.length} 个筛选条件
              </span>
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                清除全部
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
