
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  publisher: string;
  isbn: string;
  pageCount: number;
  language: string;
  description: string;
  coverImage: string;
  matchedWords: string[];
  wordCount: number;
}

export interface SearchFilters {
  genre?: string;
  yearRange?: [number, number];
  language?: string;
  author?: string;
  minWordCount?: number;
  maxWordCount?: number;
}

export interface SearchContextMatch {
  word: string;
  context: string;
  pageNumber: number;
  relevanceScore: number;
}
