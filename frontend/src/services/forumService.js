import axios from 'axios';

const API_URL = '/api/forum';

// Post management
const getPosts = async (page = 1, limit = 10, category = '') => {
  const query = new URLSearchParams();
  if (category) query.append('category', category);
  
  const response = await axios.get(`${API_URL}?${query.toString()}`);
  return response.data;
};

const getPostById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createPost = async (postData) => {
  const response = await axios.post(`${API_URL}`, postData);
  return response.data;
};

const updatePost = async (id, postData) => {
  const response = await axios.put(`${API_URL}/${id}`, postData);
  return response.data;
};

const deletePost = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Comment management
const addComment = async (postId, commentText) => {
  const response = await axios.post(
    `${API_URL}/${postId}/comments`, 
    { comment: commentText }
  );
  return response.data;
};

const updateComment = async (postId, commentId, commentText) => {
  const response = await axios.put(
    `${API_URL}/${postId}/comments/${commentId}`, 
    { comment: commentText }
  );
  return response.data;
};

const deleteComment = async (postId, commentId) => {
  const response = await axios.delete(
    `${API_URL}/${postId}/comments/${commentId}`
  );
  return response.data;
};

// User interactions
const likePost = async (postId) => {
  const response = await axios.put(`${API_URL}/${postId}/like`, {});
  return response.data;
};

const likeComment = async (postId, commentId) => {
  const response = await axios.put(
    `${API_URL}/${postId}/comments/${commentId}/like`, 
    {}
  );
  return response.data;
};

// Search and filtering
const searchPosts = async (query) => {
  const response = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

const getPostsByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

const forumService = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  likePost,
  likeComment,
  searchPosts,
  getPostsByUser,
  getUserPosts: async (userId) => {
    if (!userId) return [];
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch { return []; }
  },
  getUserBookmarks: async () => {
    // Placeholder until backend API is implemented
    return [];
  }
};

export default forumService; 