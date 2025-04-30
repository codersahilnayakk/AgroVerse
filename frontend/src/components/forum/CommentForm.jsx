import React, { useState, useEffect } from 'react';
import { FaReply, FaTimes } from 'react-icons/fa';

const CommentForm = ({ onSubmit, loading, replyingTo, onCancelReply }) => {
  const [content, setContent] = useState('');

  // Reset content when finished submitting
  useEffect(() => {
    if (!loading) {
      setContent('');
    }
  }, [loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSubmit({ content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {replyingTo && (
        <div className="flex items-center justify-between bg-blue-50 p-2 rounded mb-2">
          <div className="flex items-center text-sm">
            <FaReply className="text-blue-500 mr-1" />
            <span>Replying to <strong>{replyingTo}</strong></span>
          </div>
          <button 
            type="button" 
            onClick={onCancelReply}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
      )}
      
      <div>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          rows="4"
          placeholder="Add your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 