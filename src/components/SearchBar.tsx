
import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { SearchFilters } from '../types/search';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isSearching: boolean;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, {});
    }
  };

  const handleExampleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    onSearch(searchTerm, {});
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <div className="absolute left-4 z-10">
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for words, phrases, authors, or book titles..."
          className="w-full pl-12 pr-32 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
          disabled={isSearching}
        />
        
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="absolute right-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleExampleSearch('love')}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          love
        </button>
        <button
          type="button"
          onClick={() => handleExampleSearch('freedom')}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          freedom
        </button>
        <button
          type="button"
          onClick={() => handleExampleSearch('justice')}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          justice
        </button>
        <button
          type="button"
          onClick={() => handleExampleSearch('society')}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          society
        </button>
        <button
          type="button"
          onClick={() => handleExampleSearch('government')}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
        >
          government
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
