import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import mockSchemes from '../data/mockSchemes';

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Fetch schemes
    const fetchSchemes = async () => {
      try {
        // Use the imported mock data
        setSchemes(mockSchemes);
      } catch (error) {
        console.error('Error fetching schemes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // Filter schemes based on search term and filter
  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && scheme.category === filter;
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Government Agricultural Schemes
      </h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <p className="text-gray-700 mb-4">
          Browse through various government schemes and subsidies available for farmers across India.
          These schemes provide financial assistance, equipment subsidies, crop insurance, and more to support agricultural activities.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
            <input
              type="text"
            placeholder="Search schemes by name, department, or keywords"
            className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <select
            className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="insurance">Crop Insurance</option>
            <option value="income">Income Support</option>
            <option value="credit">Credit & Finance</option>
            <option value="irrigation">Irrigation</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="cooperative">Cooperative Farming</option>
            <option value="sustainability">Sustainability</option>
          </select>
          </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src={scheme.imageUrl}
                  alt={scheme.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-green-700">{scheme.name}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(scheme.category)}`}>
                    {scheme.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {scheme.department}
                </p>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {scheme.description}
                </p>
                <Link
                  to={`/schemes/${scheme.id}`}
                  className="block w-full text-center py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
                >
                  View Details
                </Link>
              </div>
        </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-lg text-gray-500">No schemes found matching your search criteria.</p>
        </div>
      )}
      </div>
    </div>
  );
};

// Helper function for category badge colors
const getCategoryBadgeColor = (category) => {
  switch (category) {
    case 'insurance':
      return 'bg-blue-100 text-blue-800';
    case 'income':
      return 'bg-green-100 text-green-800';
    case 'credit':
      return 'bg-purple-100 text-purple-800';
    case 'irrigation':
      return 'bg-teal-100 text-teal-800';
    case 'infrastructure':
      return 'bg-orange-100 text-orange-800';
    case 'cooperative':
      return 'bg-pink-100 text-pink-800';
    case 'sustainability':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default Schemes; 