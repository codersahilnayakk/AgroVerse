import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';

const CommentForm = ({ onSubmit, initialValue = '', isEdit = false, onCancel }) => {
  const [text, setText] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }

    if (!text.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await onSubmit(text.trim());
      if (success) {
        setText('');
        if (isEdit && onCancel) {
          onCancel();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex flex-col">
        <textarea
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 
                     bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
          placeholder={user ? "Add a comment..." : "Please log in to comment"}
          rows="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!user || isSubmitting}
        ></textarea>
        
        <div className="flex justify-end items-center mt-3">
          {isEdit && (
            <button
              type="button"
              onClick={onCancel}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 
                        rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 
                        dark:hover:bg-gray-600 focus:outline-none"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center 
                      ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                      transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500`}
            disabled={!user || isSubmitting || !text.trim()}
          >
            <FaPaperPlane className="mr-1" />
            {isEdit ? 'Update' : 'Post'} Comment
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm; 