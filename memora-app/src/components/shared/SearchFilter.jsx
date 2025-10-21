import React from 'react';
import { Search } from 'lucide-react';

function SearchFilter({ searchQuery, onSearchChange, filterBy, onFilterChange }) {
  return (
    <div className="max-w-5xl mx-auto px-4 mt-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={filterBy}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All</option>
          <option value="favorites">Favorites</option>
          <option value="photos">Photos</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilter;