import Image from "next/image";

export default function Login() {
  return (
    // Replace with your image path
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url(/backgroundsample1.png)' }}
    >
      <div className="bg-[#223D2E] p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        <div className="flex justify-center mb-4">
        <Image
                        src="/White Logo.svg"
                        alt="GreenLens Logo"
                        width={300}
                        height={80}
            /></div>
        <h2 className="text-m font-bold mb-6 text-center">Login</h2>

        <form className="space-y-4 rounded-2xl">
          <div>
            {/* <label htmlFor="email" className="block text-sm font-medium">Email</label> */}
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-white text-[#223D2E] border border-[#223D2E] focus:ring-white focus:border-white"
              placeholder="Email"
            />
          </div>

          <div>
            {/* <label htmlFor="password" className="block text-sm font-medium">Password</label> */}
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 rounded-xl bg-white text-[#223D2E] border border-[#223D2E] focus:ring-white focus:border-white"
              placeholder="Password"
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
                className="w-1/2 bg-white text-[#223D2E] py-2 px-4 rounded-full hover:bg-gray-100 transition"
            >
                Sign In
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm">
          Don't have an account? <a href="#" className="underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
