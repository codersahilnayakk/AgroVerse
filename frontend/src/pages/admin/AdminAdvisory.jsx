import { useContext, useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaLeaf, FaSun, FaTint, FaSeedling } from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';

const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Year-round'];
const SOILS = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay', 'Loamy', 'Mountainous', 'Desert', 'Saline'];
const WATER_LEVELS = ['Low', 'Medium', 'High'];

const EMPTY = { 
  soilType: '', 
  season: '', 
  waterLevel: '', 
  recommendedCrops: '', 
  fertilizerTips: '', 
  soilManagementTips: '', 
  sowingHarvestingCalendar: '' 
};

export default function AdminAdvisory() {
  const { adminApi } = useContext(AdminContext);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    adminApi.get('/advisories').then(r => setAdvisories(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  
  const openEdit = (a) => { 
    setEditing(a._id); 
    setForm({
      ...a,
      recommendedCrops: Array.isArray(a.recommendedCrops) ? a.recommendedCrops.join(', ') : a.recommendedCrops,
      soilManagementTips: Array.isArray(a.soilManagementTips) ? a.soilManagementTips.join('\\n') : a.soilManagementTips
    }); 
    setModal(true); 
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Parse commas for crops
    const payload = {
      ...form,
      recommendedCrops: form.recommendedCrops.split(',').map(c => c.trim()).filter(c => c)
    };

    if (editing) await adminApi.put(`/advisories/${editing}`, payload);
    else await adminApi.post('/advisories', payload);
    
    setModal(false); 
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this advisory template?')) return;
    await adminApi.delete(`/advisories/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Crop Advisory Templates</h1>
          <p className="text-gray-500 text-sm mt-1">Manage global AI advisory rules for Soil, Season, and Water combinations.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
          <FaPlus className="text-xs" /> Add Template
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? [...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />) :
          advisories.map(a => (
            <div key={a._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 flex items-center gap-1">
                    <FaLeaf /> {a.soilType}
                  </span>
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 flex items-center gap-1">
                    <FaSun /> {a.season}
                  </span>
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 flex items-center gap-1">
                    <FaTint /> {a.waterLevel}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><FaEdit className="text-sm" /></button>
                  <button onClick={() => handleDelete(a._id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><FaTrash className="text-sm" /></button>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><FaSeedling /> Recommended Crops</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {a.recommendedCrops?.map((crop, i) => (
                    <span key={i} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded border border-emerald-100">
                      {crop}
                    </span>
                  ))}
                </div>
                
                {a.fertilizerTips && (
                  <div className="mb-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase">Fertilizer Tips</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{a.fertilizerTips}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        }
        {!loading && !advisories.length && (
          <div className="col-span-full text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
            <FaLeaf className="mx-auto text-4xl text-emerald-100 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Templates Found</h3>
            <p className="text-sm text-gray-500">Create your first advisory template to power the AI engine.</p>
            <button onClick={openNew} className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-100 transition-colors">
              Add Template Now
            </button>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-extrabold text-gray-900">{editing ? 'Edit Template' : 'New Advisory Template'}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"><FaTimes /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="advisory-form" onSubmit={handleSave} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Soil Type *</label>
                    <select required value={form.soilType} onChange={e => setForm({ ...form, soilType: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none">
                      <option value="">Select Soil</option>
                      {SOILS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Season *</label>
                    <select required value={form.season} onChange={e => setForm({ ...form, season: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none">
                      <option value="">Select Season</option>
                      {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Water Level *</label>
                    <select required value={form.waterLevel} onChange={e => setForm({ ...form, waterLevel: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none">
                      <option value="">Select Water</option>
                      {WATER_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Recommended Crops *</label>
                  <input required placeholder="e.g. Cotton, Soybean, Maize (comma separated)" value={form.recommendedCrops} onChange={e => setForm({ ...form, recommendedCrops: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Fertilizer Tips</label>
                  <textarea placeholder="Specific fertilizer recommendations for this combination..." value={form.fertilizerTips} onChange={e => setForm({ ...form, fertilizerTips: e.target.value })} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Soil Management Tips</label>
                  <textarea placeholder="How to prepare and maintain the soil..." value={form.soilManagementTips} onChange={e => setForm({ ...form, soilManagementTips: e.target.value })} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Sowing & Harvesting Calendar</label>
                  <input placeholder="e.g. Sowing: June-July, Harvesting: Oct-Nov" value={form.sowingHarvestingCalendar} onChange={e => setForm({ ...form, sowingHarvestingCalendar: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>

              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" form="advisory-form" className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all">{editing ? 'Save Changes' : 'Create Template'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
