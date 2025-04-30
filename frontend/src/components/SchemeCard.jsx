import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBookmark, FaRegBookmark, FaBuilding, FaChevronRight } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import formatDate from '../utils/formatDate';
import schemeService from '../services/schemeService';
import { toast } from 'react-toastify';

const SchemeCard = ({ scheme, refreshSchemes }) => {
  const { user } = useContext(AuthContext);
  
  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to bookmark schemes');
      return;
    }
    
    try {
      await schemeService.bookmarkScheme(scheme._id);
      if (refreshSchemes) refreshSchemes();
      toast.success(scheme.isBookmarked ? 'Bookmark removed' : 'Scheme bookmarked');
    } catch (error) {
      toast.error('Failed to update bookmark');
      console.error('Bookmark error:', error);
    }
  };
  
  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{scheme.name}</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full" 
                style={{ 
                  backgroundColor: scheme.status === 'Active' ? '#dcfce7' : '#fee2e2',
                  color: scheme.status === 'Active' ? '#166534' : '#b91c1c' 
                }}>
            {scheme.status}
          </span>
        </div>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <FaCalendarAlt className="mr-2" />
          <span>Deadline: {scheme.deadline ? formatDate(scheme.deadline) : 'No deadline'}</span>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-3">
          <FaBuilding className="mr-2" />
          <span>{scheme.department}</span>
        </div>

        <p className="text-gray-700 mb-4">{truncateText(scheme.description)}</p>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-medium text-green-600">
              {scheme.fundingAmount ? `₹${scheme.fundingAmount.toLocaleString()}` : 'Variable funding'}
            </span>
          </div>
          <Link 
            to={`/schemes/${scheme._id}`} 
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            View Details <FaChevronRight className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard; 