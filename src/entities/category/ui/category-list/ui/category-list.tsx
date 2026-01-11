'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ICategoryUiDto } from '../../../model/dto/types';
import { Card, CardHeader } from '@/shared/ui/card';
import { H3, Description } from '@/shared/ui/typography';

interface CategoryListProps {
  categories: ICategoryUiDto[];
  selectedCategory?: string;
  onCategorySelect?: (categoryUuid: string | undefined) => void;
}

export function CategoryList({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Проверяем, что categories - это массив, иначе используем пустой массив
  if (!Array.isArray(categories)) {
    return (
      <aside className="category-list w-full lg:w-64 min-w-[353px]">
        <Card>
          <CardHeader>
            <H3 className="text-black">Каталог товаров</H3>
          </CardHeader>
          <Description className="text-gray">Загрузка категорий...</Description>
        </Card>
      </aside>
    );
  }

  // Получаем только корневые категории, у которых есть подкатегории
  const rootCategories = categories.filter(
    (cat) => cat.children && cat.children.length > 0
  );

  const toggleCategory = (categoryUuid: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryUuid)) {
        newSet.delete(categoryUuid);
      } else {
        newSet.add(categoryUuid);
      }
      return newSet;
    });
  };

  return (
    <aside className="category-list w-full lg:w-64 min-w-[353px]">
      <Card>
        <CardHeader>
          <H3 className="text-black">
            Каталог товаров
          </H3>
        </CardHeader>
        <ul className="category-list__list space-y-2">
          {rootCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.uuid);

            return (
              <li key={category.uuid}>
                <button
                  onClick={() => toggleCategory(category.uuid)}
                  className="category-list__item-button w-full text-left rounded-md px-3 py-2 text-p transition-colors flex items-center justify-between gap-2 text-black hover:bg-background cursor-pointer"
                >
                  <span className="category-list__item-name flex-1">{category.name}</span>
                  <Image
                    src="/arrow.svg"
                    alt={isExpanded ? 'Свернуть' : 'Развернуть'}
                    width={16}
                    height={16}
                    className={`category-list__item-arrow flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </button>
                {/* Показываем дочерние категории с отступом */}
                {category.children && (
                  <ul className={`category-list__children mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {category.children.map((child) => (
                      <li key={child.uuid} className="category-list__child-item">
                        <button
                          onClick={() => onCategorySelect?.(child.uuid)}
                          className={`category-list__child-button cursor-pointer w-full text-left rounded-md px-3 py-2 text-description transition-colors ${
                            selectedCategory === child.uuid
                              ? 'category-list__child-button--selected bg-blue-50 text-blue-600 font-bold'
                              : 'text-gray hover:bg-background'
                          }`}
                        >
                          {child.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </aside>
  );
}
