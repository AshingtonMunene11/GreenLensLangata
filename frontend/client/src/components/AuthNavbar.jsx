"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AuthNavbar() {
  const pathname = usePathname(); 

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-16 py-4 bg-transparent">
      <div className="flex items-center">
        <Image
          src="/White Logo.svg"
          alt="GreenLens Logo"
          width={324}
          height={82.13}
          className="object-contain"
        />
      </div>

      {/* AuthNav Links */}
      <div className="flex items-center gap-14">
        <Link
          href="/"
          className="text-[#FFFFFF] text-base font-normal hover:underline underline-offset-4 transition"
        >
          Home
        </Link>
        <Link
          href="/explore"
          className="text-[#FFFFFF] text-base font-normal hover:underline underline-offset-4 transition"
        >
          Explore
        </Link>
        <Link
          href="/community"
          className="text-[#FFFFFF] text-base font-normal hover:underline underline-offset-4 transition"
        >
          Community
        </Link>

        {/* Auth Button */}
        
        {pathname !== "/login" && (
          <Link
            href="/login"
            className="text-[#FFFFFF] text-base font-normal hover:underline underline-offset-4 transition"
          >
            Log In
          </Link>
        )}
        
        {pathname !== "/signup" && (
          <Link
            href="/signup"
            className="text-[#FFFFFF] text-base font-normal hover:underline underline-offset-4 transition"
          >
            Sign Up
          </Link>
        )}
      </div>
    </nav>
  );
}
