'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
  badge?: string | number;
}

export interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  collapsible?: boolean;
  className?: string;
}

/**
 * Sidebar — боковая панель навигации
 */
export function Sidebar({
  items,
  title,
  collapsible = true,
  className,
}: SidebarProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Обработчик клика на ссылку
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  // Переключение секции
  const toggleSection = (label: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className={cn('w-64 border-r border-border bg-background', className)}>
      {title && (
        <h2 className="text-sm font-semibold mb-4 px-2">{title}</h2>
      )}

      <nav className="h-full overflow-y-auto scrollbar-hide">
        <ul className="flex flex-col gap-1 p-2">
          {items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isCollapsed = collapsedSections[item.label];

            return (
              <li key={item.href} className="relative">
                <a
                  href={item.href}
                  onClick={(e) => {
                    handleLinkClick(e);
                    if (hasChildren && collapsible) {
                      toggleSection(item.label);
                    }
                  }}
                  className={cn(
                    'flex items-center gap-3 px-2 py-2 rounded-md',
                    'text-sm font-medium text-muted-foreground',
                    'hover:bg-accent hover:text-accent-foreground',
                    'transition-colors'
                  )}
                >
                  {item.icon && (
                    <span className="h-5 w-5 shrink-0">{item.icon}</span>
                  )}
                  <span className="flex-1 truncate">{item.label}</span>

                  {hasChildren && (
                    <span className="flex items-center text-muted-foreground">
                      {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}

                  {item.badge && (
                    <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-medium text-muted-foreground">
                      {item.badge}
                    </span>
                  )}
                </a>

                {/* Дочерние элементы */}
                {hasChildren && (
                  <div
                    className={cn(
                      'flex flex-col gap-1 mt-1',
                      isCollapsed && 'hidden'
                    )}
                  >
                    {item.children!.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={handleLinkClick}
                        className={cn(
                          'flex items-center gap-3 px-4 py-1.5 rounded-md ml-6 relative',
                          'text-sm text-muted-foreground hover:text-foreground',
                          'transition-colors'
                        )}
                      >
                        {/* Вертикальная линия */}
                        <span className="absolute left-0 top-0 bottom-0 w-px bg-border" />
                        
                        <span className="flex-1 truncate">{child.label}</span>
                        {child.badge && (
                          <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-xs font-medium text-muted-foreground">
                            {child.badge}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
