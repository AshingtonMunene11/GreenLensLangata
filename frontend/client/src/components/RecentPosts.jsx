"use client";

export default function RecentPosts({ posts = [], onPostClick }) {
  const recentPosts = posts.slice(0, 5);

  const handlePostClick = (postId) => {
    if (onPostClick) {
      onPostClick(postId);
    }
  };

  return (
    <div className="sticky top-28 bg-[#112C23] rounded-[30px] p-8 shadow-lg w-full">
      <h3 className="text-white text-center text-[24px] font-bold mb-8">
        Recent Posts
      </h3>

      <div className="space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#86EE92] scrollbar-track-[#16392C]">
        {recentPosts.length > 0 ? (
          recentPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="bg-[#FFFFFF] rounded-[20px] p-5 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
            >
              <h4 className="text-[#112C23] text-[16px] font-semibold mb-2 line-clamp-2 leading-snug">
                {post.title}
              </h4>

              <p className="text-sm text-[#000000]">
                {" "}
                <span className="font-normal">
                  {post.username || "Anonymous"}
                </span>
              </p>
            </div>
          ))
        ) : (
          <div className="bg-[#FFFFFF] rounded-2xl p-6 text-center">
            <p className="text-gray-600 text-sm">No recent posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}