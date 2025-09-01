import { GoogleGenAI, Type } from "@google/genai";
import { CardData } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFunFactsFromCardData = async (cardData: CardData) => {
    try {
        const { name, title, website } = cardData;

        const prompt = `
            Generate two short, witty, and professional 'fun facts' for a digital business card.
            The person's name is ${name} and their title is "${title}".
            Their website is ${website}, which might give you more context about their work.
            Each fact should have a question and a short, engaging answer.
            Make them sound human and interesting.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING, description: 'The fun fact question.' },
                            answer: { type: Type.STRING, description: 'The fun fact answer.' },
                        },
                        required: ['question', 'answer'],
                    },
                },
            },
        });

        const result = JSON.parse(response.text);
        // Basic validation to ensure we get the expected format
        if (Array.isArray(result) && result.length > 0 && result[0].question && result[0].answer) {
            return result;
        }
        throw new Error("Invalid response format from AI.");

    } catch (error) {
        console.error("Error generating fun facts from Gemini:", error);
        throw new Error("Failed to generate fun facts. Please try again.");
    }
};