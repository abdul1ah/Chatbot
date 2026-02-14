// src/services/ai.js

export const sendMessageToAI = async (userMessage, industry = "General") => {
  // Simulate a short 800ms "thinking" delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const input = userMessage.toLowerCase();

  // 1. Logic for Human Escalation (Project Requirement)
  if (input.includes("admin") || input.includes("human") || input.includes("help") || input.includes("support")) {
    return "FALLBACK_TRIGGER";
  }

  // 2. Logic for Industry-Specific Responses (Project Requirement)
  if (industry === "Real Estate") {
    if (input.includes("price")) return "Our properties range from $200k to $1.5M. Would you like a catalog?";
    return "I can help you find your dream home. Are you looking for an apartment or a house?";
  }

  // 3. Default Response
  return `[Local AI] I received your message: "${userMessage}". How else can I assist you today?`;
};