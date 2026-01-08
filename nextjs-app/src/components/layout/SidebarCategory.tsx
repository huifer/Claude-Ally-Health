interface SidebarCategoryProps {
  category: string;
  isCollapsed: boolean;
}

export function SidebarCategory({ category, isCollapsed }: SidebarCategoryProps) {
  if (isCollapsed) {
    return null;
  }

  return (
    <li className="mt-6 mb-2">
      <div className="px-3">
        <h3 className="text-xs font-semibold text-macos-text-muted uppercase tracking-wider">
          {category}
        </h3>
      </div>
    </li>
  );
}
