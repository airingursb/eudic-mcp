/**
 * Eudic API client
 */

import { EudicConfig } from './config.js';

export interface SaveWordRequest {
  word: string;
  language?: string;
  star?: number;
  context_line?: string;
  category_ids?: number[];
}

export interface SaveWordResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export interface WordItem {
  word: string;
  exp?: string;
  add_time: string;
  star: number;
  context_line?: string;
}

export interface GetWordsResponse {
  data: WordItem[];
  message: string;
}

export class EudicClient {
  constructor(private config: EudicConfig) {}

  async saveWord(request: SaveWordRequest): Promise<SaveWordResponse> {
    const payload = {
      language: request.language || 'en',
      word: request.word,
      star: request.star || 2,
      category_ids: request.category_ids || [0],
      ...(request.context_line && { context_line: request.context_line })
    };

    const headers = {
      'User-Agent': this.config.userAgent,
      'Authorization': this.config.authorizationToken,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(
        `${this.config.apiBaseUrl}/api/open/v1/studylist/word/`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`Failed to save word: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getWordsList(
    language: string = 'en',
    categoryId: number = 0,
    page: number = 1,
    pageSize: number = 20
  ): Promise<string[]> {
    const headers = {
      'User-Agent': this.config.userAgent,
      'Authorization': this.config.authorizationToken,
    };

    try {
      const url = new URL(`${this.config.apiBaseUrl}/api/open/v1/studylist/words/0`);
      url.searchParams.set('language', language);
      url.searchParams.set('category_id', categoryId.toString());
      url.searchParams.set('page', page.toString());
      url.searchParams.set('page_size', pageSize.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GetWordsResponse = await response.json();
      
      // Return array of words only
      return result.data.map(item => item.word);
    } catch (error) {
      throw new Error(`Failed to get words list: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}