import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import forumService from '../services/forumService';
import Spinner from '../components/Spinner';

const NewPost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([
    'General', 'Crop Management', 'Livestock', 'Equipment', 
    'Market Prices', 'Weather', 'Soil Management', 'Pest Control',
    'Irrigation', 'Organic Farming', 'Technology', 'Other'
  ]);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      toast.error('You must be logged in to create a post');
      navigate('/login');
    }
    
    // Optionally fetch categories from API
    // const fetchCategories = async () => {
    //   try {
    //     const data = await forumService.getCategories();
    //     setCategories(data);
    //   } catch (error) {
    //     console.error('Error fetching categories:', error);
    //   }
    // };
    // fetchCategories();
  }, [user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast.error('All fields are required');
      return;
    }
    
    try {
      setSubmitting(true);
      await forumService.createPost(formData);
      toast.success('Post created successfully');
      navigate('/forum');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (!user) {
    return <Spinner />;
  }
  
  return (
    <div className="max-w-4xl mx-auto mt-6 p-5">
      <Link to="/forum" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <FaArrowLeft className="mr-2" /> Back to Forum
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Enter a clear, specific title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="10"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              placeholder="Enter your post content with details"
              required
            ></textarea>
          </div>
          
          <div className="flex justify-between">
            <Link
              to="/forum"
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 transition duration-200"
            >
              {submitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;