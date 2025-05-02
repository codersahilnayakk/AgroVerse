import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext.jsx';
import AdvisoryForm from '../components/AdvisoryForm';
import Spinner from '../components/Spinner';
import advisoryService from '../api/advisoryService';
import { format } from 'date-fns';

function Advisory() {
  const [advisories, setAdvisories] = useState([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Format date with better error handling
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  useEffect(() => {
    // Check if user is authenticated, if not redirect to login
    if (!user) {
      toast.error('Please log in to access advisory features');
      navigate('/login');
      return;
    }

    const fetchAdvisories = async () => {
      try {
        if (!user?.token) {
          toast.error('Authentication token missing');
          navigate('/login');
          return;
        }

        const data = await advisoryService.getAdvisories(user.token);
        setAdvisories(data);
        
        // Set the most recent advisory as selected if there is one
        if (data.length > 0) {
          setSelectedAdvisory(data[0]);
        }
      } catch (error) {
        console.error('Error fetching advisories:', error);
        const errorMessage = error.response?.data?.message || 'Error fetching advisories';
        toast.error(errorMessage);
        
        // If unauthorized or invalid token, redirect to login
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisories();
  }, [user, navigate]);

  const handleAdvisoryCreated = (newAdvisory) => {
    setAdvisories(prevAdvisories => [newAdvisory, ...prevAdvisories]);
    setSelectedAdvisory(newAdvisory);
  };

  const handleDeleteAdvisory = async (id) => {
    if (!user?.token) {
      toast.error('Authentication token missing');
      navigate('/login');
      return;
    }

    try {
      await advisoryService.deleteAdvisory(id, user.token);
      const updatedAdvisories = advisories.filter((advisory) => advisory._id !== id);
      setAdvisories(updatedAdvisories);
      
      // If we deleted the selected advisory, select the next one if available
      if (selectedAdvisory && selectedAdvisory._id === id) {
        setSelectedAdvisory(updatedAdvisories.length > 0 ? updatedAdvisories[0] : null);
      }
      
      toast.success('Advisory deleted');
    } catch (error) {
      console.error('Error deleting advisory:', error);
      const errorMessage = error.response?.data?.message || 'Error deleting advisory';
      toast.error(errorMessage);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleSelectAdvisory = (advisory) => {
    setSelectedAdvisory(advisory);
  };

  if (loading) {
    return <Spinner />;
  }

  // If not authenticated, don't render the page
  if (!user) {
    return null;
  }

  // Get capitalized text with fallback
  const getCapitalized = (text) => {
    if (!text) return 'Unknown';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Helper function to safely render array or string content
  const renderContent = (content) => {
    if (!content) return <p className="text-gray-500 italic">Not available</p>;
    
    if (Array.isArray(content)) {
      if (content.length === 0) return <p className="text-gray-500 italic">Not available</p>;
      return content.map((item, index) => <p key={index} className="mb-1">{item}</p>);
    }
    
    // Handle string with possible line breaks
    if (typeof content === 'string') {
      return content.split('\n').map((line, index) => (
        <p key={index} className="mb-1">{line}</p>
      ));
    }
    
    // Fallback for any other data type
    return <p className="text-gray-700">{JSON.stringify(content)}</p>;
  };

  // Safely get array data regardless of format
  const getArrayData = (field) => {
    if (!selectedAdvisory) return [];
    
    // Try different field names
    const fieldNames = [field];
    
    // Add alternate field names
    if (field === 'fertilizerTips') fieldNames.push('fertilizerRecommendations');
    if (field === 'fertilizerRecommendations') fieldNames.push('fertilizerTips');
    
    // Try each field name
    for (const name of fieldNames) {
      const data = selectedAdvisory[name];
      if (!data) continue;
      
      // If it's already an array, return it
      if (Array.isArray(data)) return data;
      
      // If it's a string with line breaks, split it into an array
      if (typeof data === 'string' && data.includes('\n')) {
        return data.split('\n').filter(line => line.trim());
      }
      
      // If it's a plain string, make it a single-item array
      if (typeof data === 'string' && data.trim()) {
        return [data];
      }
    }
    
    return [];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Crop Advisory
      </h1>
      
      <div className="grid md:grid-cols-12 gap-8">
        {/* Left column - Form and History */}
        <div className="md:col-span-4">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Get New Recommendations
            </h2>
            <p className="text-gray-600 mb-4">
              Get personalized crop recommendations based on your soil type, season,
              and water availability.
            </p>
            <AdvisoryForm onAdvisoryCreated={handleAdvisoryCreated} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Your Previous Advisories
            </h2>
            
            {advisories.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">
                  You haven't created any advisories yet. Use the form to get crop
                  recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {advisories.map((advisory) => (
                  <div
                    key={advisory._id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedAdvisory && selectedAdvisory._id === advisory._id 
                        ? 'bg-green-100 border-2 border-green-500' 
                        : 'bg-gray-100 hover:bg-green-50'
                    }`}
                    onClick={() => handleSelectAdvisory(advisory)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-green-700">
                          {getCapitalized(advisory.soilType)} - {getCapitalized(advisory.season)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Water: {getCapitalized(advisory.waterLevel)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(advisory.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAdvisory(advisory._id);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Detailed Advisory View */}
        <div className="md:col-span-8">
          {selectedAdvisory ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-2xl font-bold text-green-700">
                  Advisory Report
                </h2>
                <p className="text-gray-500">
                  Generated on: {formatDate(selectedAdvisory.createdAt)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {getCapitalized(selectedAdvisory.soilType)} Soil
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {getCapitalized(selectedAdvisory.season)} Season
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    {getCapitalized(selectedAdvisory.waterLevel)} Water
                  </span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Recommended Crops */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-3 border-b pb-2">
                    <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2">1</span>
                    Recommended Crops
                  </h3>
                  {selectedAdvisory.recommendedCrops && selectedAdvisory.recommendedCrops.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedAdvisory.recommendedCrops.map((crop, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No crop recommendations available</p>
                  )}
                </div>
                
                {/* Soil Management Tips */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-3 border-b pb-2">
                    <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2">2</span>
                    Soil Management
                  </h3>
                  <div className="text-gray-700">
                    {renderContent(getArrayData('soilManagementTips'))}
                  </div>
                </div>

                {/* Fertilizer Recommendations */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-3 border-b pb-2">
                    <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2">3</span>
                    Fertilizer Recommendations
                  </h3>
                  <div className="text-gray-700">
                    {renderContent(getArrayData('fertilizerTips') || getArrayData('fertilizerRecommendations'))}
                  </div>
                </div>
                
                {/* Irrigation Strategy */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-3 border-b pb-2">
                    <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2">4</span>
                    Irrigation Strategy
                  </h3>
                  <div className="text-gray-700">
                    {renderContent(getArrayData('irrigationStrategy'))}
                  </div>
                </div>
                
                {/* Sowing & Harvesting Calendar */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-3 border-b pb-2">
                    <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2">5</span>
                    Sowing & Harvesting Calendar
                  </h3>
                  <div className="text-gray-700">
                    {renderContent(getArrayData('sowingHarvestingCalendar'))}
                  </div>
                </div>
                
                {/* Market Price Trends */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-3 border-b pb-2">
                    <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2">6</span>
                    Market Price Trends
                  </h3>
                  {typeof selectedAdvisory.marketPriceTrends === 'string' && selectedAdvisory.marketPriceTrends ? (
                    <div className="text-gray-700">
                      {renderContent(selectedAdvisory.marketPriceTrends)}
                    </div>
                  ) : Array.isArray(selectedAdvisory.marketPriceTrends) && selectedAdvisory.marketPriceTrends.length > 0 ? (
                    <div className="space-y-2">
                      {selectedAdvisory.marketPriceTrends.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                          <span className="font-medium">{item.crop || "Crop"}</span>
                          <div className="flex items-center">
                            <span className="text-gray-700">
                              {item.price && item.unit ? `₹${item.price}/${item.unit}` : 'Price varies'}
                            </span>
                            {item.trend && (
                              <span className={`ml-2 ${
                                item.trend === 'up' ? 'text-green-600' : 
                                item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No market price information available</p>
                  )}
                </div>
                
                {/* Soil Testing Recommendations */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-3 border-b pb-2">
                    <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2">7</span>
                    Soil Testing Recommendations
                  </h3>
                  <div className="text-gray-700">
                    {renderContent(getArrayData('soilTestingRecommendations'))}
                  </div>
                </div>
                
                {/* Government Schemes - if available */}
                {selectedAdvisory.governmentSchemes && selectedAdvisory.governmentSchemes.length > 0 && (
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-700 mb-3 border-b pb-2">
                      <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2">8</span>
                      Government Schemes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAdvisory.governmentSchemes.map((scheme, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {scheme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-full">
              <img
                src="/assets/images/farm.svg"
                alt="Farm illustration"
                className="w-1/2 max-w-xs mb-6 opacity-75"
              />
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                No Advisory Selected
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Select an existing advisory from the list or create a new one to
                view detailed recommendations for your farm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Advisory; 