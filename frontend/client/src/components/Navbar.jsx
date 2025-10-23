"use client";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-12 py-3 bg-[#FAFCF1] ">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/Green_Logo.svg" // GreenLens logo
          alt="GreenLens Logo"
          width={324}
          height={82.13}
          className="object-contain"
        />
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-8 border border-[#112C23] rounded-[32px] px-8 py-2">
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
          <Link
            href="/development"
            className="text-[#112C23] text-base font-normal hover:underline underline-offset-4"
          >
            Development
          </Link>
          <Link
            href="/community"
            className="text-[#112C23] text-base font-normal hover:underline underline-offset-4"
          >
            Community
          </Link>
        </div>

        {/* Log Out Button */}
        <Link
          href="/login"
          className="bg-[#86EE92] text-[#112C23] text-base font-normal px-6 py-2 rounded-full hover:opacity-90 transition cursor-pointer inline-block text-center"
        >
          Log Out
        </Link>
      </div>
    </nav>
  );
}
