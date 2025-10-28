"use client";

import { X } from "lucide-react";
import Image from "next/image";

export default function AuthPopup({ onClose, onSignIn, onSignUp }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0F2A21] rounded-3xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-[#86EE92]/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/70 hover:text-white transition"
          aria-label="Close popup"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
            <Image
              src="/favicon.ico"
              alt="GreenLens Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-white text-2xl font-semibold text-center mb-3">
          Join GreenLens Community
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-center mb-8 text-[15px]">
          Sign in to share your environmental stories, connect with others,
          and make a difference in Nairobi.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onSignIn}
            className="w-full bg-[#FFFFFF] text-[#112C23] border-2 border-[#112C23] font-semibold py-3.5 rounded-full hover:bg-[#86EE92] hover:text-[#0F2A21] transition text-[16px]"
          >
            Sign In
          </button>

          <button
            onClick={onSignUp}
            className="w-full bg-transparent border-2 border-[#86EE92] text-[#86EE92] hover:bg-[#86EE92] hover:text-[#0F2A21] font-semibold py-3.5 rounded-full transition text-[16px]"
          >
            Create Account
          </button>
        </div>

        {/* Terms and Conditions */}
        <p className="text-gray-400 text-xs text-center mt-6">
          By continuing, you agree to our{" "}
          <span className="text-[#86EE92] hover:underline cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-[#86EE92] hover:underline cursor-pointer">
            Privacy Policy.
          </span>          
        </p>
      </div>
    </div>
  );
}
