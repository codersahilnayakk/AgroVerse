import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaBookmark, FaRegBookmark, FaEye } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import AuthContext from '../context/AuthContext';
import forumService from '../services/forumService';
import { toast } from 'react-toastify';

// ForumPostCard component for displaying post previews on the Forum page
const ForumPostCard = ({ post, refreshPosts }) => {
  const { user } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [loading, setLoading] = useState(false);

  // Function to handle post liking
  const handleLike = async () => {
    if (!user) {
      toast.info('Please log in to like posts');
      return;
    }

    try {
      setLoading(true);
      if (isLiked) {
        await forumService.unlikePost(post._id);
        setLikeCount(prev => prev - 1);
      } else {
        await forumService.likePost(post._id);
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error('Failed to process like action');
      console.error('Like action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle post bookmarking
  const handleBookmark = async () => {
    if (!user) {
      toast.info('Please log in to bookmark posts');
      return;
    }

    try {
      setLoading(true);
      if (isBookmarked) {
        await forumService.unbookmarkPost(post._id);
      } else {
        await forumService.bookmarkPost(post._id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      toast.error('Failed to process bookmark action');
      console.error('Bookmark action failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to truncate text
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/forum/post/${post._id}`} className="block">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {post.title}
            </h3>
          </Link>
          <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded">
            {post.category}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
          <img 
            src={post.author?.profilePicture || 'https://via.placeholder.com/32'} 
            alt={post.author?.name || 'User'} 
            className="w-6 h-6 rounded-full mr-2" 
          />
          <span>{post.author?.name || 'Anonymous'}</span>
          <span className="mx-2">•</span>
          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {truncateText(post.description)}
        </p>
        
        {post.image && (
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-48 object-cover mb-4 rounded"
          />
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <button 
              onClick={handleLike} 
              disabled={loading}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              {isLiked ? (
                <FaHeart className="text-red-500 mr-1" />
              ) : (
                <FaRegHeart className="mr-1" />
              )}
              <span>{likeCount}</span>
            </button>
            
            <Link 
              to={`/forum/post/${post._id}`} 
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              <FaComment className="mr-1" />
              <span>{post.comments || 0}</span>
            </Link>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaEye className="mr-1" />
              <span>{post.views || 0}</span>
            </div>
          </div>
          
          <button 
            onClick={handleBookmark}
            disabled={loading}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            {isBookmarked ? (
              <FaBookmark className="text-blue-500" />
            ) : (
              <FaRegBookmark />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumPostCard; 