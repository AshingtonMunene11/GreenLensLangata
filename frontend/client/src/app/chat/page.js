"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ChatPage() {
  const [language, setLanguage] = useState("English");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Jambo! I’m your GreenLens AI." },
    { role: "assistant", content: "We can jump to climate change talk. I’d also love to explore Green Lens’ solutions and share how we help you track your environment." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, language }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong." }]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
     <div className="flex flex-col min-h-screen bg-[#f7fdf9]">
      {/* Navbar fixed at top */}
      <Navbar />

      {/* Main content */}
      <div className="flex-grow flex flex-col items-center justify-start px-4 pt-24 pb-10">
        {/* Heading */}
        <div className="max-w-xl w-full text-center mb-6">
          <h1 className="flex justify-center text-green-800 text-2xl font-semibold mb-2">
            Talk to our AI guide
          </h1>
          <p className="text-sm text-gray-700">
            Ask questions about sustainability, climate change, and more.
          </p>
        </div>

        {/* Language selection */}
        <div className="flex justify-between items-center mb-4 w-full max-w-md">
          <p className="text-black text-sm px-2">Select Language</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-green-300 rounded-full px-3 py-1 bg-[#112C23] text-white text-sm focus:ring-2 focus:ring-green-400"
          >
               <option hidden disabled selected value="">Select an option</option>
               <option>English</option>
               <option>Kiswahili</option>
               <option>French</option>      
               <option>Luhya</option>
               <option>Kalenjin</option>
               <option>Kikuyu</option>
               <option>Kisii</option>
               <option>Kamba</option>
               <option>Somali</option>
               <option>Maasai</option>
               <option>Embu</option>
            {/* <option>English</option>
            <option>Kiswahili</option>
            <option>Sheng</option>
            <option>Luhya</option>
            <option>Kikuyu</option>
            <option>Kamba</option>
            <option>Meru</option>
            <option>Embu</option>
            <option>Kisii</option>
            <option>Kuria</option>
            <option>Suba</option>
            <option>Taita</option>
            <option>Luo</option>
            <option>Kalenjin</option>
            <option>Maasai</option>
            <option>Turkana</option>
            <option>Samburu</option>
            <option>Teso</option>
            <option>Njemps</option>
            <option>Somali</option>
            <option>Borana</option>
            <option>Rendille</option>
            <option>Orma</option>
            <option>Dahalo</option>
            <option>Digo</option>
            <option>Giriama</option>
            <option>Pokomo</option>
            <option>Tharaka</option>
            <option>Taveta</option>
            <option>El Molo</option>
            <option>Yaaku</option>
            <option>Duruma</option>
            <option>Boni</option>
            <option>Suba-Simba</option>
            <option>Terik</option>
            <option>Okiek</option>
            <option>Ogiek</option>
            <option>Sengwer</option> */}
          </select>
        </div>

        {/* Chat container */}
        <div className="w-full max-w-2xl bg-white shadow-md rounded-xl border border-green-200 p-4 flex flex-col h-[75vh]">
          <div className="flex-1 overflow-y-auto space-y-4 p-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                    msg.role === "user"
                      ? "bg-[#112C23] text-white rounded-br-none"
                      : "bg-green-100 text-green-900 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-green-100 text-green-900 px-4 py-2 rounded-2xl rounded-bl-none animate-pulse">
                  Green AI is typing...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex mt-4">
            <input
              type="text"
              placeholder="What’s on your mind..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-grow border text-black border-green-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-[#112C23] text-white px-6 py-2 rounded-r-full hover:bg-green-800 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
