import OpenAI from 'openai';
import { config } from '../config';

export class LLMService {
  private static openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY
  });

  static async generateCompanyDescription(
    companyName: string,
    websiteContent: string
  ): Promise<string> {
    try {
      const prompt = `Generate a concise and professional description (2-3 sentences) for the company "${companyName}" based on the following website content. Focus on what the company does, their main products/services, and their value proposition:\n\n${websiteContent}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional business analyst who creates concise and accurate company descriptions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return response.choices[0].message.content || '';
    // return "test";
    } catch (error) {
      console.error('Error generating company description:', error);
      throw new Error('Failed to generate company description');
    }
  }
} 