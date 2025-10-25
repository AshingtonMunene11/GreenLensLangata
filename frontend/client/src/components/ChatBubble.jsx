function TypingDots() {
  return (
    <span className="flex gap-1 text-gray-400 italic animate-pulse">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  );
}

// export default function ChatBubble({ role, content, typing = false }) {
//   return (
//     <div className={`bubble ${role}`}>
//       {typing ? (
//         <TypingDots />
//       ) : (
//         <span>{content}</span>
//       )}
//     </div>
//   );
// }

export default function ChatBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div
      className={`p-3 rounded-lg max-w-[80%] ${
        isUser ? "bg-gray-200 self-end text-right" : "bg-green-100 self-start text-left"
      }`}
    >
      <p className="text-sm">{content}</p>
    </div>
  );
}


// export default function ChatBubble({ role, content }: { role: string; content: string }) {
//   const isUser = role === "user";
//   return (
//     <div className={`bubble ${isUser ? "right" : "left"}`}>
//       <p>{content}</p>
//     </div>
//   );
// }
