import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import advisoryService from '../api/advisoryService';
import handleApiError from '../utils/handleApiError';
import Spinner from './Spinner';

const AdvisoryForm = ({ onAdvisoryCreated }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [formData, setFormData] = useState({
    soilType: '',
    season: '',
    waterLevel: '',
    region: ''
  });
  
  const [availableCombinations, setAvailableCombinations] = useState({
    soilTypes: [],
    seasons: [],
    waterLevels: [],
    combinations: []
  });

  // Default options in case API fails
  const defaultSoilTypes = [
    { value: 'Alluvial', label: 'Alluvial Soil' },
    { value: 'Black', label: 'Black Soil' },
    { value: 'Red', label: 'Red Soil' },
    { value: 'Laterite', label: 'Laterite Soil' },
    { value: 'Mountain', label: 'Mountain Soil' },
    { value: 'Desert', label: 'Desert Soil' },
    { value: 'Saline', label: 'Saline Soil' }
  ];

  const defaultSeasons = [
    { value: 'Kharif', label: 'Kharif (Monsoon)' },
    { value: 'Rabi', label: 'Rabi (Winter)' },
    { value: 'Zaid', label: 'Zaid (Summer)' }
  ];

  const defaultWaterLevels = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];

  const regions = [
    { value: 'north', label: 'North India' },
    { value: 'south', label: 'South India' },
    { value: 'east', label: 'East India' },
    { value: 'west', label: 'West India' },
    { value: 'central', label: 'Central India' },
    { value: 'northeast', label: 'North-East India' }
  ];

  // Get available combinations from API
  useEffect(() => {
    const fetchCombinations = async () => {
      try {
        const data = await advisoryService.getAdvisoryCombinations();
        
        // Format soil types for dropdown
        const soilTypeOptions = data.soilTypes.map(type => ({
          value: type,
          label: `${type} Soil`
        }));
        
        // Format seasons for dropdown
        const seasonOptions = data.seasons.map(season => {
          let label = season;
          if (season === 'Kharif') label += ' (Monsoon)';
          if (season === 'Rabi') label += ' (Winter)';
          if (season === 'Zaid') label += ' (Summer)';
          return { value: season, label };
        });
        
        // Format water levels for dropdown
        const waterLevelOptions = data.waterLevels.map(level => ({
          value: level,
          label: level
        }));
        
        setAvailableCombinations({
          soilTypes: soilTypeOptions.length > 0 ? soilTypeOptions : defaultSoilTypes,
          seasons: seasonOptions.length > 0 ? seasonOptions : defaultSeasons,
          waterLevels: waterLevelOptions.length > 0 ? waterLevelOptions : defaultWaterLevels,
          combinations: data.combinations || []
        });
      } catch (error) {
        console.error('Error fetching advisory combinations:', error);
        // Use default values if API fails
        setAvailableCombinations({
          soilTypes: defaultSoilTypes,
          seasons: defaultSeasons,
          waterLevels: defaultWaterLevels,
          combinations: []
        });
      } finally {
        setFormLoading(false);
      }
    };
    
    fetchCombinations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get available options based on selected values
  const getFilteredOptions = (field) => {
    if (!formData.soilType && !formData.season && !formData.waterLevel) {
      // If nothing selected yet, return all options
      switch (field) {
        case 'soilType': return availableCombinations.soilTypes;
        case 'season': return availableCombinations.seasons;
        case 'waterLevel': return availableCombinations.waterLevels;
        default: return [];
      }
    }

    // Filter combinations based on selected values
    const filteredCombinations = availableCombinations.combinations.filter(combo => {
      if (formData.soilType && combo.soilType !== formData.soilType) return false;
      if (formData.season && combo.season !== formData.season) return false;
      if (formData.waterLevel && combo.waterLevel !== formData.waterLevel) return false;
      return true;
    });

    // Extract unique values for the requested field
    const uniqueValues = [...new Set(filteredCombinations.map(combo => combo[field]))];
    
    // Format values as options
    switch (field) {
      case 'soilType': 
        return availableCombinations.soilTypes.filter(opt => uniqueValues.includes(opt.value));
      case 'season': 
        return availableCombinations.seasons.filter(opt => uniqueValues.includes(opt.value));
      case 'waterLevel': 
        return availableCombinations.waterLevels.filter(opt => uniqueValues.includes(opt.value));
      default: 
        return [];
    }
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

  if (formLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

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
            {getFilteredOptions('soilType').map(soil => (
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
            {getFilteredOptions('season').map(season => (
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
            {getFilteredOptions('waterLevel').map(level => (
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