import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const CommentItem = ({ comment, onDelete, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const handleEditClick = () => {
    setEditText(comment.text);
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.text);
  };
  
  const handleUpdateComment = async () => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setIsUpdating(true);
      await onUpdate(comment._id, editText);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update comment');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleDeleteComment = async () => {
    try {
      setIsDeleting(true);
      await onDelete(comment._id);
    } catch (error) {
      toast.error('Failed to delete comment');
      setIsDeleting(false);
    }
  };
  
  const isOwner = user && user._id === comment.user._id;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {comment.user.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {comment.user.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.createdAt)}
                {comment.updatedAt !== comment.createdAt && 
                  ' (edited)'
                }
              </p>
            </div>
            
            {isOwner && !isEditing && (
              <div className="flex space-x-2">
                <button 
                  onClick={handleEditClick}
                  className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  title="Edit comment"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={handleDeleteComment}
                  disabled={isDeleting}
                  className={`hover:text-red-500 dark:hover:text-red-400 ${
                    isDeleting 
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  title="Delete comment"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border rounded resize-none min-h-[80px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900"
                disabled={isUpdating}
              />
              
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="p-1.5 rounded text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Cancel"
                >
                  <FaTimes />
                </button>
                <button
                  onClick={handleUpdateComment}
                  disabled={isUpdating}
                  className={`p-1.5 rounded text-white ${
                    isUpdating 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                  }`}
                  title="Save changes"
                >
                  <FaCheck />
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              {comment.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem; 