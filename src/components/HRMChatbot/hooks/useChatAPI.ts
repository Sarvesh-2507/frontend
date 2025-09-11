import { useState } from "react";

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: number;
}

// Mocked API call for now
async function fetchChatbotResponse(message: string): Promise<string> {
  // Replace with real API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        `You said: "${message}". (This is a mock response. Integrate with your backend API here.)`
      );
    }, 800);
  });
}

export function useChatAPI() {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string): Promise<string> => {
    setLoading(true);
    const response = await fetchChatbotResponse(message);
    setLoading(false);
    return response;
  };

  return { sendMessage, loading };
}
