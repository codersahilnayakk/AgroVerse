import React, { useState, useContext } from 'react';
import { FaEdit, FaTrash, FaUser, FaClock } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';

const Comment = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useContext(AuthContext);
  
  const isAuthor = user && user._id === comment.user._id;
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

  const handleUpdate = async (text) => {
    try {
      setIsEditing(true);
      const success = await onUpdate(comment._id, text);
      if (success) {
        setIsEditing(false);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(comment._id);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="mb-4">
        <CommentForm 
          onSubmit={handleUpdate} 
          initialValue={comment.text} 
          isEdit={true} 
          onCancel={() => setIsEditing(false)} 
        />
      </div>
    );
  }

  return (
    <div className="border dark:border-gray-700 rounded-lg p-4 mb-4 bg-white dark:bg-gray-800">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
            <FaUser className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {comment.user.name}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FaClock className="mr-1 text-xs" />
              {formattedDate}
            </div>
          </div>
        </div>
        
        {isAuthor && (
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsEditing(true)} 
              className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 focus:outline-none"
              disabled={isDeleting}
            >
              <FaEdit />
            </button>
            <button 
              onClick={handleDelete} 
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none"
              disabled={isDeleting}
            >
              {isDeleting ? <span className="opacity-50">Deleting...</span> : <FaTrash />}
            </button>
          </div>
        )}
      </div>
      
      <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {comment.text}
      </div>
    </div>
  );
};

export default Comment; 