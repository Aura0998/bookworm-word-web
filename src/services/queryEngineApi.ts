
import { SearchFilters, ApiSearchResponse, ApiStatsResponse, Book } from '../types/search';

const API_BASE_URL = 'http://192.168.0.56/queryengine';

class QueryEngineApiService {
  async searchDocuments(words: string[], filters: SearchFilters = {}): Promise<ApiSearchResponse> {
    const wordsParam = words.join('+');
    const params = new URLSearchParams();
    
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.author) params.append('author', filters.author);
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/documents/${wordsParam}${queryString ? '?' + queryString : ''}`;
    
    console.log('Making API request to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors', // Enable CORS
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      // Return mock data for development if API fails
      return this.getMockSearchResponse(words);
    }
  }

  async getStats(type: 'word_count' | 'doc_count' | 'top_words'): Promise<ApiStatsResponse> {
    const url = `${API_BASE_URL}/stats/${type}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors', // Enable CORS
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Stats API response:', data);
      return data;
    } catch (error) {
      console.error('Stats API request failed:', error);
      // Return mock data for development if API fails
      return this.getMockStatsResponse(type);
    }
  }

  // Mock responses for development when API is not available
  private getMockSearchResponse(words: string[]): ApiSearchResponse {
    const mockResults = [
      {
        document: "doc_001",
        metadata: {
          title: "The Art of Governance",
          author: "Jane Smith",
          date: "2020",
          genre: "Political Science",
          publisher: "Academic Press",
          pages: "450",
          language: "English"
        }
      },
      {
        document: "doc_002", 
        metadata: {
          title: "Data in Modern Society",
          author: "John Doe",
          date: "2019",
          genre: "Technology",
          publisher: "Tech Publications",
          pages: "320",
          language: "English"
        }
      }
    ];

    return {
      status: "success",
      results: mockResults
    };
  }

  private getMockStatsResponse(type: string): ApiStatsResponse {
    switch (type) {
      case 'word_count':
        return { type, value: 125000 };
      case 'doc_count':
        return { type, value: 2500 };
      case 'top_words':
        return {
          type,
          value: [
            { word: "the", count: 15000 },
            { word: "and", count: 12000 },
            { word: "of", count: 10000 },
            { word: "to", count: 8500 },
            { word: "in", count: 7200 }
          ]
        };
      default:
        return { type, value: 0 };
    }
  }

  // Transform API response to Book format for UI compatibility
  transformApiResponseToBooks(apiResponse: ApiSearchResponse): Book[] {
    if (!apiResponse.results) return [];
    
    return apiResponse.results.map((result, index) => {
      const metadata = result.metadata || {};
      
      return {
        id: result.document || `doc_${index}`,
        title: metadata.title || 'Unknown Title',
        author: metadata.author || 'Unknown Author',
        year: parseInt(metadata.date) || parseInt(metadata.year) || 0,
        genre: metadata.genre || metadata.subject || 'Unknown',
        publisher: metadata.publisher || 'Unknown Publisher',
        isbn: metadata.isbn || '',
        pageCount: parseInt(metadata.pages) || 0,
        language: metadata.language || 'English',
        description: metadata.description || metadata.summary || 'No description available',
        coverImage: this.generateCoverImageUrl(metadata.title || 'book'),
        matchedWords: [], // Will be populated based on search terms
        wordCount: parseInt(metadata.wordCount) || 0,
        document: result.document,
        metadata: metadata,
      };
    });
  }

  private generateCoverImageUrl(title: string): string {
    // Generate a placeholder image URL based on title
    const imageIds = [
      'photo-1481627834876-b7833e8f5570',
      'photo-1544716278-ca5e3f4abd8c',
      'photo-1507003211169-0a1dd7228f2d',
      'photo-1621351183012-e2f9972dd9bf',
      'photo-1532012197267-da84d127e765',
      'photo-1519682337058-a94d519337bc'
    ];
    
    const index = title.length % imageIds.length;
    return `https://images.unsplash.com/${imageIds[index]}?w=400&h=600&fit=crop`;
  }
}

export const queryEngineApi = new QueryEngineApiService();
