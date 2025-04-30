import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ 
  comments, 
  postId, 
  currentUser, 
  onReply, 
  onDelete, 
  onVote, 
  onMarkAsAnswer,
  isPostAuthor 
}) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Be the first to leave a comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <CommentItem
          key={comment._id}
          comment={comment}
          postId={postId}
          currentUser={currentUser}
          onReply={onReply}
          onDelete={onDelete}
          onVote={onVote}
          onMarkAsAnswer={onMarkAsAnswer}
          isPostAuthor={isPostAuthor}
        />
      ))}
    </div>
  );
};

export default CommentList; 