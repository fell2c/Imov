import React from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';
import type { SearchBarProps } from '../types/Index';

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col sm:flex-row gap-2">
      <div className="flex-1 flex items-center gap-2 px-4">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Busque por localização ou tipo de imóvel..."
          className="w-full py-2 outline-none text-gray-700"
          value={value}
          onChange={onChange}
        />
      </div>
      <Button onClick={onSearch} variant="primary" className="px-6 py-3">
        Buscar
      </Button>
    </div>
  );
};