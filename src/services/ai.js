import { GoogleGenerativeAI } from "@google/generative-ai";
import configData from '../utils/config.json';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const sendMessageToAI = async (userMessage, industryName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const industry = configData.industries[industryName];

    const systemInstruction = `
      You are ${industry.botName}, an expert in ${industryName}.
      
      RULES:
      1. Keep answers concise (max 2 sentences).
      2. If user asks for specific prices, booking, or human help, return ONLY: "FALLBACK_TRIGGER".
      3. OTHERWISE, format your response exactly like this:
         [Your Answer Here] ||| [Option1], [Option2], [Option3]
      
      EXAMPLE RESPONSE:
      "A fixed-rate mortgage offers stability. ||| Current Rates, Variable Options, Apply Now"
    `;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Understood." }] },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting. ||| Try again, Contact Support";
  }
};