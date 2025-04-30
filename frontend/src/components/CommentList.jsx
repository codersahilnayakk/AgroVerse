import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Comment from './Comment';
import CommentForm from './CommentForm';
import Spinner from './Spinner';
import forumService from '../services/forumService';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await forumService.getCommentsByPostId(postId);
      setComments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (commentText) => {
    try {
      const newComment = await forumService.addComment(postId, commentText);
      setComments([...comments, newComment]);
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error(err.response?.data?.message || 'Failed to add comment');
      return false;
    }
  };

  const handleUpdateComment = async (commentId, text) => {
    try {
      const updatedComment = await forumService.updateComment(postId, commentId, text);
      setComments(
        comments.map((comment) => 
          comment._id === commentId ? updatedComment : comment
        )
      );
      toast.success('Comment updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating comment:', err);
      toast.error(err.response?.data?.message || 'Failed to update comment');
      return false;
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await forumService.deleteComment(postId, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchComments}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
      
      <CommentForm onSubmit={handleAddComment} />
      
      <div className="mt-6">
        {comments.length > 0 ? (
          <div className="space-y-2">
            {comments.map((comment) => (
              <Comment 
                key={comment._id} 
                comment={comment} 
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList; 