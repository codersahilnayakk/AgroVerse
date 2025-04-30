import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import forumService from '../services/forumService';

const categories = [
  'Crop Management',
  'Pest Control',
  'Irrigation',
  'Soil Health',
  'Organic Farming',
  'Market Prices',
  'Equipment',
  'Weather',
  'General Discussion'
];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const post = await forumService.getPostById(id);
        
        // Check if the user is the author of the post
        if (!user || user._id !== post.user._id) {
          toast.error('You are not authorized to edit this post');
          return navigate('/forum');
        }
        
        setFormData({
          title: post.title,
          description: post.description,
          category: post.category
        });
      } catch (error) {
        toast.error('Failed to load post data');
        navigate('/forum');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchPost();
    } else {
      navigate('/login');
      toast.error('Please log in to edit posts');
    }
  }, [id, user, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setSubmitting(true);
      await forumService.updatePost(id, formData);
      toast.success('Post updated successfully');
      navigate(`/forum/post/${id}`);
    } catch (error) {
      toast.error('Failed to update post');
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6">
        <Link 
          to={`/forum/post/${id}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-500"
        >
          <FaArrowLeft className="mr-2" /> Back to post
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Post</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="title" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 
                          bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter post title"
                required
                maxLength="100"
              />
            </div>
            
            <div className="mb-4">
              <label 
                htmlFor="category" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 
                          bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
                required
              >
                <option value="" disabled>Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 
                          bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                placeholder="Enter post description"
                rows="10"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <Link
                to={`/forum/post/${id}`}
                className="mr-2 px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                          rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none 
                          focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                            submitting ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
              >
                {submitting ? 'Updating...' : 'Update Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost; 