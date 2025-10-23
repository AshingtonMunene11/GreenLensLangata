"use client";

import Link from "next/link";
import { Facebook, Twitter, Youtube, Linkedin } from "lucide-react";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="bg-[#0D2B24] text-gray-300 py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
    
        <div className="flex flex-col space-y-3">
          <Link href="#" className="text-sm text-white hover:underline hover:decoration-green-300 transition">
                Back to top
          </Link>
          <Link href="/" className="text-2xl font-semibold text-white flex items-center gap-2">
            {/* Placeholder for logo (you can replace with <Image />) */}
            {/* <span className="font-bold">🌿</span> GreenLens */}
            <Image
                src="/White Logo.svg"
                alt="GreenLens Logo"
                width={500}
                height={110}
                // className="object-contain rounded-full"
                />
          </Link>
        
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3 underline underline-offset-4 hover:decoration-green-300 transition">Quick Links</h3>
          <ul className="space-y-1 text-sm mb-6">
            <li>
              <Link href="/" className="hover:text-green-400 transition">Home</Link>
            </li>
            <li>
              <Link href="/explore" className="hover:text-green-400 transition">Explore</Link>
            </li>
            <li>
              <Link href="/community" className="hover:text-green-400 transition">Community</Link>
            </li>
          </ul>
          <p className="text-sm text-gray-400 mt-6">
            Copyright © {new Date().getFullYear()} &nbsp; 
            <Link href="#" className="hover:text-green-400">Privacy</Link> · 
            <Link href="#" className="hover:text-green-400"> Terms</Link>
          </p>
        </div>

        
        <div className="flex flex-col space-y-3 mt-32">
          {/*we had the copyright hapa*/}
          <div className="flex gap-4">
            <Link href="#" target="_blank" className="hover:text-green-400"><Facebook size={20} /></Link>
            <Link href="https://www.youtube.com/watch?v=A6hoKAjRpTg" target="_blank" rel="GG" className="hover:text-green-400"><Youtube size={20} /></Link>
            {/* <Link href="#" className="hover:text-green-400"><Youtube size={20} /></Link> */}
            <Link href="#" className="hover:text-green-400"><Twitter size={20} /></Link>
            <Link href="#" className="hover:text-green-400"><Linkedin size={20} /></Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
