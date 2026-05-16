import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaCheckCircle, FaRupeeSign, FaFileAlt, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getFullImageUrl } from '../utils/imageUtils';

const CATEGORIES = [
  'All Categories',
  'Income Support',
  'Crop Insurance',
  'Equipment Subsidy',
  'Irrigation',
  'Soil Health',
  'Organic Farming',
  'Women Farmers',
  'Livestock',
  'Loan Assistance',
  'Infrastructure',
  'Credit',
  'Cooperative',
  'Sustainability',
  'Other'
];

const Schemes = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Categories');

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/schemes');
        setSchemes(response.data.schemes || response.data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
        toast.error('Failed to load schemes. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch = 
      scheme.schemeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'All Categories') return matchesSearch;
    return matchesSearch && scheme.category === filter;
  });

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="bg-emerald-800 rounded-3xl p-8 md:p-12 mb-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <span className="px-3 py-1 bg-emerald-700 text-emerald-100 text-xs font-bold uppercase tracking-wider rounded-full mb-4 inline-block border border-emerald-600">Official Govt Subsidies</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Government Agricultural Schemes
            </h1>
            <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
              Discover official financial assistance, equipment subsidies, and crop insurance programs designed to empower Indian farmers and accelerate agricultural growth.
            </p>
            
            {/* Search Bar inside Header */}
            <div className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-lg">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-emerald-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search schemes, departments, or benefits..."
                  className="pl-11 w-full px-4 py-3.5 bg-white/90 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative md:w-64 flex-shrink-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaFilter className="text-emerald-300 z-10" />
                </div>
                <select
                  className="pl-11 w-full px-4 py-3.5 bg-white/90 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none font-medium cursor-pointer"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {!loading && (
          <div className="mb-6 flex justify-between items-center text-sm font-semibold text-gray-500 px-2">
            <p>Showing {filteredSchemes.length} matching scheme{filteredSchemes.length !== 1 ? 's' : ''}</p>
          </div>
        )}

        {/* Schemes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredSchemes.map((scheme) => (
              <SchemeCard key={scheme._id} scheme={scheme} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 mt-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No schemes found</h3>
            <p className="text-gray-500 max-w-md mx-auto">We couldn't find any schemes matching your current search and filter criteria. Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => { setSearchTerm(''); setFilter('All Categories'); }}
              className="mt-6 px-6 py-2.5 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-100 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SchemeCard = ({ scheme }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* Banner */}
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <img
          src={getFullImageUrl(scheme.imageUrl) || `https://placehold.co/800x400/059669/ffffff?text=${encodeURIComponent(scheme.schemeName)}&font=Montserrat`}
          alt={scheme.schemeName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg shadow-sm ${getCategoryBadgeColor(scheme.category)}`}>
            {scheme.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-xs font-bold text-emerald-600 mb-2 tracking-wide uppercase">{scheme.department}</p>
        <h2 className="text-xl font-extrabold text-gray-900 mb-3 leading-tight line-clamp-2" title={scheme.schemeName}>
          {scheme.schemeName}
        </h2>
        
        <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
          {scheme.description}
        </p>

        {/* Feature Tags */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <FaCheckCircle className="text-emerald-500" />
            <span className="truncate">Eligibility: {scheme.eligibility?.substring(0, 40)}...</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <FaRupeeSign className="text-amber-500" />
            <span className="truncate">Benefits: {scheme.benefits?.substring(0, 40)}...</span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <Link
            to={`/schemes/${scheme._id}`}
            className="flex-1 text-center py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition duration-200"
          >
            View Scheme Details
          </Link>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-3 w-24 bg-gray-200 rounded-full mb-3"></div>
      <div className="h-6 w-full bg-gray-200 rounded-lg mb-2"></div>
      <div className="h-6 w-2/3 bg-gray-200 rounded-lg mb-6"></div>
      <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-6"></div>
      <div className="space-y-2 mb-6">
        <div className="h-8 w-full bg-gray-50 rounded-lg"></div>
        <div className="h-8 w-full bg-gray-50 rounded-lg"></div>
      </div>
      <div className="h-12 w-full bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

const getCategoryBadgeColor = (category) => {
  const map = {
    'Income Support': 'bg-green-100 text-green-800 border border-green-200',
    'Crop Insurance': 'bg-blue-100 text-blue-800 border border-blue-200',
    'Equipment Subsidy': 'bg-orange-100 text-orange-800 border border-orange-200',
    'Irrigation': 'bg-teal-100 text-teal-800 border border-teal-200',
    'Soil Health': 'bg-amber-100 text-amber-800 border border-amber-200',
    'Organic Farming': 'bg-lime-100 text-lime-800 border border-lime-200',
    'Women Farmers': 'bg-pink-100 text-pink-800 border border-pink-200',
    'Livestock': 'bg-red-100 text-red-800 border border-red-200',
    'Loan Assistance': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    'Infrastructure': 'bg-violet-100 text-violet-800 border border-violet-200',
    'Credit': 'bg-cyan-100 text-cyan-800 border border-cyan-200',
    'Cooperative': 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    'Sustainability': 'bg-sky-100 text-sky-800 border border-sky-200',
    'Other': 'bg-gray-100 text-gray-800 border border-gray-200'
  };
  return map[category] || map['Other'];
};

export default Schemes;