import { apiClient } from "./apiClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const documentService = {
  getAll: async () => {
    return await apiClient.get("/documents");
  },

  getById: async (id) => {
    return await apiClient.get(`/documents/${id}`);
  },

  create: async (file) => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const token = user?.token;

  const formData = new FormData();

  formData.append("document", file);
  formData.append("title", file.name);
  formData.append(
    "description",
    "Uploaded from frontend"
  );
  formData.append("visibility", "public");

  const response = await fetch(
    `${BASE_URL}/documents/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Upload failed"
    );
  }

  return await response.json();
},
};