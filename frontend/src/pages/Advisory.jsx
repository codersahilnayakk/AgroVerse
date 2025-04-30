import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext.jsx';
import AdvisoryForm from '../components/AdvisoryForm';
import Spinner from '../components/Spinner';
import advisoryService from '../api/advisoryService';

function Advisory() {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
  };

  const handleDeleteAdvisory = async (id) => {
    if (!user?.token) {
      toast.error('Authentication token missing');
      navigate('/login');
      return;
    }

    try {
      await advisoryService.deleteAdvisory(id, user.token);
      setAdvisories(advisories.filter((advisory) => advisory._id !== id));
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

  if (loading) {
    return <Spinner />;
  }

  // If not authenticated, don't render the page
  if (!user) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Crop Advisory
        </h1>
        <p className="text-gray-600 mb-6">
          Get personalized crop recommendations based on your soil type, season,
          and water availability.
        </p>
        <AdvisoryForm onAdvisoryCreated={handleAdvisoryCreated} />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Your Previous Advisories
        </h2>
        {advisories.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500">
              You haven't created any advisories yet. Use the form to get crop
              recommendations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {advisories.map((advisory) => (
              <div
                key={advisory._id}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-green-700">
                      {advisory.soilType.charAt(0).toUpperCase() +
                        advisory.soilType.slice(1)}{' '}
                      Soil - {advisory.season.charAt(0).toUpperCase() +
                        advisory.season.slice(1)}{' '}
                      Season
                    </h3>
                    <p className="text-gray-500">
                      Water Level: {advisory.waterLevel.charAt(0).toUpperCase() +
                        advisory.waterLevel.slice(1)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteAdvisory(advisory._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                {/* Display recommended crops - check both field names */}
                {(advisory.recommendedCrops || (advisory.recommendations && advisory.recommendations.length > 0)) && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-600 mb-2">Recommended Crops:</h4>
                    <div className="flex flex-wrap gap-2">
                      {advisory.recommendedCrops ? 
                        advisory.recommendedCrops.map((crop, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                          >
                            {crop}
                          </span>
                        )) :
                        advisory.recommendations.map((rec, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                          >
                            {rec}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                )}

                {/* Display fertilizer tips */}
                {advisory.fertilizerTips && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-600 mb-2">Fertilizer Tips:</h4>
                    <p className="text-gray-700">{advisory.fertilizerTips}</p>
                  </div>
                )}

                {advisory.applicableSchemes && advisory.applicableSchemes.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-green-600 mb-2">Related Schemes:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {advisory.applicableSchemes.map((scheme) => (
                        <li key={scheme._id} className="text-gray-700">
                          <span className="font-medium">{scheme.name}</span> - {scheme.department}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Advisory; 