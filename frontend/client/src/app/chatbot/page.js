"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import ChatBubble from "../components/ChatBubble";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);


//   const handleSend = async () => {
//     const res = await fetch("http://localhost:8000/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message: input, language }),
//     });
//     const data = await res.json();
//     setResponse(data.response);
//   };
  const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [response, input]);
    
  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      // const res = await fetch("http://localhost:8000/chat",
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input, language }),
        });
        const data = await res.json();
        setResponse(data.response);
        setInput("")
    } catch (error) {
        console.error("Error sending message:", error);
        setResponse("Sorry, something went wrong. Try again later");
    } finally {
        setLoading(false);
    }
};

return (
  <div>
    <Navbar />
    <main className="min-h-screen bg-white flex flex-col items-center px-4 py-6">
      {/* <div className="chat-bubbles">
        {response && <ChatBubble role="assistant" content={response} />}
        {input && <ChatBubble role="user" content={input} />}
      </div> */}
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
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option>English</option>
          <option>Kiswahili</option>
          <option>French</option>
          <option>Arabic</option>
          <option>Twi</option>
          <option>Amharic</option>
          <option>Hausa</option>
          <option>Zulu</option>
        </select>
      </div>

      <div classname="flex flex-col gap-4 w-full max-w-md mb-6">
        {response && <ChatBubble role="Green Ai" content={response} />}
        {input && <ChatBubble role="user" content={input} />}
        {loading && <ChatBubble role="Green Ai" content="Green Ai is typing..." typing />} 
        {/* {loading && <ChatBubble role="Green Ai" content={<TypingDots />} />} */}
        <div ref={bottomRef} />
     </div>

    {/*
      <div className="chat-input">
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>English</option>
            <option>Kiswahili</option>
            <option>French</option>
            {/* More languages to be added za kenyan tribes*
            </select>
        </div>
    */}
    <div classname= "flex items-center gap-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {/* <button onClick={handleSend}>Send</button> */} 
        <button 
            onClick={handleSend} 
            disabled={!input.trim() || loading }
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
            {/* there is someadjusting needed to match figma`s design here on line below*/}
            {loading ? "Sending" : "Send"} 
        </button> 
      </div>
    </main>
    <Footer />
  </div>
  );
}
