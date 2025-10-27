"use client";

import { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CommunityForm from "../../components/CommunityForm";
import CommunityPostsList from "../../components/CommunityPostList";
import RecentPosts from "../../components/RecentPosts";
import Pagination from "../../components/Pagination";
import AuthPopup from "../../components/AuthPopup";
import { UserContext } from "../../context/UserContext";
import {getCommunityPosts, createCommunityPost,updateCommunityPost, deleteCommunityPost} from "../../lib/api";
import { Toaster, toast } from "react-hot-toast"; 

export default function Community() {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  useEffect(() => {
    console.log("Current user in Community:", user);
  }, [user]);

  // Fetch posts
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCommunityPosts();
        console.log("Fetched posts:", data);
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Create a new post
  const handleCreatePost = async (formData) => {
    if (!user) {
      setShowAuthPopup(true);
      return;
    }

    try {
      const newPost = await createCommunityPost(formData);
      setPosts((prev) => [newPost, ...prev]);

      toast.success("Post created successfully!", {
        duration: 3000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Error in handleCreatePost:", error);
      toast.error(`Failed to create post: ${error.message || error}`, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  // Update a post
  const handleUpdatePost = async (id, updatedData) => {
    if (!user) {
      setShowAuthPopup(true);
      return;
    }

    try {
      const updatedPost = await updateCommunityPost(id, updatedData);
      setPosts((prev) =>
        prev.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );

      setEditingPost(null);
      toast.success("Post updated successfully!", {
        duration: 3000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post. Please try again.", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  // Delete post
  const handleDeletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteCommunityPost(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Post deleted successfully!", { duration: 3000 });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.", {
        duration: 3000,
      });
    }
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Handle clicking a post from Recent Posts sidebar
  const handleRecentPostClick = (postId) => {    
    const postIndex = posts.findIndex((post) => post.id === postId);    
    if (postIndex === -1) return;     
    const pageNumber = Math.ceil((postIndex + 1) / postsPerPage);    
    setCurrentPage(pageNumber);
    
    setTimeout(() => {
      const postElement = document.getElementById(`post-${postId}`);
      if (postElement) {
        const headerOffset = 120;
        const elementPosition = postElement.getBoundingClientRect().top;
        const offsetPosition = window.scrollY + elementPosition - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  //  Preloader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFCF1]">
        <p className="text-[#112C23] text-lg">Loading community posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCF1]">
      <Toaster />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-8 text-left">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-normal text-[#112C23] mb-4">
            Share your environmental stories
          </h1>
          <p className="text-lg text-[#112C23] max-w-2xl">
            Report issues, celebrate green efforts and inspire change in
            Lang'ata.
          </p>
        </div>
      </section>

      {/* Create and Update Post Form */}
      <section className="pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[35px] p-8 md:p-12 bg-[#112C23]">
            <h2 className="text-2xl font-semibold mb-8 text-white text-center">
              {editingPost ? "Update Post" : "Create New Post"}
            </h2>

            <CommunityForm
              key={editingPost ? editingPost.id : "create-form"}
              onSubmit={
                editingPost
                  ? (data) => handleUpdatePost(editingPost.id, data)
                  : handleCreatePost
              }
              editingPost={editingPost}
              onCancelEdit={() => setEditingPost(null)}
            />

            {showAuthPopup && (
              <AuthPopup
                onClose={() => setShowAuthPopup(false)}
                onSignIn={() => (window.location.href = "/login")}
                onSignUp={() => (window.location.href = "/signup")}
              />
            )}
          </div>
        </div>
      </section>

      {/* Main community blog section */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Posts List*/}
            <main className="w-full lg:flex-1 lg:min-w-0">
              <CommunityPostsList
                posts={currentPosts}
                currentUserId={user?.id}
                onEdit={(post) => setEditingPost(post)}
                onDelete={handleDeletePost}
              />

              {posts.length > postsPerPage && (
                <div className="mt-8">
                  <Pagination
                    totalPosts={posts.length}
                    postsPerPage={postsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </main>

            {/* Recent Post */}
            <aside className="hidden lg:block lg:w-[400px] lg:shrink-0">
              <div className="sticky top-24">
                <RecentPosts 
                  posts={posts.slice(0, 5)} 
                  onPostClick={handleRecentPostClick}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}