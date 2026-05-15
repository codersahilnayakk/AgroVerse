import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaThumbsUp, 
  FaRegThumbsUp, 
  FaShare, 
  FaTag,
  FaCalendarAlt,
  FaUser,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import CommentForm from '../components/CommentForm';
import Comment from '../components/Comment';
import forumService from '../services/forumService';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch post and comments
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setIsLoading(true);
        const postData = await forumService.getPostById(id);
        setPost(postData);
        setComments(postData.comments || []);
        setLiked(postData.likes?.includes(user?._id));
        setLikeCount(postData.likes?.length || 0);
      } catch (error) {
        toast.error('Failed to load post');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPostData();
  }, [id, user]);
  
  const handleLike = async () => {
    if (!user) {
      toast.error('Please log in to like posts');
      return;
    }
    
    try {
      await forumService.likePost(id);
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      toast.error('Failed to like post');
      console.error(error);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };
  
  const handleAddComment = async (text) => {
    try {
      setIsSubmitting(true);
      const newComment = await forumService.addComment(id, text);
      setComments([...comments, newComment]);
      toast.success('Comment added successfully');
      return true;
    } catch (error) {
      toast.error('Failed to add comment');
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdateComment = async (commentId, text) => {
    try {
      const updatedComment = await forumService.updateComment(id, commentId, text);
      setComments(comments.map(c => c._id === commentId ? updatedComment : c));
      toast.success('Comment updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update comment');
      console.error(error);
      return false;
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      await forumService.deleteComment(id, commentId);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
      console.error(error);
    }
  };
  
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      await forumService.deletePost(id);
      toast.success('Post deleted successfully');
      navigate('/forum');
    } catch (error) {
      toast.error('Failed to delete post');
      console.error(error);
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };
  
  if (isLoading) {
    return <Spinner />;
  }
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Post Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">The post you're looking for doesn't exist or has been removed.</p>
            <Link to="/forum" className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md">
              <FaArrowLeft className="mr-2" /> Back to Forum
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const isOwner = user && user._id === post.user._id;
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/forum" className="inline-flex items-center text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">
            <FaArrowLeft className="mr-2" /> Back to Forum
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-4">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{post.user.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center">
                      <FaCalendarAlt className="mr-1" size={12} /> 
                      {formatDate(post.createdAt)}
                    </span>
                    {post.updatedAt !== post.createdAt && 
                      <span className="ml-2 text-xs italic">(edited)</span>
                    }
                  </p>
                </div>
              </div>
              
              {isOwner && (
                <div className="flex space-x-3">
                  <Link 
                    to={`/forum/edit/${id}`} 
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Edit post"
                  >
                    <FaEdit />
                  </Link>
                  <button 
                    onClick={handleDeletePost}
                    disabled={isDeleting}
                    className={`text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Delete post"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
            
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {post.title}
            </h1>
            
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">
                <FaTag className="mr-1" /> {post.category}
              </span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {post.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleLike} 
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {liked ? (
                    <FaThumbsUp className="text-blue-600 dark:text-blue-400 mr-1" />
                  ) : (
                    <FaRegThumbsUp className="mr-1" />
                  )}
                  <span>{likeCount}</span>
                </button>
                
                <button 
                  onClick={handleShare} 
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  title="Share post"
                >
                  <FaShare />
                </button>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6 p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Add a Comment
          </h3>
          <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />
        </div>
        
        {comments.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Comments ({comments.length})
            </h3>
            <div className="space-y-4">
              {comments.map(comment => (
                <Comment 
                  key={comment._id} 
                  comment={comment} 
                  onDelete={handleDeleteComment}
                  onUpdate={handleUpdateComment}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail; 