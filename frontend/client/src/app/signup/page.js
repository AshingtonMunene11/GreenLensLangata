"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AuthNavbar from "../../components/AuthNavbar";
import { Eye, EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Registering..."); // Feedback message while processing

    try {
      // const res = await fetch("http://127.0.0.1:5000/api/auth/register"
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      // if (res.ok) {
      //   setMessage("Registration successful!");
      //   console.log("Token:", data.token);

      //   // Redirect to login if signup iko sawa,
      //   window.location.href = "/login";

      if (res.ok) {
        toast.success("Registration successful!", {
          duration: 3000,
          position: "top-center",
        });

        // setMessage("Registration successful!");
        setFormData({ username: "", email: "", password: "" });
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage(
          `${data.message || "Signup Unsuccessful, Please try again."}`
        );
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
      {/* Ttoast messages */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="bg-[#112C23] p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        {/* <div className="animate-slide-in-right border border-red-500 bg-white"> */}
        <AuthNavbar />
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
        <h2 className="text-sm font-normal mb-6 text-center text-[22px]">
          Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl">
          <div>
            {/* <label htmlFor="email" className="block text-sm font-medium">Email</label> */}
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-white text-[#223D2E] placeholder-[#112C23] border border-[#223D2E] focus:ring-white focus:border-white"
              placeholder="Username"
              required
            />
          </div>
          <div>
            {/* <label htmlFor="email" className="block text-sm font-medium">Email</label> */}
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-white text-[#223D2E] placeholder-[#112C23] border border-[#223D2E] focus:ring-white focus:border-white"
              placeholder="Email"
              required
            />
          </div>
          <div className="relative">
            {/* <label htmlFor="password" className="block text-sm font-medium">Password</label> */}
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-white text-[#223D2E] placeholder-[#112C23] border border-[#223D2E] focus:ring-white focus:border-white pr-10"
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
            <label className="flex items-center space-x-2">
              <input type="checkbox" required />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="text-white underline">
                  Terms & Conditions
                </Link>
              </span>
            </label>
            {/* <a href="#" className="text-sm underline">Forgot Password?</a> */}
          </div>
          <div className="flex justify-center">
            {/* <button
                type="submit"
                className="w-1/2 bg-white text-[#223D2E] py-2 px-4 rounded-full hover:bg-gray-100 transition"
            >
                Sign Up
            </button> */}
            <button
              type="submit"
              disabled={message === "Registering..."}
              className={`w-1/2 py-2 px-4 rounded-full transition ${
                message === "Registering..."
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-white text-[#223D2E] hover:bg-gray-100"
              }`}
            >
              {message === "Registering..." ? "Please wait..." : "Sign Up"}
            </button>
          </div>
        </form>
        {/* Feedback Message, to get you back info whether the backend accepts the registration or if itakushow kama it fails*/}
        {/* {message && (
          <p className="mt-4 text-center text-sm font-medium">{message}</p>
        )} */}
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
          Already have an account? <a href="#" className="underline">Sign in</a>
        </p> */}
        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            {" "}
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
