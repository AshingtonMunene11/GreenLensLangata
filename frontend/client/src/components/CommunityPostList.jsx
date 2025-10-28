"use client";
import CommunityPostCard from "../components/CommunityPostCard";

export default function CommunityPostsList({
  posts = [],
  currentUserId,
  onEdit,
  onDelete,
}) {
  return (
    <div className="w-full space-y-8">
      {posts.length > 0 ? (
        posts.map((post) => (
          <CommunityPostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onEdit={() => onEdit(post)}
            onDelete={() => onDelete(post.id)}
            className="h-80"  
          />
        ))
      ) : (
        <div className="bg-[#0F2A21] rounded-3xl p-12 text-center">
          <p className="text-gray-400 text-lg">
            No community posts yet. Be the first to share your story!
          </p>
        </div>
      )}
    </div>
  );
}
