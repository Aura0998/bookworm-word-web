import React, { useState } from 'react';
import { SearchFilters } from '../types/search';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const genres = [
    'Fiction', 'Non-Fiction', 'Romance', 'Mystery', 'Science Fiction', 
    'Fantasy', 'Biography', 'History', 'Philosophy', 'Poetry', 'Drama', 'Dystopian Fiction'
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese'];

  const currentYear = new Date().getFullYear();
  const yearRanges = [
    { label: 'All time', value: null },
    { label: '2020s', value: [2020, currentYear] as [number, number] },
    { label: '2010s', value: [2010, 2019] as [number, number] },
    { label: '2000s', value: [2000, 2009] as [number, number] },
    { label: '1990s', value: [1990, 1999] as [number, number] },
    { label: '1980s', value: [1980, 1989] as [number, number] },
    { label: '1970s', value: [1970, 1979] as [number, number] },
    { label: '1960s', value: [1960, 1969] as [number, number] },
    { label: '1950s', value: [1950, 1959] as [number, number] },
    { label: 'Pre-1950', value: [1800, 1949] as [number, number] },
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: string | [number, number] | number | null) => {
    const newFilters = { ...filters };
    if (value === null || value === '') {
      delete newFilters[key];
    } else {
      (newFilters as any)[key] = value;
    }
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {Object.keys(filters).length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-6">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium text-left"
            >
              Clear all filters
            </button>
          )}

          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genre
            </label>
            <select
              value={filters.genre || ''}
              onChange={(e) => handleFilterChange('genre', e.target.value || null)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            >
              <option value="">All genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Year Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Publication Period
            </label>
            <select
              value={filters.yearRange ? `${filters.yearRange[0]}-${filters.yearRange[1]}` : ''}
              onChange={(e) => {
                const selectedRange = yearRanges.find(range => 
                  range.value && `${range.value[0]}-${range.value[1]}` === e.target.value
                );
                handleFilterChange('yearRange', selectedRange ? selectedRange.value : null);
              }}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            >
              {yearRanges.map(range => (
                <option 
                  key={range.label} 
                  value={range.value ? `${range.value[0]}-${range.value[1]}` : ''}
                >
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={filters.language || ''}
              onChange={(e) => handleFilterChange('language', e.target.value || null)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            >
              <option value="">All languages</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>

          {/* Word Count Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Length
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wordCount"
                  checked={!filters.minWordCount && !filters.maxWordCount}
                  onChange={() => {
                    const newFilters = { ...filters };
                    delete newFilters.minWordCount;
                    delete newFilters.maxWordCount;
                    onFiltersChange(newFilters);
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Any length</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wordCount"
                  checked={filters.maxWordCount === 50000}
                  onChange={() => handleFilterChange('maxWordCount', 50000)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Short (&lt; 50k words)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wordCount"
                  checked={filters.minWordCount === 50000 && filters.maxWordCount === 100000}
                  onChange={() => {
                    const newFilters = { ...filters, minWordCount: 50000, maxWordCount: 100000 };
                    onFiltersChange(newFilters);
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Medium (50k - 100k words)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wordCount"
                  checked={filters.minWordCount === 100000}
                  onChange={() => {
                    const newFilters = { ...filters, minWordCount: 100000 };
                    delete newFilters.maxWordCount;
                    onFiltersChange(newFilters);
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Long (&gt; 100k words)</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
