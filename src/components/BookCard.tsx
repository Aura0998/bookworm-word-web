
import React from 'react';
import { Book } from '../types/search';
import { Calendar, User, BookOpen, Globe, Hash } from 'lucide-react';

interface BookCardProps {
  book: Book;
  searchQuery: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, searchQuery }) => {
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex gap-6">
          {/* Book Cover */}
          <div className="flex-shrink-0">
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              className="w-24 h-32 object-cover rounded-lg shadow-sm"
            />
          </div>
          
          {/* Book Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {highlightText(book.title, searchQuery)}
                </h3>
                <p className="text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {highlightText(book.author, searchQuery)}
                </p>
              </div>
              
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {book.genre}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 line-clamp-2">
              {highlightText(book.description, searchQuery)}
            </p>
            
            {/* Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{book.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{book.pageCount} pages</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{book.language}</span>
              </div>
              <div className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                <span>{book.wordCount.toLocaleString()} words</span>
              </div>
            </div>
            
            {/* Matched Words */}
            {book.matchedWords.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Relevant words found:</p>
                <div className="flex flex-wrap gap-2">
                  {book.matchedWords.slice(0, 6).map((word, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {highlightText(word, searchQuery)}
                    </span>
                  ))}
                  {book.matchedWords.length > 6 && (
                    <span className="text-xs text-gray-500">
                      +{book.matchedWords.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>Publisher: {book.publisher}</span>
              </div>
              
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  View Passages
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  Book Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
