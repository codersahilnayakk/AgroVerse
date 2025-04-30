import React, { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaReply, FaTrash, FaRegThumbsUp, FaRegThumbsDown, FaCheckCircle } from 'react-icons/fa';
import formatDate from '../../utils/formatDate';
import Avatar from '../Avatar';
import CommentForm from './CommentForm';

const CommentItem = ({ 
  comment, 
  postId, 
  currentUser, 
  onReply, 
  onDelete,
  onVote,
  onMarkAsAnswer,
  isPostAuthor = false
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  
  const isAuthor = currentUser && comment.author && comment.author._id === currentUser._id;
  const hasUpvoted = comment.userVote === 'upvote';
  const hasDownvoted = comment.userVote === 'downvote';
  
  const handleSubmitReply = async (replyData) => {
    setReplyLoading(true);
    try {
      await onReply(comment._id, replyData);
      setShowReplyForm(false);
    } finally {
      setReplyLoading(false);
    }
  };
  
  return (
    <div className={`border rounded-lg p-4 ${comment.isAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Avatar name={comment.author?.name || 'User'} size="sm" />
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-medium">{comment.author?.name || 'Anonymous'}</span>
              {comment.isAnswer && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center">
                  <FaCheckCircle className="mr-1" /> Solution
                </span>
              )}
            </div>
            
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          
          <div className="mt-2 text-gray-700">
            {comment.content || comment.comment}
          </div>
          
          <div className="mt-3 flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => onVote(comment._id, 'upvote')}
                className={`p-1 rounded ${hasUpvoted ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                title="Upvote"
              >
                {hasUpvoted ? <FaThumbsUp /> : <FaRegThumbsUp />}
              </button>
              <span className="text-gray-600">{comment.upvotes || 0}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => onVote(comment._id, 'downvote')}
                className={`p-1 rounded ${hasDownvoted ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                title="Downvote"
              >
                {hasDownvoted ? <FaThumbsDown /> : <FaRegThumbsDown />}
              </button>
              <span className="text-gray-600">{comment.downvotes || 0}</span>
            </div>
            
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <FaReply />
              <span>Reply</span>
            </button>
            
            {isPostAuthor && !comment.isAnswer && onMarkAsAnswer && (
              <button 
                onClick={() => onMarkAsAnswer(comment._id)}
                className="text-green-600 hover:text-green-800 flex items-center space-x-1"
              >
                <FaCheckCircle />
                <span>Mark as Solution</span>
              </button>
            )}
            
            {isAuthor && (
              <button 
                onClick={() => onDelete(comment._id)}
                className="text-red-600 hover:text-red-800 flex items-center space-x-1"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            )}
          </div>
          
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm 
                onSubmit={handleSubmitReply} 
                loading={replyLoading}
                replyingTo={comment.author?.name || 'Anonymous'}
                onCancelReply={() => setShowReplyForm(false)}
              />
            </div>
          )}
          
          {/* Render replies if any */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-6 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  currentUser={currentUser}
                  onReply={onReply}
                  onDelete={onDelete}
                  onVote={onVote}
                  isPostAuthor={isPostAuthor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem; 