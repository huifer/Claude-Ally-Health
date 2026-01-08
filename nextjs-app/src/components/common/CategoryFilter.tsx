'use client';

interface CategoryFilterProps {
  categories: string[];
  categoryLabels: Record<string, string>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  variant?: 'tabs' | 'buttons';
}

export function CategoryFilter({
  categories,
  categoryLabels,
  selectedCategory,
  onCategoryChange,
  variant = 'tabs',
}: CategoryFilterProps) {
  if (variant === 'buttons') {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              selectedCategory === category
                ? 'bg-macos-accent-coral text-white'
                : 'bg-macos-bg-secondary text-macos-text-primary hover:bg-macos-bg-hover'
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
    );
  }

  // Default variant: tabs
  return (
    <div className="flex items-center space-x-2 border-b border-macos-border">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
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
  );
}
