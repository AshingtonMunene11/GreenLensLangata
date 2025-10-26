"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthNavbar from "../../components/AuthNavbar";
import { Eye, EyeOff } from "lucide-react";
import { UserContext } from "@/context/UserContext";


export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // useEffect(() => {
  // const token = localStorage.getItem("token");
  // if (token) {
  //   router.push("/");
  // }}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      // const res = await fetch("http://127.0.0.1:5000/api/auth/login"
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        // where the token iko stored
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // Hapa ndo nimeadd User info ikuwe stored

        setUser(data.user); // to update the logged-in user info

        setMessage("Login successful!");
        setTimeout(() => router.push("/"), 1500);     //redirect to our landing page after use amelogin after signup
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
      style={{ backgroundImage: "url(/backgroundsample1.png)" }}
    >
      <div className="bg-[#112C23] p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        {/* <div className="animate-slide-in-right border border-red-500 bg-white"> */}
        <div className="fixed top-0 left-0 w-full z-50 bg-transparent text-white">
          <AuthNavbar />
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
        <h2 className="text-m font-normal mb-6 text-center text-[22px]">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl">
          <div>
            {/* <label htmlFor="email" className="block text-sm font-medium">Email</label> */}
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-white text-[#112C23] placeholder-[#112C23] border border-[#223D2E] focus:ring-white focus:border-white"
              placeholder="Email"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-white text-[#112C23] placeholder-[#112C23] border border-[#223D2E] focus:ring-white focus:border-white"
              placeholder="Password"
              required
            />

            {/* Toggle eye icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#112C23] hover:text-[#112C23] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-3 w-3 text-white focus:ring-white border-white rounded"
              />
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
              {message === "Logging in..." ? "Please wait..." : "Sign In"}
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
          Don't have an account?{" "}
          <Link href="/signup" className="underline">
            {" "}
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
