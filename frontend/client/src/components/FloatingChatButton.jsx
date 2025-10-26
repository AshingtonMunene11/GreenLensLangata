"use client";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

export default function FloatingChatButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/chatbot")}
      className="fixed bottom-6 right-6 bg-green-700 text-white p-4 rounded-full shadow-lg hover:bg-green-800"
    >
      <MessageCircle size={28} />
    </button>
  );
}
