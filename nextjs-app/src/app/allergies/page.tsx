'use client';

import { useState } from 'react';
import { AllergyCard } from '@/components/allergies/AllergyCard';
import { useAllergiesData } from '@/hooks/useAllergiesData';
import { CardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { AlertTriangle, Pill, Apple, Sprout } from 'lucide-react';
import { StatusCard } from '@/components/common/StatusCard';

export default function AllergiesPage() {
  const { allergies, loading, error } = useAllergiesData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !allergies) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="无法加载过敏记录"
        description={error || '请确保数据文件存在'}
      />
    );
  }

  const categories = ['all', 'drug', 'food', 'environmental', 'other'];
  const categoryLabels: Record<string, string> = {
    all: '全部',
    drug: '药物',
    food: '食物',
    environmental: '环境',
    other: '其他'
  };

  const filteredAllergies = selectedCategory === 'all'
    ? allergies.allergies
    : allergies.allergies.filter(a => {
        const cat = a.category.toLowerCase();
        return cat.includes(selectedCategory);
      });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-macos-text-primary mb-2">过敏记录</h1>
        <p className="text-macos-text-muted">管理您的过敏信息和注意事项</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard
          title="总过敏数"
          value={allergies.statistics.total_allergies}
          icon={AlertTriangle}
          color="coral"
        />
        <StatusCard
          title="严重过敏"
          value={allergies.statistics.severe_count}
          description="需特别注意"
          color="coral"
        />
        <StatusCard
          title="药物过敏"
          value={allergies.statistics.drug_allergies}
          icon={Pill}
          color="apricot"
        />
        <StatusCard
          title="食物过敏"
          value={allergies.statistics.food_allergies}
          icon={Apple}
          color="mint"
        />
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 border-b border-macos-border">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              selectedCategory === category
                ? 'text-macos-accent-coral'
                : 'text-macos-text-muted hover:text-macos-text-primary'
            }`}
          >
            {categoryLabels[category]}
            {selectedCategory === category && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-macos-accent-coral rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Allergy Cards */}
      {filteredAllergies.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title={`没有${categoryLabels[selectedCategory]}过敏记录`}
          description="太好了,没有发现相关过敏"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAllergies.map((allergy, index) => (
            <AllergyCard
              key={index}
              allergen={allergy.allergen}
              category={allergy.category}
              severity={allergy.severity}
              reactionType={allergy.reaction_type}
              symptoms={allergy.symptoms}
              onsetDate={allergy.onset_date}
              lastOccurrence={allergy.last_occurrence}
            />
          ))}
        </div>
      )}
    </div>
  );
}
