export default function ChatBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } w-full text-sm`}
    >
      <div
        className={`px-4 py-2 rounded-2xl max-w-[75%] ${
          isUser
            ? "bg-green-700 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        <p>{content}</p>
      </div>
    </div>
  );
}
