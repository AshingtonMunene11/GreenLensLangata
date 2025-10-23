"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CommunityForm from "../../components/CommunityForm";
// import { getPosts, createPost, deletePost } from "../../lib/api";

export default function Community() {
  const [posts, setPosts] = useState([]);

  // Fetch all posts 
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchData();
  }, []);

  // Create a new post
  const handleCreatePost = async (formData) => {
    try {
      const newPost = await createPost(formData);
      setPosts((prev) => [newPost, ...prev]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Delete a post
  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCF1]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-8 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-normal text-[#112C23] mb-4">
            Share your environmental stories
          </h1>
          <p className="text-lg text-[#112C23] max-w-2xl">
            Report issues, celebrate green efforts, and inspire change in
            Lang’ata.
          </p>
        </div>
      </section>

      {/* Create Post Form */}
      <section className="pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[35px] p-8 md:p-12 bg-[#112C23]">
            <h2 className="text-2xl font-semibold mb-8 text-white text-center">
              Create New Post
            </h2>
            <CommunityForm onSubmit={handleCreatePost} />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
