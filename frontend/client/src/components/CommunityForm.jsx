"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";

export default function CommunityForm({ onSubmit, editingPost, onCancelEdit }) {
  const { user } = useContext(UserContext);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    photo: "", 
    photoType: "url",
    location: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxChars = 120;

  // Prefill form when editing a post 
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || "",
        photo: editingPost.image_url || "", 
        photoType: editingPost.image_url ? "url" : "file",
        location: editingPost.location || "",
        description: editingPost.description || "",
      });

      
      setTimeout(() => {
        if (formRef.current) {
          const headerOffset = 150;
          const elementPosition = formRef.current.getBoundingClientRect().top;
          const offsetPosition =
            window.scrollY + elementPosition - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 100);
    }
  }, [editingPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.description) {
      alert("Please fill all required fields before submitting.");
      return;
    }

    if (formData.description.length > maxChars) {
      alert("Description cannot exceed 120 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        user_id: user?.id || null,
        username: user?.username || user?.name || "Anonymous",
      };

      if (formData.photoType === "url" && formData.photo) {
        submitData.image_url = formData.photo;
      } else if (
        formData.photoType === "file" &&
        formData.photo instanceof File
      ) {
        submitData.image_file = formData.photo;
      }

      if (editingPost?.id) {
        submitData.id = editingPost.id;
      }

      await onSubmit(submitData);

      // Reset form after submission
      setFormData({
        title: "",
        photo: "",
        photoType: "url",
        location: "",
        description: "",
      });

      if (editingPost && onCancelEdit) {
        onCancelEdit();
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      photo: "",
      photoType: "url",
      location: "",
      description: "",
    });
    if (onCancelEdit) onCancelEdit();
  };

  const langataLocations = [
    "Karen",
    "Wilson Airport Area",
    "Otiende",
    "Nairobi West",
    "Lang'ata Southlands",
    "Nyayo Estate",
    "Hardy",
    "Carnivore Area",
    "Lang'ata Shopping Center",
    "Mugumoini",
  ];

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white text-sm font-normal mb-2">
            Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Illegal Dumping Site"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-[90%] bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A]
            focus:outline-none focus:border-[#86EE92] text-sm"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-white text-sm font-normal mb-2">
            Photo (Optional)
          </label>

          <div className="w-[90%] flex items-center gap-2">
            <select
              value={formData.photoType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  photoType: e.target.value,
                  photo: "", 
                })
              }
              disabled={isSubmitting}
              className="bg-[#112C23] border-2 border-white/90 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-[#86EE92] cursor-pointer">
              <option value="url" className="bg-[#112C23] text-white">
                Image URL
              </option>
              <option value="file" className="bg-[#112C23] text-white">
                Image File
              </option>
            </select>

            {formData.photoType === "url" ? (
              <input
                type="text"
                placeholder="Paste image URL"
                value={formData.photo || ""} 
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.value })
                }
                disabled={isSubmitting}
                className="flex-1 bg-[#112C23] border-2 border-white/90 rounded-full px-6 py-3 text-white 
        placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    photo: e.target.files?.[0] || "",
                  })
                }
                disabled={isSubmitting}
                className="flex-1 bg-[#112C23] text-white text-sm file:mr-4 file:py-2 file:px-4 
        file:rounded-full file:border-0 file:text-sm file:font-semibold 
        file:bg-[#86EE92] file:text-[#112C23] hover:file:bg-green-500"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-white text-sm font-normal mb-2">
            Location *
          </label>
          <select
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            disabled={isSubmitting}
            className="w-[90%] bg-[#112C23] border-2 border-white/90 rounded-full px-6 py-3 text-white 
            focus:outline-none focus:border-[#86EE92] text-sm appearance-none cursor-pointer"
          >
            <option value="" disabled className="bg-[#112C23] text-white">
              Select specific Lang'ata location
            </option>
            {langataLocations.map((loc, index) => (
              <option
                key={index}
                value={loc}
                className="bg-[#112C23] text-white hover:bg-[#2B725A]"
              >
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white text-sm font-normal mb-2">
            Description *
          </label>
          <input
            type="text"
            placeholder="Describe the environmental issue or initiative"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            maxLength={maxChars}
            disabled={isSubmitting}
            className="w-[90%] bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] 
            focus:outline-none focus:border-[#86EE92] text-sm"
          />
          <p className="text-xs text-[#86EE92] mt-1">
            {formData.description.length}/{maxChars} characters
          </p>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#86EE92] hover:bg-green-500 text-[#112C23] px-8 py-3 rounded-[50.5px] font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? editingPost
              ? "UPDATING..."
              : "SUBMITTING..."
            : editingPost
            ? "UPDATE"
            : "SUBMIT"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="bg-[#F3704F] hover:bg-orange-600 text-[#FFFFFF] px-8 py-3 rounded-[50.5px] font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
