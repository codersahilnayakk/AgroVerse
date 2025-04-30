import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import advisoryService from '../api/advisoryService';
import handleApiError from '../utils/handleApiError';
import Spinner from './Spinner';

const AdvisoryForm = ({ onAdvisoryCreated }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    soilType: '',
    season: '',
    waterLevel: '',
    region: ''
  });

  const soilTypes = [
    { value: 'alluvial', label: 'Alluvial Soil' },
    { value: 'black', label: 'Black Soil' },
    { value: 'red', label: 'Red Soil' },
    { value: 'laterite', label: 'Laterite Soil' },
    { value: 'mountainous', label: 'Mountain Soil' },
    { value: 'desert', label: 'Desert Soil' },
    { value: 'saline', label: 'Saline Soil' }
  ];

  const seasons = [
    { value: 'kharif', label: 'Kharif (Monsoon)' },
    { value: 'rabi', label: 'Rabi (Winter)' },
    { value: 'zaid', label: 'Zaid (Summer)' }
  ];

  const waterLevels = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const regions = [
    { value: 'north', label: 'North India' },
    { value: 'south', label: 'South India' },
    { value: 'east', label: 'East India' },
    { value: 'west', label: 'West India' },
    { value: 'central', label: 'Central India' },
    { value: 'northeast', label: 'North-East India' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.soilType || !formData.season || !formData.waterLevel) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const newAdvisory = await advisoryService.createAdvisory(formData, user.token);
      toast.success('Advisory created successfully');
      
      // Reset form
      setFormData({
        soilType: '',
        season: '',
        waterLevel: '',
        region: ''
      });
      
      // Pass the new advisory to parent component
      if (onAdvisoryCreated) {
        onAdvisoryCreated(newAdvisory);
      }
    } catch (error) {
      handleApiError(error, {
        defaultMessage: 'Failed to create advisory. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-green-700 mb-4">
        Get Crop Recommendations
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Soil Type*
          </label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select Soil Type</option>
            {soilTypes.map(soil => (
              <option key={soil.value} value={soil.value}>
                {soil.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Season*
          </label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select Season</option>
            {seasons.map(season => (
              <option key={season.value} value={season.value}>
                {season.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Water Availability*
          </label>
          <select
            name="waterLevel"
            value={formData.waterLevel}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="">Select Water Level</option>
            {waterLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Region (Optional)
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Region</option>
            {regions.map(region => (
              <option key={region.value} value={region.value}>
                {region.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Selecting a region helps us provide more accurate recommendations
          </p>
        </div>
        
        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? <Spinner size="sm" /> : 'Get Recommendations'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvisoryForm; 