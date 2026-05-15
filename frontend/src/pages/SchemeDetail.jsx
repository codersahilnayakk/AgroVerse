import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt, FaCheckCircle, FaInfoCircle, FaFileAlt, FaCalendarAlt, FaBuilding, FaDownload, FaShareAlt, FaRegBookmark } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const SchemeDetail = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/schemes/${id}`);
        setScheme(response.data);
      } catch (error) {
        console.error('Error fetching scheme details:', error);
        toast.error('Failed to load scheme details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-5xl animate-pulse">
          <div className="h-4 w-32 bg-gray-200 rounded mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-3xl mb-8"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
              <div className="h-48 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-16 rounded-3xl shadow-sm border border-gray-100 max-w-lg">
          <FaFileAlt className="mx-auto text-5xl text-gray-200 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scheme Not Found</h2>
          <p className="text-gray-500 mb-8">The scheme you're looking for doesn't exist or has been removed from the portal.</p>
          <Link to="/schemes" className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition">
            <FaArrowLeft className="mr-2" /> Browse All Schemes
          </Link>
        </div>
      </div>
    );
  }

  const parseDocumentsList = (documentsString) => {
    if (!documentsString) return [];
    return documentsString.split(',').map(item => item.trim());
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/schemes" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Schemes
          </Link>
          <div className="flex gap-3">
            <button className="p-2 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-emerald-600 transition" title="Share Scheme">
              <FaShareAlt />
            </button>
            <button 
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 border rounded-xl transition ${bookmarked ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`} 
              title="Bookmark Scheme"
            >
              <FaRegBookmark />
            </button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden mb-8">
          <div className="relative h-64 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
            <img
              src={scheme.imageUrl || `https://placehold.co/1200x600/059669/ffffff?text=${encodeURIComponent(scheme.schemeName)}`}
              alt={scheme.schemeName}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`text-xs uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg shadow-sm ${getCategoryBadgeColor(scheme.category)}`}>
                  {scheme.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/30">
                  <FaBuilding className="text-emerald-300" /> {scheme.department}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                {scheme.schemeName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-emerald-50">
                <span className="flex items-center gap-2"><FaCalendarAlt className="text-emerald-400" /> Deadline: {scheme.deadline || 'Year-round'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-emerald-500" /> Scheme Overview
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {scheme.description}
              </p>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaCheckCircle className="text-emerald-500" /> Eligibility Criteria
              </h2>
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                <p className="text-gray-700 leading-relaxed">
                  {scheme.eligibility}
                </p>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-600 p-1.5 rounded-lg">₹</span> Financial Benefits & Subsidies
              </h2>
              <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                <p className="text-gray-700 leading-relaxed">
                  {scheme.benefits}
                </p>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Action Card */}
            <div className="bg-emerald-800 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700 rounded-full blur-2xl opacity-60 -mr-10 -mt-10"></div>
              <h3 className="text-xl font-bold mb-2 relative z-10">Ready to Apply?</h3>
              <p className="text-emerald-100 text-sm mb-6 relative z-10">Make sure you have all required documents before starting your application.</p>
              
              {scheme.applicationLink ? (
                <a
                  href={scheme.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white text-emerald-800 text-sm font-extrabold rounded-xl hover:bg-emerald-50 transition-colors relative z-10"
                >
                  Visit Official Portal <FaExternalLinkAlt />
                </a>
              ) : (
                <button disabled className="w-full px-6 py-4 bg-emerald-700/50 text-emerald-300 text-sm font-extrabold rounded-xl cursor-not-allowed">
                  Offline Application Only
                </button>
              )}
            </div>

            {/* Documents Required */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <FaFileAlt className="text-blue-500" /> Required Documents
              </h3>
              <ul className="space-y-3">
                {parseDocumentsList(scheme.documents).map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="min-w-[20px] h-5 w-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{doc}</span>
                  </li>
                ))}
                {parseDocumentsList(scheme.documents).length === 0 && (
                  <li className="text-sm text-gray-400 italic">No specific documents listed.</li>
                )}
              </ul>
            </div>

            {/* Application Process */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaExternalLinkAlt className="text-purple-500" /> How to Apply
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {scheme.applicationProcess || 'Please visit the official portal or your local agriculture department office for detailed application procedures.'}
              </p>
            </div>

            {/* AI Advisory Callout */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-lg border border-gray-700 text-center">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Not sure if this fits?</h3>
              <p className="text-sm text-gray-400 mb-6">Our AI Farm Analyzer can check if your farm parameters are a match for this scheme.</p>
              <Link to="/advisory" className="inline-block w-full py-3 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded-xl transition border border-gray-600">
                Run AI Analysis
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const getCategoryBadgeColor = (category) => {
  const map = {
    'Income Support': 'bg-green-100 text-green-800 border-green-200',
    'Crop Insurance': 'bg-blue-100 text-blue-800 border-blue-200',
    'Equipment Subsidy': 'bg-orange-100 text-orange-800 border-orange-200',
    'Irrigation': 'bg-teal-100 text-teal-800 border-teal-200',
    'Soil Health': 'bg-amber-100 text-amber-800 border-amber-200',
    'Organic Farming': 'bg-lime-100 text-lime-800 border-lime-200',
    'Women Farmers': 'bg-pink-100 text-pink-800 border-pink-200',
    'Livestock': 'bg-red-100 text-red-800 border-red-200',
    'Loan Assistance': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Other': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return map[category] || map['Other'];
};

export default SchemeDetail;