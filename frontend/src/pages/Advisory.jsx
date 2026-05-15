import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import AdvisoryForm from '../components/AdvisoryForm';
import Spinner from '../components/Spinner';
import advisoryService from '../services/advisoryService';
import { format } from 'date-fns';

import { 
  FaLeaf, FaTint, FaMapMarkerAlt, FaSun, FaChartLine, 
  FaThermometerHalf, FaCheckCircle, FaExclamationTriangle, 
  FaCloudRain, FaSortAmountDown, FaHistory, FaStar
} from 'react-icons/fa';

function Advisory() {
  const [advisories, setAdvisories] = useState([]);
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('score'); // score, profit, yield
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, h:mm a');
    } catch (error) {
      return 'N/A';
    }
  };

  useEffect(() => {
    // Add Google Translate Script
    const addGoogleTranslate = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: 'en,hi,gu,pa,mr', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
            'google_translate_element'
          );
        };
      }
    };
    addGoogleTranslate();
  }, []);

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to access advisory features');
      navigate('/login');
      return;
    }

    const fetchAdvisories = async () => {
      try {
        if (!user?.token) return;
        const data = await advisoryService.getAdvisories(user.token);
        if (Array.isArray(data)) {
          setAdvisories(data);
          if (data.length > 0) {
            handleSelectAdvisory(data[0]);
          }
        } else {
          setAdvisories([]);
        }
      } catch (error) {
        console.error('Error fetching advisories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisories();
  }, [user, navigate]);

  const handleSelectAdvisory = async (advisory) => {
    setSelectedAdvisory(advisory);
    setAiData(null); // Clear previous data while loading
    try {
      const generated = await advisoryService.getRecommendations({
        soilType: advisory.soilType,
        season: advisory.season,
        waterLevel: advisory.waterLevel,
        region: advisory.region || 'Maharashtra'
      });
      setAiData(generated);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      toast.error('Failed to load recommendations');
    }
  };

  const handleAdvisoryCreated = (newAdvisory) => {
    setAdvisories(prev => [newAdvisory, ...prev]);
    handleSelectAdvisory(newAdvisory);
  };

  const handleDeleteAdvisory = async (id) => {
    try {
      await advisoryService.deleteAdvisory(id, user.token);
      const updated = advisories.filter(a => a._id !== id);
      setAdvisories(updated);
      if (selectedAdvisory && selectedAdvisory._id === id) {
        if (updated.length > 0) handleSelectAdvisory(updated[0]);
        else {
          setSelectedAdvisory(null);
          setAiData(null);
        }
      }
      toast.success('Advisory deleted');
    } catch (error) {
      toast.error('Error deleting advisory');
    }
  };

  const getSortedCrops = () => {
    if (!aiData || !aiData.crops) return [];
    let crops = [...aiData.crops];
    if (sortBy === 'profit') {
      crops.sort((a, b) => b.profitScore - a.profitScore);
    } else if (sortBy === 'score') {
      crops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    }
    return crops;
  };

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI Crop Advisory</h1>
            <p className="text-gray-500 mt-2 text-sm max-w-2xl">
              Get personalized, data-driven agricultural recommendations powered by our advanced Agritech AI engine.
            </p>
          </div>
          <div id="google_translate_element" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-sm"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: FORM & HISTORY */}
          <div className="lg:col-span-4 space-y-6">
            <AdvisoryForm onAdvisoryCreated={handleAdvisoryCreated} />
            
            {/* History Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FaHistory className="text-emerald-500" /> Previous Advisories
              </h3>
              
              {advisories.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">No advisories yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {advisories.map((adv) => (
                    <div
                      key={adv._id}
                      onClick={() => handleSelectAdvisory(adv)}
                      className={`relative overflow-hidden group cursor-pointer p-4 rounded-xl border transition-all duration-300 ${
                        selectedAdvisory?._id === adv._id 
                          ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                          : 'bg-white border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/30'
                      }`}
                    >
                      {selectedAdvisory?._id === adv._id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl"></div>
                      )}
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-md">
                              {adv.soilType}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 rounded-md">
                              {adv.waterLevel} Water
                            </span>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {adv.region || 'Unknown Region'} • {adv.season}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            {formatDate(adv.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteAdvisory(adv._id); }}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: AI INSIGHTS & RESULTS */}
          <div className="lg:col-span-8">
            {!selectedAdvisory || !aiData ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center h-full min-h-[600px]">
                <div className="w-48 h-48 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                  <FaLeaf className="text-6xl text-emerald-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">AI Farming Intelligence</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Enter your farm parameters on the left to receive intelligent, data-driven crop recommendations, climate insights, and risk analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* AI Insights Banner */}
                <div className="bg-gradient-to-br from-emerald-800 to-green-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute right-20 -bottom-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-400" /> Advisory Summary
                      </h2>
                      <div className="flex flex-wrap gap-3 mt-3 text-sm font-medium text-emerald-100">
                        <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-emerald-400" /> {selectedAdvisory.region}</span>
                        <span className="flex items-center gap-1.5"><FaLeaf className="text-emerald-400" /> {selectedAdvisory.soilType}</span>
                        <span className="flex items-center gap-1.5"><FaSun className="text-emerald-400" /> {selectedAdvisory.season}</span>
                        <span className="flex items-center gap-1.5"><FaTint className="text-emerald-400" /> {selectedAdvisory.waterLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-emerald-700/50">
                    <ul className="space-y-2">
                      {aiData.insights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-emerald-50">
                          <FaStar className="text-yellow-400 mt-1 shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900">Recommended Crops ({aiData.crops.length})</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <FaSortAmountDown /> Sort By
                    </span>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="score">Suitability Score</option>
                      <option value="profit">Profitability</option>
                    </select>
                  </div>
                </div>

                {/* Crops Grid */}
                {getSortedCrops().length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center">
                    <FaExclamationTriangle className="text-4xl text-amber-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900">No Perfect Matches Found</h3>
                    <p className="text-gray-500 mt-1 text-sm">Your specific soil and water combination is highly irregular for this season. Please consult a local agricultural extension office.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {getSortedCrops().map((crop, idx) => (
                      <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                        <div className="h-40 overflow-hidden relative">
                          <img 
                            src={crop.image} 
                            alt={crop.name} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/600x400/10b981/ffffff?text=${crop.name}&font=Montserrat`;
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          
                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold rounded-lg shadow-sm">
                              {crop.name}
                            </span>
                          </div>
                          
                          {/* Score Ring */}
                          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white">
                            {crop.suitabilityScore}%
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <div className="flex gap-4 text-xs font-medium">
                              <span className="flex items-center gap-1"><FaChartLine className={crop.profitScore > 80 ? 'text-green-400' : 'text-yellow-400'} /> Profit: {crop.profitability}</span>
                              <span className="flex items-center gap-1"><FaTint className="text-blue-300" /> {crop.waterReq}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <div className="space-y-4">
                            {/* Key Stats */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Est. Yield</span>
                                <span className="font-semibold text-gray-800">{crop.baseYield}</span>
                              </div>
                              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Duration</span>
                                <span className="font-semibold text-gray-800">{crop.harvestDuration}</span>
                              </div>
                            </div>

                            {/* Fertilizer */}
                            <div>
                              <h4 className="text-xs font-bold text-gray-900 mb-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Fertilizer Req.
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed">{crop.fertilizers}</p>
                            </div>
                            
                            {/* Weather */}
                            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
                              <h4 className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-2">Climate Intelligence</h4>
                              <div className="flex justify-between text-xs font-medium text-blue-900">
                                <span className="flex items-center gap-1"><FaThermometerHalf /> {crop.weatherInfo.temp}</span>
                                <span className="flex items-center gap-1"><FaCloudRain /> Drought Risk: {crop.weatherInfo.droughtRisk}</span>
                              </div>
                            </div>
                            
                            {/* Diseases */}
                            <div>
                              <h4 className="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                <FaExclamationTriangle className="text-red-500" /> Disease Risks
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {crop.diseaseRisks.map(d => (
                                  <span key={d} className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-md border border-red-100">
                                    {d}
                                  </span>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Advisory;