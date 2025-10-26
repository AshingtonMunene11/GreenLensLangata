import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import "./globals.css";

export default function HomePage() {
  return (
    <main className="bg-[#FAFCF1] min-h-screen text-[#112C23] font-sans">
      <Navbar />
      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-center">
        <img
          src="/home_image.svg"
          alt="Hero background"
          className="w-full h-[735] object-cover"
        />
        <div className="absolute inset-0 bg-black/16"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="font-semibold text-[90px] leading-[1.1] max-w-[1367px] text-white">
            JOIN A MISSION <br /> MAKE A CHANGE
          </h1>
        </div>
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
      <section className="max-w-[1200px] mx-auto px-6 py-16">
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
              <p className="text-[14px] mb-4 font-medium text-[#112C23]">By Igamba Dais</p>
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
                Nairobi’s Urban Nature Revival
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

        <div className="bg-[#112C23] text-white rounded-[25px] p-8 flex flex-col md:flex-row justify-between items-center relative">

          {/* Explore button */}
          <Link href="/explore">
            <button className="absolute top-6 right-6 bg-white text-[#112C23] rounded-full px-6 py-1.5 font-semibold text-[12px] md:text-[14px] hover:bg-gray-200 transition cursor-pointer">
              EXPLORE
            </button>
          </Link>

          {/* Bar Chart Area*/}
          <div className="flex-1 w-full md:w-2/3 flex flex-col justify-center">
            {/* Title */}
            <h3 className="text-[22px] md:text-[24px] font-light mb-4">
              Overview Analysis : Lang’ata
            </h3>

            {/* Tree Cover */}
            <div className="inline-block border border-[#FFFFFF] rounded-full px-3 py-1 mb-6 w-fit">
              <p className="text-sm md:text-base text-[#FFFFFF] font-normal">
                Tree Cover Sq:
              </p>
            </div>

            {/* Bar Chart */}
            <div className="relative w-full h-[260px] md:h-[280px]">
              <div className="absolute left-8 top-2 bottom-8 w-px bg-gray-600"></div>
              <div className="absolute bottom-8 left-8 right-8 h-px bg-gray-600"></div>
              <div className="absolute bottom-2 left-8 right-8 flex justify-between text-[12px] md:text-[14px] text-[#FFFFFF]">
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>2025</span>
              </div>
              <p className="text-gray-500 text-sm absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                [ Line Chart Will Appear Here ]
              </p>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex-1 w-full md:w-1/3 mt-10 md:mt-0 flex flex-col items-center justify-center relative">
            <img
              src="/piechart_home.svg"
              alt="Pie chart"
              className="w-[220px] md:w-[260px] object-contain"
            />

            {/* 85% (left side arrow) */}
            <div className="absolute left-[10%] top-[40%] flex items-center gap-1 text-sm md:text-base">
              <span className="text-white font-semibold">85%</span>
              <svg
                className="w-4 h-4 text-white rotate-[180deg]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            {/* 15% (right side arrow pointing inward) */}
            <div className="absolute right-[10%] bottom-[30%] flex items-center gap-1 text-sm md:text-base">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-white font-semibold">15%</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
