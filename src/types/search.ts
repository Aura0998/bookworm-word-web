
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
  // Additional fields from your API
  document?: string;
  metadata?: Record<string, string>;
}

export interface SearchFilters {
  genre?: string;
  yearRange?: [number, number];
  language?: string;
  author?: string;
  minWordCount?: number;
  maxWordCount?: number;
  from?: string;
  to?: string;
}

export interface SearchContextMatch {
  word: string;
  context: string;
  pageNumber: number;
  relevanceScore: number;
}

export interface ApiSearchResponse {
  status: string;
  results: Array<{
    document: string;
    metadata: Record<string, string>;
  }>;
}

export interface ApiStatsResponse {
  type: string;
  value: number | Array<{ word: string; count: number }>;
}
