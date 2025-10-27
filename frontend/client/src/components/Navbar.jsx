"use client";
import Link from "next/link";
import Image from "next/image";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import AuthPopup from "../components/AuthPopup";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-12 py-3 bg-[#FAFCF1]">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/Green_Logo.svg"
            alt="GreenLens Logo"
            width={324}
            height={82.13}
            className="object-contain"
          />
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-8 border border-[#112C23] rounded-2xl px-8 py-2">
            <Link
              href="/"
              className="text-[#112C23] text-base font-normal hover:underline underline-offset-4"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="text-[#112C23] text-base font-normal hover:underline underline-offset-4"
            >
              Explore
            </Link>
            {user && (
              <Link
                href="/development"
                className="text-[#112C23] text-base font-normal hover:underline underline-offset-4"
              >
                Development
              </Link>
            )}
            <Link
              href="/community"
              className="text-[#112C23] text-base font-normal hover:underline underline-offset-4"
            >
              Community
            </Link>
          </div>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={logout}
              className="bg-[#86EE92] text-[#112C23] text-base font-normal px-6 py-2 rounded-full hover:opacity-90 transition cursor-pointer inline-block text-center"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => setShowAuthPopup(true)}
              className="bg-[#86EE92] text-[#112C23] text-base font-normal px-6 py-2 rounded-full hover:opacity-90 transition cursor-pointer inline-block text-center"
            >
              Get Started
            </button>
          )}
        </div>
      </nav>

      {/* Auth Popup */}
      {showAuthPopup && (
        <AuthPopup
          onClose={() => setShowAuthPopup(false)}
          onSignIn={() => (window.location.href = "/login")}
          onSignUp={() => (window.location.href = "/signup")}
        />
      )}
    </>
  );
}
