
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDatingAdvice = async (query: string): Promise<{ text: string; sources: any[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: "You are a professional dating coach named Spark. Provide empathetic, modern, and practical dating advice. Use Google Search to find current trends and psychological insights. Always stay positive and encouraging.",
        tools: [{ googleSearch: {} }],
      },
    });

    return {
      text: response.text || "I'm having trouble thinking of advice right now. Try again later!",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Error connecting to Spark AI Coach.", sources: [] };
  }
};

export const startMockDate = async (userInput: string, chatHistory: any[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: "You are practicing a mock date with the user. You are a 28-year-old creative designer named Maya. You are friendly, slightly witty, and enjoy talking about travel, food, and art. Respond as if we are on a first date at a cozy cafe. Keep the conversation flowing and occasionally ask follow-up questions.",
        thinkingConfig: { thinkingBudget: 100 },
      },
    });
    return response.text || "Maya is lost for words...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The mock date was interrupted by a technical glitch.";
  }
};

export const generateMatchmakingAnalysis = async (userProfile: string, matchProfiles: string[]): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze compatibility between this user: ${userProfile} and these potential matches: ${matchProfiles.join(', ')}. Provide a brief summary of why the top match is the best choice.`,
        config: {
          systemInstruction: "You are a high-end matchmaker. Analyze interests, values, and personality traits to find the best match.",
        },
      });
      return response.text || "Analysis complete. You have some great options!";
    } catch (error) {
      return "Matchmaking AI is recalibrating...";
    }
}
