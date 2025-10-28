"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FloatingChatButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/chat")}
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:scale-105 transition-transform"
    >
      <Image
        src="/figmaAIicon.svg" 
        alt="Chat with GreenLens AI"
        width={100}
        height={100}
        className="rounded-full"
      />
    </button>
  );
}



// "use client";
// import { useRouter } from "next/navigation";
// import { MessageCircle } from "lucide-react";

// export default function FloatingChatButton() {
//   const router = useRouter();

//   return (
//     <button
//       onClick={() => router.push("/chatbot")}
//       className="fixed bottom-6 right-6 bg-green-700 text-white p-4 rounded-full shadow-lg hover:bg-green-800"
//     >
//       <MessageCircle size={28} />
//     </button>
//   );
// }
