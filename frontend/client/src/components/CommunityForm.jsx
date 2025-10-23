"use client";

import { useState } from "react";

export default function CommunityForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    photo: "",
    location: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      onSubmit(formData);
      setFormData({ title: "", photo: "", location: "", description: "" });
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", photo: "", location: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-[90%] bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-normal mb-2">
            Photo (Optional)
          </label>
          <input
            type="text"
            placeholder="Add Photo"
            value={formData.photo}
            onChange={(e) =>
              setFormData({ ...formData, photo: e.target.value })
            }
            className="w-[90%] bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-normal mb-2">
            Location *
          </label>
          <input
            type="text"
            placeholder="e.g., Near Ngong River, Langata Road"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-[90%] bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
          />
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
            className="w-[90%] bg-transparent border-2 border-white/90 rounded-full px-6 py-3 text-white placeholder-[#2B725A] focus:outline-none focus:border-[#86EE92] text-sm"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="bg-[#86EE92] hover:bg-green-600 text-[#112C23] px-8 py-3 rounded-full font-bold text-sm transition-colors cursor-pointer"
        >
          SUBMIT
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-[#F3704F] hover:bg-orange-600 text-[#FFFFFF] px-8 py-3 rounded-full font-bold text-sm transition-colors cursor-pointer"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
