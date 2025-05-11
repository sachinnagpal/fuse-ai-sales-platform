import { generateText } from "ai";
import { openai } from "@ai-sdk/openai"; // or another provider if you want

export class LLMService {
  static async generateCompanyDescription(
    companyName: string,
    websiteContent: string
  ): Promise<string> {
    try {
      const prompt = `Generate a concise and professional description (2-3 sentences) for the company "${companyName}" based on the following website content. Focus on what the company does, their main products/services, and their value proposition:\n\n${websiteContent}`;
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        prompt,
        maxTokens: 150,
        temperature: 0.7,
      });

      return text;
    } catch (error) {
      console.error("Error generating company description:", error);
      throw new Error("Failed to generate company description");
    }
  }
}
