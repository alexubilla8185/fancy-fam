import { GoogleGenAI } from "@google/genai";

/**
 * Generates a fun fact answer using the Gemini API.
 * @param name The user's full name.
 * @param title The user's professional title.
 * @param question The fun fact question to be answered.
 * @returns A promise that resolves to the generated answer string.
 */
export const generateFunFactAnswer = async (name: string, title: string, question: string): Promise<string> => {
    // The API key is accessed via process.env.API_KEY, which is handled by the execution environment (e.g., Netlify).
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const userPrompt = `Based on the name "${name}" and the professional title "${title}", generate a short, witty, and professional answer to the following question: "${question}".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: "You are a creative assistant for a digital business card app. Your goal is to write concise, engaging, and professional-sounding 'fun fact' answers. The answer should be a maximum of two sentences.",
                temperature: 0.8,
                topK: 64,
                topP: 0.95,
            },
        });
        
        const text = response.text;

        if (!text) {
            throw new Error("Received an empty response from the AI.");
        }

        // Clean up potential markdown like quotes
        return text.trim().replace(/^"|"$/g, '');

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("The AI suggestion service is currently unavailable. Please try again later.");
    }
};
