import api from "./api";

// GET ALL
export async function getAllPosts() {
  const res = await api.get("/post/getAll");
  return res.data?.data || [];
}

// GET BY ID
export async function getPostById(id) {
  const res = await api.get(`/post/getById/${id}`);
  // backend returns array, take first
  return res.data?.data?.[0] || null;
}

// CREATE
export async function createPost(payload) {
  const res = await api.post("/post/createPost", payload);
  return res.data;
}

// UPDATE
export async function updatePost(id, payload) {
  const res = await api.put(`/post/updatePost/${id}`, payload);
  return res.data;
}

// DELETE
export async function deletePostById(id) {
  const res = await api.delete(`/post/deleteById/${id}`);
  return res.data;
}
