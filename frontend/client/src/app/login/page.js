"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar2 from "../../components/Navbar2";
// import Navbar from "../../components/Navbar";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        // where the token iko stored
        localStorage.setItem("token", data.token);
        setMessage("Login successful!");
        setTimeout(() => router.push("/"), 1500);     //AKUMU`s work here is where we`ll redirect
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      setMessage("Server error. Please try again later.");
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/backgroundsample1.png)' }}
    >
      <div className="bg-[#223D2E] p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        {/* <div className="animate-slide-in-right border border-red-500 bg-white"> */}
        <div className="fixed top-0 left-0 w-full z-50 bg-transparent text-white">
            <Navbar2 />
          </div>
            <div className="flex justify-center mb-4">
                <div className="animate-slide-in-right">
                    <Image
                        src="/White Logo.svg"
                        alt="GreenLens Logo"
                        width={300}
                        height={80}
                    />
                </div>
            </div>
        {/* </div> */}
        <h2 className="text-m font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl">
          <div>
            {/* <label htmlFor="email" className="block text-sm font-medium">Email</label> */}
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-white text-[#223D2E] border border-[#223D2E] focus:ring-white focus:border-white"
              placeholder="Email"
              required
            />
          </div>

          <div>
            {/* <label htmlFor="password" className="block text-sm font-medium">Password</label> */}
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-white text-[#223D2E] border border-[#223D2E] focus:ring-white focus:border-white"
              placeholder="Password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-white focus:ring-white border-white rounded" />
              <span className="ml-2 text-sm">Remember Me</span>
            </label>
            {/* <a href="#" className="text-sm underline">Forgot Password?</a> */}
          </div>
         <div className="flex justify-center">
          <button
              type="submit"
              disabled={message === "Logging in..."}
              className={`w-1/2 py-2 px-4 rounded-full transition ${
                message === "Logging in..."
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-white text-[#223D2E] hover:bg-gray-100"
              }`}
            >
              {message === "Logging in..." ? "Please wait..." : "Login"}
          </button>
            {/* <button
                type="submit"
                disabled={message === "Logging in..."}
                className= {"w-1/2 bg-white text-[#223D2E] py-2 px-4 rounded-full hover:bg-gray-100 transition" ${
                message === "Logging in..."
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-white text-[#223D2E] hover:bg-gray-100"
              }`}
            >
              {message === "Logging in..." ? "Please wait..." : "Login"}
            </button> */}
          </div>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.toLowerCase().includes("success")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
        {/* <p className="mt-6 text-center text-sm">
          Don't have an account? <a href="#" className="underline">Sign up</a>
        </p> */}
        <p className="mt-6 text-center text-sm">
            Don't have an account? {" "}
            <Link href="/signup" className="underline"> Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
