import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFunFactsFromTitle = async (title: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate two short, witty, and professional 'fun facts' for a digital card for a "${title}". Each fact should have a question and a short answer.`,
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

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error generating fun facts from Gemini:", error);
        throw new Error("Failed to generate fun facts. Please try again.");
    }
};