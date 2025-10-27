"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";

export default function CommunityPostCard({
  post,
  currentUserId,
  onEdit,
  onDelete,
}) {
  const {
    id,
    title,
    description,
    location,
    image_url,
    created_at,
    username,
    user_id,
  } = post;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const formattedDate = formatDate(created_at);

  // Handle image URL 
  const imageSrc = image_url
    ? image_url.startsWith("http")
      ? image_url
      : `http://127.0.0.1:5000/static/uploads/${image_url}`
    : null;

  // Check user ownership
  const isOwner = currentUserId && currentUserId === user_id;

  return (
    <div 
    id={`post-${id}`}
    className="bg-[#0F2A21] rounded-[35px] overflow-hidden shadow-xl w-full mb-10 scroll-mt-32">
      {/* Header Section */}
      <div className="p-8 pb-4">
        <div className="flex justify-between items-start">
          <h2 className="text-white text-[30px] font-medium leading-tight flex-1 pr-4">
            {title}
          </h2>

          {/* Edit and Delete buttons */}
          {isOwner && (
            <div className="flex gap-3 shrink-0">
              {/* Edit Button */}
              <button
                onClick={() => onEdit?.(post)}
                aria-label="Edit post"
                className="hover:opacity-80 transition"
              >
                <Image
                  src="/edit.svg"
                  alt="Edit"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </button>

              {/* Delete Button */}
              <button
                onClick={() => onDelete?.(id)}
                aria-label="Delete post"
                className="hover:opacity-80 transition"
              >
                <Image
                  src="/delete-icon.svg"
                  alt="Delete"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </button>
            </div>
          )}
        </div>

        {/* Location and Date */}
        <div className="flex gap-3 mt-0 flex-wrap">
          {location && (
            <div className="flex items-center gap-2 border border-white/80 rounded-full px-5 py-2 text-white text-[15px]">
              <MapPin size={16} className="text-[#86EE92]" />
              <span>{location}</span>
            </div>
          )}

          {formattedDate && (
            <div className="border border-white/80 rounded-full px-5 py-2 text-white text-[15px]">
              {formattedDate}
            </div>
          )}
        </div>
      </div>

      {/* Image Section */}
      {imageSrc && (
        <div className="px-8 pb-6">
          <div className="relative w-full h-90 rounded-[25px] overflow-hidden">
            <img
              src={imageSrc}
              alt={title || "Community post image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="px-8 pb-8 ">
        <p className="text-white text-[17px] mb-3">
          <span className="font-semibold">Posted by:</span>{" "}
          <span className="font-normal">{username || "Anonymous"}</span>
        </p>

        <p className="text-[#FFFFFF] text-[17px] leading-relaxed wrap-break-word">
          {description}
        </p>
      </div>
    </div>
  );
}
