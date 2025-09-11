import React, { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useVoiceInput } from "./hooks/useVoiceInput";
import { useChatbotNavigation } from "./hooks/useChatbotNavigation";
import { useChatAPI, ChatMessage } from "./hooks/useChatAPI";

const BOT_AVATAR = "/mh_cognition_logo-removebg-preview.png";
const USER_AVATAR = "/vite.svg";

export const HRMChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [transcript, setTranscript] = useState("");
  const { listening, startListening, stopListening } = useVoiceInput((text) => setTranscript(text));
  const { handleNavigation } = useChatbotNavigation();
  const { sendMessage, loading } = useChatAPI();

  // Scroll to bottom on new message
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);


  // Handle voice transcript
  React.useEffect(() => {
    if (transcript && !listening) {
      setInput(transcript);
      setTranscript("");
    }
  }, [transcript, listening]);

  const handleSend = async (msg?: string) => {
    const text = (msg ?? input).trim();
    if (!text) return;
    setMessages((prev) => [...prev, { sender: "user", text, timestamp: Date.now() }]);
    setInput("");
    setTranscript("");


    // Navigation intent
    const navPath = handleNavigation(text);
    if (navPath) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Navigating to ${navPath}...`, timestamp: Date.now() },
      ]);
      return;
    }

    // Query API
    const response = await sendMessage(text);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: response, timestamp: Date.now() },
    ]);
  // No voice output
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Chatbot"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <path d="M12 3C7.03 3 3 6.58 3 11c0 1.97.81 3.77 2.19 5.19L3 21l4.81-2.19C9.23 20.19 10.97 21 13 21c4.97 0 9-3.58 9-8s-4.03-8-9-8z" fill="currentColor"/>
        </svg>
      </button>

      {/* Chatbot Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-full bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white">
              <img src={BOT_AVATAR} alt="Bot" className="w-8 h-8 rounded-full" />
              <span className="font-semibold">HRM Assistant</span>
              <button
                className="ml-auto text-white hover:text-gray-200"
                onClick={() => setOpen(false)}
                aria-label="Close Chatbot"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 px-4 py-3 overflow-y-auto bg-gray-50 max-h-[400px]">
              {messages.length === 0 && (
                <div className="text-gray-400 text-center mt-10">How can I help you today?</div>
              )}
              {messages.map((msg, idx) => (
                <div key={msg.timestamp + idx} className={`flex mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" && (
                    <img src={BOT_AVATAR} alt="Bot" className="w-7 h-7 rounded-full mr-2 self-end" />
                  )}
                  <div className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${msg.sender === "user" ? "bg-blue-100 text-blue-900" : "bg-white border border-gray-200 text-gray-800"}`}>
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <img src={USER_AVATAR} alt="You" className="w-7 h-7 rounded-full ml-2 self-end" />
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form
              className="flex items-center gap-2 px-4 py-3 border-t bg-white"
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
            >
              <button
                type="button"
                className={`p-2 rounded-full ${listening ? "bg-blue-100" : "bg-gray-100"} hover:bg-blue-200 transition-colors`}
                onClick={listening ? stopListening : startListening}
                aria-label={listening ? "Stop Listening" : "Start Voice Input"}
              >
                {listening ? (
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#2563eb" />
                    <rect x="9" y="9" width="6" height="6" rx="1" fill="#fff" />
                  </svg>
                ) : (
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#e0e7ff" />
                    <path d="M12 17a4 4 0 004-4V9a4 4 0 10-8 0v4a4 4 0 004 4z" fill="#2563eb" />
                  </svg>
                )}
              </button>
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                autoFocus={open}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-60"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <svg className="animate-spin" width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" opacity="0.2" />
                    <path d="M12 2a10 10 0 018.66 5.01" stroke="#fff" strokeWidth="4" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M2 21l21-9-21-9v7l15 2-15 2v7z" fill="currentColor"/>
                  </svg>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
