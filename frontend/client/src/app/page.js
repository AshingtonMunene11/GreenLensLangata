"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import "./globals.css";
import { PieChart, Pie, Cell } from "recharts";

export default function HomePage() {
  // Pie chart data
  const data = [
    { name: "Tree Cover", value: 21.3, color: "#1ba655" },
    { name: "Built-Up", value: 23, color: "#C49A6C" },
    { name: "Grass Land", value: 30.7, color: "#5daa87" },
    { name: "Water Cover", value: 0.6, color: "#1b69a6" },
    { name: "Other", value: 24.4, color: "#8e9eab" },
  ];

  return (
    <main className="bg-[#FAFCF1] min-h-screen text-[#112C23] font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-center">
        <img
          src="/home_image.svg"
          alt="Hero background"
          className="w-full h-[735px] object-cover"
        />
        <div className="absolute inset-0 bg-black/16"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="font-semibold text-[90px] leading-[1.1] max-w-[1367px] text-white">
            JOIN A MISSION <br /> MAKE A CHANGE
          </h1>
        </div>

        {/* Animated Scroll Button */}
        <button
          onClick={() => {
            document.getElementById("community-posts")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="absolute bottom-8 bg-[#1a4235] rounded-2xl p-4 hover:bg-[#112C23] transition-colors animate-bounce-slow cursor-pointer"
          aria-label="Scroll to community posts"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </section>

      {/* Mission Section */}
      <section className="max-w-[1100px] mx-auto py-20 text-left">
        <p className="text-[22px] leading-relaxed font-normal text-[#112C23] mb-4 text-left">
          Our app uses satellite imagery and AI insights to reveal how land use
          is changing, helping residents, developers, and planners make more
          sustainable decisions.
          <br />
          Together, we can build a smarter, greener Nairobi for the future.
        </p>
      </section>

      {/* Community Posts */}
      <section id="community-posts" className="max-w-[1200px] mx-auto px-6 py-16">
        <h2 className="text-[36px] font-medium mb-10 text-left">
          View community posts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Community Card 1 */}
          <div className="bg-[#DEDEDE] rounded-2xl overflow-hidden shadow-md flex flex-col">
            <div className="w-full px-4 mt-4">
              <img
                src="/forest_home.svg"
                alt="Forests"
                className="w-full h-[210px] object-cover rounded-2xl"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-[22px] font-semibold mb-2">
                Forests Under Silent Siege
              </h3>
              <p className="text-[16px] mb-2 flex-1">
                Beneath the canopy, a quiet crisis brews. forests once...
              </p>
              <p className="text-[14px] mb-4 font-medium text-[#112C23]">
                By Igamba Dais
              </p>
              <Link href="/community">
                <button className="bg-[#ffffff] text-[#515151] text-[16px] font-medium w-[140px] py-2 rounded-full hover:opacity-90 transition cursor-pointer">
                  Read More
                </button>
              </Link>
            </div>
          </div>

          {/* Community Card 2 */}
          <div className="bg-[#DEDEDE] rounded-2xl overflow-hidden shadow-md flex flex-col">
            <div className="w-full px-4 mt-4">
              <img
                src="/ngong_home.svg"
                alt="Ngong River"
                className="w-full h-[200px] object-cover rounded-2xl"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-[22px] font-semibold mb-2">
                Ngong River: Illegal Dumping
              </h3>
              <p className="text-[16px] mb-2 flex-1">
                Once a lifeline for ecosystem, Ngong River is now choking...
              </p>
              <p className="text-[14px] mb-4 font-medium text-[#112C23]">
                By Johnstone Kamau
              </p>
              <Link href="/community">
                <button className="bg-[#ffffff] text-[#515151] text-[16px] font-medium w-[140px] py-2 rounded-full hover:opacity-90 transition cursor-pointer">
                  Read More
                </button>
              </Link>
            </div>
          </div>

          {/* Community Card 3 */}
          <div className="bg-[#DEDEDE] rounded-2xl overflow-hidden shadow-md flex flex-col">
            <div className="w-full px-4 mt-4">
              <img
                src="/nairobi_home.svg"
                alt="Urban Nature Revival"
                className="w-full h-[200px] object-cover rounded-2xl"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-[20px] font-semibold mb-2">
                Nairobi's Urban Nature Revival
              </h3>
              <p className="text-[16px] mb-2 flex-1">
                Beneath the canopy, a quiet crisis brews. forests once...
              </p>
              <p className="text-[14px] mb-4 font-medium text-[#112C23]">
                By Mulili Makaleli
              </p>
              <Link href="/community">
                <button className="bg-[#ffffff] text-[#515151] text-[16px] font-medium w-[140px] py-2 rounded-full hover:opacity-90 transition cursor-pointer">
                  Read More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Area Coverage Insights */}
      <section className="max-w-[1200px] mx-auto px-6 pb-20">
        <h2 className="text-[36px] font-medium mb-10 text-left text-[#112C23]">
          Get area coverage insights
        </h2>

        <div className="bg-[#112C23] text-white rounded-[25px] p-8 flex flex-col relative">
          {/* Explore button */}
          <Link href="/explore">
            <button className="absolute top-6 right-6 bg-white text-[#112C23] rounded-full px-6 py-1.5 font-semibold text-[12px] md:text-[14px] hover:bg-gray-200 transition cursor-pointer">
              EXPLORE
            </button>
          </Link>

          {/* Title  */}
          <div className="absolute top-6 left-8">
            <h3 className="text-[22px] md:text-[24px] font-light">
              Nairobi Coverage Analysis
            </h3>
            <div className="inline-block border border-[#FFFFFF] rounded-full px-2 py-1 mt-2">
              <p className="text-[12px] md:text-[14px] text-[#FFFFFF] font-normal">
                Recent Analysis
              </p>
            </div>
          </div>

          {/* Donut Pie Chart */}
          <div className="flex justify-center items-center w-full pt-20">
            <PieChart width={620} height={400}>
              <Pie
                data={[
                  { name: "Tree Cover", value: 21.3, color: "#1ba655" },
                  { name: "Built-Up", value: 23, color: "#C49A6C" },
                  { name: "Grass Land", value: 30.7, color: "#5daa87" },
                  { name: "Water Cover", value: 0.6, color: "#1b69a6" },
                  { name: "Other", value: 24.4, color: "#8e9eab" },
                ]}
                dataKey="value"
                nameKey="name"
                innerRadius={90}
                outerRadius={140}
                startAngle={90}
                endAngle={-270}
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}%`}
                stroke="none"
                paddingAngle={2}
              >
                {["#1ba655", "#C49A6C", "#5daa87", "#1b69a6", "#8e9eab"].map(
                  (color, index) => (
                    <Cell key={index} fill={color} />
                  )
                )}
              </Pie>
            </PieChart>

            {/* Center Text */}
            <div className="absolute text-center">
              <p className="text-[28px] font-semibold text-white">100%</p>
              <p className="text-[14px] text-gray-300">Total Coverage</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}