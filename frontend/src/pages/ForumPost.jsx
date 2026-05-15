import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaTrash, FaUser, FaClock, FaThumbsUp, FaEye, FaTag, FaCheckCircle, FaReply } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import forumService from '../services/forumService';

function ForumPost() {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAnswer, setIsAnswer] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await forumService.getForumPostById(id);
        setPost(data);
      } catch (error) {
        toast.error('Error fetching post');
        navigate('/forum');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const updatedPost = await forumService.addComment(
        id,
        { comment, isAnswer },
        user.token
      );
      setPost(updatedPost);
      setComment('');
      setIsAnswer(false);
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await forumService.deleteForumPost(id, user.token);
        toast.success('Post deleted successfully');
        navigate('/forum');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete post');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const updatedPost = await forumService.deleteComment(
          id,
          commentId,
          user.token
        );
        setPost(updatedPost);
        toast.success('Comment deleted successfully');
      } catch (error) {
        toast.error(
          error.response?.data?.message || 'Failed to delete comment'
        );
      }
    }
  };

  const handleLikePost = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const updatedPost = await forumService.likeForumPost(id, user.token);
      setPost(updatedPost);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like post');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      const updatedPost = await forumService.likeComment(id, commentId, user.token);
      setPost(updatedPost);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like comment');
    }
  };

  const handleMarkAsAnswer = async (commentId) => {
    try {
      const updatedPost = await forumService.markCommentAsAnswer(id, commentId, user.token);
      setPost(updatedPost);
      toast.success('Comment marked as answer');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as answer');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <Spinner />;
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold mb-4">Post not found</h2>
        <Link
          to="/forum"
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Back to Forum
        </Link>
      </div>
    );
  }

  // Check if user has already liked the post
  const hasLikedPost = isAuthenticated && post.likes && post.likes.some(
    like => like._id === user._id
  );

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/forum"
          className="text-green-600 hover:text-green-700 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Back to Forum
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-green-700">{post.title}</h1>
          {isAuthenticated && user._id === post.user._id && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          )}
        </div>

        {post.category && (
          <div className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded inline-block mb-3">
            {post.category}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center mr-4">
            <FaUser className="mr-1" />
            <span>{post.user?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center mr-4">
            <FaClock className="mr-1" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center mr-4">
            <FaEye className="mr-1" />
            <span>{post.viewCount || 0} views</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={handleLikePost}
              className={`flex items-center ${hasLikedPost ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
            >
              <FaThumbsUp className="mr-1" />
              <span>{post.likes?.length || 0}</span>
            </button>
          </div>
        </div>

        {post.hasAcceptedAnswer && (
          <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded inline-block mb-3">
            <FaCheckCircle className="inline mr-1" /> Solved
          </div>
        )}

        <div className="text-gray-700 mb-6 whitespace-pre-line">
          {post.description}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap mt-3 mb-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
                <FaTag className="mr-1 text-xs" /> {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">
          Comments ({post.comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="form-group">
              <label className="block text-gray-700 mb-2" htmlFor="comment">
                Add a Comment
              </label>
              <textarea
                className="form-control h-24"
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                required
              ></textarea>
            </div>
            {isAuthenticated && user._id === post.user._id && (
              <div className="flex items-center mt-2 mb-3">
                <input
                  type="checkbox"
                  id="isAnswer"
                  checked={isAnswer}
                  onChange={(e) => setIsAnswer(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isAnswer" className="text-gray-700">
                  Mark as solution
                </label>
              </div>
            )}
            <button type="submit" className="btn btn-primary">
              Submit Comment
            </button>
          </form>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <p className="text-yellow-700">
              Please{' '}
              <Link to="/login" className="text-green-600 hover:underline">
                login
              </Link>{' '}
              to add a comment.
            </p>
          </div>
        )}

        {post.comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div
                key={comment._id}
                className={`border-b border-gray-100 pb-4 last:border-0 ${comment.isAnswer ? 'bg-green-50 p-3 rounded-lg' : ''}`}
              >
                {comment.isAnswer && (
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded inline-block mb-2">
                    <FaCheckCircle className="inline mr-1" /> Accepted Solution
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaUser className="mr-1" />
                    <span className="font-medium mr-2">
                      {comment.commenterName}
                    </span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    {isAuthenticated && user._id === post.user._id && !comment.isAnswer && (
                      <button
                        onClick={() => handleMarkAsAnswer(comment._id)}
                        className="text-green-600 hover:text-green-800 text-sm mr-3"
                        title="Mark as answer"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    {isAuthenticated &&
                      (user._id === comment.commenterId ||
                        user._id === post.user._id) && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                          title="Delete comment"
                        >
                          <FaTrash />
                        </button>
                      )}
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{comment.comment}</p>
                <div className="flex items-center mt-2">
                  <button 
                    onClick={() => handleLikeComment(comment._id)}
                    className={`flex items-center text-sm ${comment.likes && comment.likes.includes(user?._id) ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                    disabled={!isAuthenticated}
                  >
                    <FaThumbsUp className="mr-1" />
                    <span>{comment.likes?.length || 0}</span>
                  </button>
                  <button 
                    className="flex items-center text-sm text-gray-500 hover:text-green-600 ml-4"
                    onClick={() => {
                      setComment(`@${comment.commenterName} `);
                      document.getElementById('comment').focus();
                    }}
                  >
                    <FaReply className="mr-1" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForumPost; 