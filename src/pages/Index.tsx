
import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import FilterPanel from '../components/FilterPanel';
import { Book, SearchFilters } from '../types/search';

// Mock data for demonstration
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    genre: 'Fiction',
    publisher: 'J.B. Lippincott & Co.',
    isbn: '978-0-06-112008-4',
    pageCount: 281,
    language: 'English',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    matchedWords: ['justice', 'mockingbird', 'childhood', 'innocence'],
    wordCount: 100388
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    genre: 'Dystopian Fiction',
    publisher: 'Secker & Warburg',
    isbn: '978-0-452-28423-4',
    pageCount: 328,
    language: 'English',
    description: 'A dystopian social science fiction novel about totalitarian control.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop',
    matchedWords: ['dystopia', 'surveillance', 'totalitarian', 'freedom'],
    wordCount: 88942
  },
  {
    id: '3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    genre: 'Romance',
    publisher: 'T. Egerton',
    isbn: '978-0-14-143951-8',
    pageCount: 432,
    language: 'English',
    description: 'A romantic novel of manners set in Georgian England.',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    matchedWords: ['romance', 'pride', 'prejudice', 'society', 'marriage'],
    wordCount: 122189
  },
  {
    id: '4',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'Fiction',
    publisher: 'Charles Scribner\'s Sons',
    isbn: '978-0-7432-7356-5',
    pageCount: 180,
    language: 'English',
    description: 'A critique of the American Dream set in the Jazz Age.',
    coverImage: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop',
    matchedWords: ['american', 'dream', 'gatsby', 'wealth', 'illusion'],
    wordCount: 47094
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string, searchFilters: SearchFilters) => {
    setIsSearching(true);
    setSearchQuery(query);
    setFilters(searchFilters);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock search logic
    let results = mockBooks;
    
    if (query.trim()) {
      results = mockBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.matchedWords.some(word => word.toLowerCase().includes(query.toLowerCase())) ||
        book.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply filters
    if (searchFilters.genre) {
      results = results.filter(book => book.genre === searchFilters.genre);
    }
    if (searchFilters.yearRange) {
      results = results.filter(book => 
        book.year >= searchFilters.yearRange![0] && book.year <= searchFilters.yearRange![1]
      );
    }
    if (searchFilters.language) {
      results = results.filter(book => book.language === searchFilters.language);
    }
    
    setSearchResults(results);
    setIsSearching(false);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  BookSearch
                </h1>
                <p className="text-sm text-gray-600">Literary Word Index</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {mockBooks.length.toLocaleString()} books indexed
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasSearched ? (
          /* Welcome Section */
          <div className="text-center py-16">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Discover Words in
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Literature</span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Search through millions of indexed words from classic and contemporary books. 
                Find passages, explore themes, and discover connections across literature.
              </p>
              
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <SearchBar onSearch={handleSearch} isSearching={isSearching} />
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Word Search</h3>
                  <p className="text-gray-600 text-sm">Find specific words and their contexts across literature</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Metadata Filters</h3>
                  <p className="text-gray-600 text-sm">Filter by author, genre, publication year, and more</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Results</h3>
                  <p className="text-gray-600 text-sm">Intelligent ranking based on relevance and context</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Search Results Section */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterPanel filters={filters} onFiltersChange={setFilters} />
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <SearchBar 
                  onSearch={handleSearch} 
                  isSearching={isSearching} 
                  initialQuery={searchQuery}
                />
              </div>
              
              <SearchResults 
                results={searchResults} 
                isLoading={isSearching}
                query={searchQuery}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
