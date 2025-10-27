"use client";

export default function Pagination({
  totalPosts,
  postsPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (totalPages <= 1) return null; 

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) handlePageClick(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) handlePageClick(currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-3 mt-10">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-full font-medium transition ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#112C23] text-white hover:bg-[#16392C]"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`w-10 h-10 rounded-full font-semibold transition ${
              currentPage === page
                ? "bg-[#86EE92] text-[#112C23]"
                : "bg-[#112C23] text-white hover:bg-[#16392C]"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-full font-medium transition ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#112C23] text-white hover:bg-[#16392C]"
        }`}
      >
        Next
      </button>
    </div>
  );
}
