import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt, FaCheckCircle, FaInfoCircle, FaFileAlt, FaCalendarAlt } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import mockSchemes from '../data/mockSchemes';

const SchemeDetail = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the specific scheme
    const fetchScheme = async () => {
      try {
        // In a real application, you would fetch from API
        // For now, use the mock data
        const foundScheme = mockSchemes.find(s => s.id === id);
        setScheme(foundScheme);
      } catch (error) {
        console.error('Error fetching scheme details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!scheme) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Scheme Not Found</h2>
        <p className="text-gray-700 mb-6">The scheme you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/schemes"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/schemes"
        className="inline-flex items-center text-green-600 hover:text-green-700 mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to All Schemes
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img
            src={scheme.imageUrl}
            alt={scheme.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(scheme.category)}`}>
                {scheme.category}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-white text-gray-700">
                {scheme.department}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{scheme.name}</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-green-700 mb-3">About the Scheme</h2>
            <p className="text-gray-700">{scheme.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h2 className="flex items-center text-lg font-semibold text-green-700 mb-3">
                  <FaCheckCircle className="mr-2" /> Eligibility
                </h2>
                <p className="text-gray-700">{scheme.eligibility}</p>
              </div>

              <div className="mb-6">
                <h2 className="flex items-center text-lg font-semibold text-green-700 mb-3">
                  <FaInfoCircle className="mr-2" /> Benefits
                </h2>
                <p className="text-gray-700">{scheme.benefits}</p>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h2 className="flex items-center text-lg font-semibold text-green-700 mb-3">
                  <FaFileAlt className="mr-2" /> Required Documents
                </h2>
                <ul className="list-disc pl-5 text-gray-700">
                  {scheme.documents && scheme.documents.map((doc, index) => (
                    <li key={index} className="mb-1">{doc}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h2 className="flex items-center text-lg font-semibold text-green-700 mb-3">
                  <FaCalendarAlt className="mr-2" /> Application Process & Deadline
                </h2>
                <p className="text-gray-700 mb-2">{scheme.applicationProcess}</p>
                <p className="text-gray-700">
                  <strong>Deadline:</strong> {scheme.deadline}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href={scheme.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Visit Official Website <FaExternalLinkAlt className="ml-2" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Related Agricultural Advisory</h2>
        <div className="bg-green-50 p-6 rounded-lg shadow-sm">
          <p className="text-gray-700 mb-4">
            For more personalized guidance on how this scheme can benefit your farm, 
            use our Advisory service to get crop and scheme recommendations tailored to your farming conditions.
          </p>
          <Link
            to="/advisory"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Get Personalized Advisory
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper function for category badge colors (same as in Schemes.jsx)
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

export default SchemeDetail; 