import axios from 'axios';
import * as cheerio from 'cheerio';

export class WebScraperService {
  static async scrapeWebsite(url: string): Promise<string> {
    try {
      // Add https:// prefix if no protocol is specified
      const normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
      
      const response = await axios.get(normalizedUrl);
      const $ = cheerio.load(response.data);
      
      // Remove script tags, style tags, and HTML comments
      $('script').remove();
      $('style').remove();
      $('noscript').remove();
      
      // Get text from body, removing extra whitespace
      const text = $('body')
        .text()
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 2000); // Get first ~500 words (assuming average word length of 4 characters)
      
      return text;
    } catch (error: any) {
      console.error(`Error scraping website ${url}:`, error);
      throw new Error(`Failed to scrape website: ${error.message}`);
    }
  }
} 