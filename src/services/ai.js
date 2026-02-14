import { GoogleGenerativeAI } from "@google/generative-ai";
import configData from '../utils/config.json';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const sendMessageToAI = async (userMessage, industryName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const industry = configData.industries[industryName];

    const systemInstruction = `
      You are ${industry.botName}, a world-class AI assistant specializing in ${industryName}.
      TONE: Professional, empathetic, and concise. 
      CONTEXT: ${industry.context}.
      
      RULES:
      1. If the user expresses interest in booking, pricing, or complex help, say ONLY: FALLBACK_TRIGGER.
      2. If you don't know an answer, say ONLY: FALLBACK_TRIGGER.
      3. Do not mention you are an AI unless specifically asked.
      4. Use industry-specific terms (e.g., 'escrow' for Real Estate, 'triage' for Healthcare).
    `;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Acknowledged. I am ready to assist as " + industry.botName }] },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having a brief connection issue. One moment!";
  }
};