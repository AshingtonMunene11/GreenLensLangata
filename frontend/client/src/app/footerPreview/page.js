"use client";

import Footer from "../../components/Footer";

export default function FooterPreview() {
  return (
    <div className="flex flex-col min-h-screen justify-between bg-gray-100">
      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-2xl text-gray-700 font-semibold">Footer Preview Page</h1>
      </main>
      <Footer />
    </div>
  );
}
