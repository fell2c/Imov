import React from 'react';
import type { CategoryCardProps } from '../types/Index';

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const Icon = category.icon;
  
  return (
    <button className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition group">
      <Icon className="w-12 h-12 text-sky-500 mb-3 group-hover:scale-110 transition" />
      <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
      <p className="text-sm text-gray-500">{category.count} imóveis</p>
    </button>
  );
};