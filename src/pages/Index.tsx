import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import FilterPanel from '../components/FilterPanel';
import { Book, SearchFilters } from '../types/search';
import { queryEngineApi } from '../services/queryEngineApi';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [stats, setStats] = useState({
    wordCount: 0,
    docCount: 0,
    topWords: [] as Array<{ word: string; count: number }>
  });
  const [error, setError] = useState<string | null>(null);

  // Load initial stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [wordCountResponse, docCountResponse, topWordsResponse] = await Promise.all([
          queryEngineApi.getStats('word_count'),
          queryEngineApi.getStats('doc_count'),
          queryEngineApi.getStats('top_words')
        ]);

        setStats({
          wordCount: wordCountResponse.value as number,
          docCount: docCountResponse.value as number,
          topWords: topWordsResponse.value as Array<{ word: string; count: number }>
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
        setError('Failed to load statistics. Please check your connection.');
      }
    };

    loadStats();
  }, []);

  const handleSearch = async (query: string, searchFilters: SearchFilters) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);
    setFilters(searchFilters);
    setError(null);
    
    try {
      // Split query into words for API
      const words = query.trim().split(/\s+/);
      
      // Convert filters to API format
      const apiFilters: SearchFilters = {};
      if (searchFilters.author) apiFilters.author = searchFilters.author;
      if (searchFilters.yearRange) {
        apiFilters.from = searchFilters.yearRange[0].toString();
        apiFilters.to = searchFilters.yearRange[1].toString();
      }
      
      console.log('Searching for words:', words, 'with filters:', apiFilters);
      
      const apiResponse = await queryEngineApi.searchDocuments(words, apiFilters);
      console.log('Search completed:', apiResponse);
      
      const transformedBooks = queryEngineApi.transformApiResponseToBooks(apiResponse);
      
      // Add matched words based on search query
      const booksWithMatches = transformedBooks.map(book => ({
        ...book,
        matchedWords: words.filter(word => 
          book.title.toLowerCase().includes(word.toLowerCase()) ||
          book.author.toLowerCase().includes(word.toLowerCase()) ||
          book.description.toLowerCase().includes(word.toLowerCase())
        )
      }));
      
      setSearchResults(booksWithMatches);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please check your connection and try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (hasSearched && searchQuery) {
      // Re-run search with new filters
      handleSearch(searchQuery, newFilters);
    }
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
                {stats.docCount.toLocaleString()} books indexed
              </span>
              <span className="text-sm text-gray-600">
                {stats.wordCount.toLocaleString()} unique words
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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

              {/* Top Words Section */}
              {stats.topWords.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Indexed Words</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {stats.topWords.slice(0, 10).map((wordStat, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(wordStat.word, {})}
                        className="px-3 py-1 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full hover:from-blue-100 hover:to-indigo-100 transition-colors border border-blue-200"
                      >
                        {wordStat.word} ({wordStat.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Search Results Section */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterPanel filters={filters} onFiltersChange={handleFiltersChange} />
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
