import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured.");
    return { statusCode: 500, body: JSON.stringify({ error: "API key is not configured." }) };
  }

  try {
    const { name, title, question } = JSON.parse(event.body || '{}');

    if (!name || !title || !question) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields: name, title, question." }),
      };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const userPrompt = `Based on the name "${name}" and the professional title "${title}", generate a short, witty, and professional answer to the following question: "${question}".`;

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
    
    const answer = text.trim().replace(/^"|"$/g, '');

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
      headers: { "Content-Type": "application/json" },
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "The AI suggestion service is currently unavailable. Please try again later." }),
    };
  }
};

export { handler };
