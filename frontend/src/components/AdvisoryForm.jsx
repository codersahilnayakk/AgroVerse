import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import advisoryService from '../services/advisoryService';
import handleApiError from '../utils/handleApiError';
import Spinner from './Spinner';
import { SOIL_TYPES, SEASONS, WATER_LEVELS, REGIONS } from '../data/agriDataset';
import { FaMicrophone, FaRobot } from 'react-icons/fa';

const AdvisoryForm = ({ onAdvisoryCreated }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [formData, setFormData] = useState({
    soilType: '',
    season: '',
    waterLevel: '',
    region: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Voice Recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Your browser doesn't support voice recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English

    recognition.onstart = () => {
      setListening(true);
      toast.info('Listening... Try saying "Black soil in Kharif for Punjab with Medium water"');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log('Heard:', transcript);
      
      let updatedForm = { ...formData };
      let found = false;

      // Extract Soil
      SOIL_TYPES.forEach(soil => {
        if (transcript.includes(soil.split(' ')[0].toLowerCase())) {
          updatedForm.soilType = soil;
          found = true;
        }
      });

      // Extract Season
      SEASONS.forEach(s => {
        if (transcript.includes(s.toLowerCase())) {
          updatedForm.season = s;
          found = true;
        }
      });

      // Extract Water
      WATER_LEVELS.forEach(w => {
        if (transcript.includes(w.toLowerCase())) {
          updatedForm.waterLevel = w;
          found = true;
        }
      });

      // Extract Region
      REGIONS.forEach(r => {
        if (transcript.includes(r.toLowerCase())) {
          updatedForm.region = r;
          found = true;
        }
      });

      if (found) {
        setFormData(updatedForm);
        toast.success("Voice inputs applied!");
      } else {
        toast.error("Couldn't match any specific agricultural keywords. Please try again or type manually.");
      }
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setListening(false);
      toast.error('Voice recognition failed.');
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.soilType || !formData.season || !formData.waterLevel || !formData.region) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const newAdvisory = await advisoryService.createAdvisory(formData, user.token);
      toast.success('AI Advisory Generated Successfully!');
      
      if (onAdvisoryCreated) {
        onAdvisoryCreated({ ...newAdvisory, ...formData });
      }
    } catch (error) {
      handleApiError(error, {
        defaultMessage: 'Failed to generate advisory. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100/50 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaRobot className="text-emerald-500" /> AI Farm Analyzer
          </h2>
          <p className="text-xs text-gray-500 mt-1">Enter your farm details to get intelligent insights</p>
        </div>
        
        <button 
          type="button" 
          onClick={startListening}
          className={`flex items-center justify-center p-3 rounded-full transition-all duration-300 shadow-sm ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
          title="Voice Assistant"
        >
          <FaMicrophone />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Soil Type *
          </label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-medium"
            required
          >
            <option value="">Select Soil Type</option>
            {SOIL_TYPES.map(soil => (
              <option key={soil} value={soil}>{soil}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Season *
          </label>
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-medium"
            required
          >
            <option value="">Select Season</option>
            {SEASONS.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Water Availability *
          </label>
          <select
            name="waterLevel"
            value={formData.waterLevel}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-medium"
            required
          >
            <option value="">Select Water Level</option>
            {WATER_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Region / State *
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm font-medium"
            required
          >
            <option value="">Select Region</option>
            {REGIONS.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/30 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? <Spinner size="sm" /> : 'Generate AI Recommendations'}
        </button>
      </form>
    </div>
  );
};

export default AdvisoryForm;