
import React from 'react';
import { Book } from '../types/search';
import BookCard from './BookCard';
import { Loader2 } from 'lucide-react';

interface SearchResultsProps {
  results: Book[];
  isLoading: boolean;
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading, query }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Searching through indexed books...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600 mb-4">
          No books contain the word or phrase "{query}". Try:
        </p>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>• Check your spelling</li>
          <li>• Try different keywords</li>
          <li>• Use broader search terms</li>
          <li>• Remove filters to expand results</li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Search Results for "{query}"
          </h2>
          <p className="text-gray-600">
            Found {results.length} {results.length === 1 ? 'book' : 'books'} containing your search term
          </p>
        </div>
      )}
      
      <div className="space-y-6">
        {results.map((book) => (
          <BookCard key={book.id} book={book} searchQuery={query} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
