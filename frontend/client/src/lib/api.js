const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

console.log("API Base URL:", API_BASE_URL);

async function handleResponse(response) {
  console.log("Response status:", response.status);
  
  const contentType = response.headers.get("content-type");
  let data = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = data?.message || data?.error || data || `HTTP Error ${response.status}`;
    console.error("API Error:", message);
    throw new Error(message);
  }

  return data;
}

export async function getCommunityPosts() {
  try {
    const url = `${API_BASE_URL}/reports`;
    console.log("Fetching posts from:", url);
    
    const res = await fetch(url, {
      cache: "no-store",
    });
    
    const data = await handleResponse(res);
    return data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function createCommunityPost(data) {
  try {
    const url = `${API_BASE_URL}/reports`;
    console.log("Creating post at:", url);
    console.log("Data received:", data);
    
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value !== null && value !== undefined && value !== "") {
        if (value instanceof File) {
          formData.append(key, value);
          console.log(`Added ${key}: [File] ${value.name}`);
        } else {
          formData.append(key, String(value));
          console.log(`Added ${key}:`, value);
        }
      }
    });

    console.log("Sending POST request...");
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const result = await handleResponse(res);
    console.log("Post created:", result);
    
    return result.report || result;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}

export async function updateCommunityPost(postId, updatedData, token = null) {
  try {
    const url = `${API_BASE_URL}/reports/${postId}`;
    console.log("Updating post:", url);
    
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(updatedData),
    });

    const data = await handleResponse(res);
    return data;
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
}

export async function deleteCommunityPost(postId, token = null) {
  try {
    const url = `${API_BASE_URL}/reports/${postId}`;
    console.log("Deleting post:", url);
    
    const res = await fetch(url, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const data = await handleResponse(res);
    return data;
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
}