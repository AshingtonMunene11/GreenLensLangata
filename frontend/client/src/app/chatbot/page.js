"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
  if (!input.trim()) return;

  const newMsg = { role: "user", content: input };
  setMessages((prev) => [...prev, newMsg]);
  setLoading(true);
  setInput("");

  try {
    // const res= http://localhost:5000/api/chat
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, language }),
    });

    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.response },
    ]);
  } catch (error) {
    console.error("Error sending message:", error);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Sorry, something went wrong." },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <Navbar />
      <main className="min-h-screen bg-[#f9f9f9] flex flex-col items-center px-4 py-6">
        <h1 className="text-2xl font-bold text-green-700 mb-2 text-center">
          Talk to our AI guide
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Ask questions about sustainability, climate change and more.
        </p>

        <div className="mb-4 w-full max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pick a language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-green-500"
          >
            <option>English</option>
            <option>Kiswahili</option>
            <option>French</option>
            <option>Arabic</option>
            <option>Amharic</option>
            <option>Zulu</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-md mb-6">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && <ChatBubble role="assistant" content="Typing..." />}
          <div ref={bottomRef} />
        </div>

        <div className="flex items-center gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Type something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border rounded px-3 py-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
