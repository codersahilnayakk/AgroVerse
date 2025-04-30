import axios from 'axios';
import { getAuthConfig } from '../utils/helpers';

const API_URL = 'http://localhost:5000/api/forum';

// Post management
const getPosts = async (page = 1, limit = 10, category = '') => {
  const query = new URLSearchParams();
  if (page) query.append('page', page);
  if (limit) query.append('limit', limit);
  if (category) query.append('category', category);
  
  const response = await axios.get(`${API_URL}/posts?${query.toString()}`);
  return response.data;
};

const getPostById = async (id) => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};

const createPost = async (postData) => {
  const response = await axios.post(`${API_URL}/posts`, postData, getAuthConfig());
  return response.data;
};

const updatePost = async (id, postData) => {
  const response = await axios.put(`${API_URL}/posts/${id}`, postData, getAuthConfig());
  return response.data;
};

const deletePost = async (id) => {
  const response = await axios.delete(`${API_URL}/posts/${id}`, getAuthConfig());
  return response.data;
};

// Comment management
const getCommentsByPostId = async (postId) => {
  const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
  return response.data;
};

const addComment = async (postId, text) => {
  const response = await axios.post(
    `${API_URL}/posts/${postId}/comments`, 
    { text }, 
    getAuthConfig()
  );
  return response.data;
};

const updateComment = async (postId, commentId, text) => {
  const response = await axios.put(
    `${API_URL}/posts/${postId}/comments/${commentId}`, 
    { text }, 
    getAuthConfig()
  );
  return response.data;
};

const deleteComment = async (postId, commentId) => {
  const response = await axios.delete(
    `${API_URL}/posts/${postId}/comments/${commentId}`, 
    getAuthConfig()
  );
  return response.data;
};

// User interactions
const likePost = async (postId) => {
  const response = await axios.post(
    `${API_URL}/posts/${postId}/like`, 
    {}, 
    getAuthConfig()
  );
  return response.data;
};

const getUserBookmarks = async () => {
  const response = await axios.get(`${API_URL}/bookmarks`, getAuthConfig());
  return response.data;
};

const addBookmark = async (postId) => {
  const response = await axios.post(
    `${API_URL}/bookmarks/${postId}`, 
    {}, 
    getAuthConfig()
  );
  return response.data;
};

const removeBookmark = async (postId) => {
  const response = await axios.delete(
    `${API_URL}/bookmarks/${postId}`, 
    getAuthConfig()
  );
  return response.data;
};

// Search and filtering
const searchPosts = async (query) => {
  const response = await axios.get(`${API_URL}/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

const getPostsByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}/posts`);
  return response.data;
};

const getPostCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

const forumService = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCommentsByPostId,
  addComment,
  updateComment,
  deleteComment,
  likePost,
  getUserBookmarks,
  addBookmark,
  removeBookmark,
  searchPosts,
  getPostsByUser,
  getPostCategories
};

export default forumService; 