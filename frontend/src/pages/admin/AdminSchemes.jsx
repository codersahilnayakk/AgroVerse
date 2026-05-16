import { useContext, useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaFileAlt, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminContext from '../../context/AdminContext';
import { getFullImageUrl } from '../../utils/imageUtils';

const CATEGORIES = ['Income Support', 'Crop Insurance', 'Equipment Subsidy', 'Irrigation', 'Soil Health', 'Organic Farming', 'Women Farmers', 'Livestock', 'Loan Assistance', 'Infrastructure', 'Credit', 'Cooperative', 'Sustainability', 'Other'];
const EMPTY = { schemeName:'', department:'', description:'', category:'Other', eligibility:'', benefits:'', applicationProcess:'', applicationLink:'', documents:'', deadline:'', imageUrl:'' };

export default function AdminSchemes() {
  const { adminApi } = useContext(AdminContext);
  const [schemes, setSchemes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (search) params.search = search;
    if (catFilter) params.category = catFilter;
    adminApi.get('/schemes', { params }).then(r => {
      setSchemes(r.data.schemes); setTotal(r.data.total); setPages(r.data.pages);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page, catFilter]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load(); };

  const openNew = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (s) => { setEditing(s._id); setForm(s); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) await adminApi.put(`/schemes/${editing}`, form);
      else await adminApi.post('/schemes', form);
      toast.success(editing ? 'Scheme updated successfully!' : 'Scheme created successfully!');
      setModal(false); load();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Error saving scheme'); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this scheme?')) return;
    try {
      await adminApi.delete(`/schemes/${id}`);
      toast.success('Scheme deleted successfully!');
      if (schemes.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting scheme');
    }
  };

  // Image upload functionality replaced by direct URL input

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Scheme Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all official agricultural subsidies and support programs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-100">
            Total: {total}
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20">
            <FaPlus className="text-xs" /> Add Scheme
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <form onSubmit={handleSearch} className="flex items-center bg-gray-50 rounded-xl px-4 py-2 flex-1 border border-transparent focus-within:border-emerald-300 focus-within:bg-white transition-colors">
          <FaSearch className="text-emerald-500 text-sm mr-3" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by scheme name or keyword..." className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 flex-1 placeholder-gray-400" />
        </form>
        <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }} className="px-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-700 outline-none cursor-pointer hover:bg-gray-100 transition-colors sm:w-48">
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="px-6 py-4">Scheme Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status & Deadline</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-6 py-6"><div className="h-10 bg-gray-50 rounded-xl animate-pulse" /></td></tr>
              )) : schemes.map((s) => (
                <tr key={s._id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                        {s.imageUrl ? (
                          <img src={getFullImageUrl(s.imageUrl)} alt={s.schemeName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><FaFileAlt /></div>
                        )}
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 text-sm mb-1">{s.schemeName}</p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                          <FaBuilding className="text-emerald-500" /> {s.department || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <FaCheckCircle className="text-emerald-500" /> Active
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{s.deadline || 'Ongoing'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(s)} className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors" title="Edit Scheme"><FaEdit /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors" title="Delete Scheme"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !schemes.length && (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-400">
                    <FaFileAlt className="mx-auto text-4xl text-gray-200 mb-3" />
                    <p>No schemes found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 disabled:opacity-50 transition-all"><FaChevronLeft className="text-xs" /></button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 disabled:opacity-50 transition-all"><FaChevronRight className="text-xs" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {modal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-extrabold text-gray-900">{editing ? 'Edit Government Scheme' : 'Publish New Scheme'}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"><FaTimes /></button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="scheme-form" onSubmit={handleSave} className="space-y-6">
                
                {/* Image URL Area */}
                <div className="flex items-start gap-6 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300">
                  <div className="w-32 h-24 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 border border-gray-300 shadow-inner">
                    {form.imageUrl ? (
                      <img src={getFullImageUrl(form.imageUrl)} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x400/059669/ffffff?text=Invalid+Image'; }} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs font-bold gap-1">
                        <FaFileAlt className="text-2xl" /> No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input label="Image URL" value={form.imageUrl} onChange={v => setForm({ ...form, imageUrl: v })} placeholder="https://example.com/image.jpg" />
                    <p className="text-xs text-gray-500 mt-2">Paste a direct link to an image. (e.g., from Google Images, Imgur, or a government site).</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Scheme Name*" value={form.schemeName} onChange={v => setForm({ ...form, schemeName: v })} required placeholder="e.g. PM-KISAN" />
                  <Input label="Department/Ministry*" value={form.department} onChange={v => setForm({ ...form, department: v })} required placeholder="e.g. Ministry of Agriculture" />
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Category *</label>
                    <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none hover:bg-gray-100 transition-colors">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  <Input label="Deadline" value={form.deadline} onChange={v => setForm({ ...form, deadline: v })} placeholder="e.g. Dec 31, 2024 or Year-round" />
                </div>

                <Textarea label="Short Description*" value={form.description} onChange={v => setForm({ ...form, description: v })} required placeholder="A brief summary of what the scheme is about..." />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Textarea label="Eligibility Criteria*" value={form.eligibility} onChange={v => setForm({ ...form, eligibility: v })} required placeholder="Who is eligible to apply?" />
                  <Textarea label="Financial Benefits*" value={form.benefits} onChange={v => setForm({ ...form, benefits: v })} required placeholder="What are the exact subsidies or benefits?" />
                </div>

                <Textarea label="Application Process" value={form.applicationProcess} onChange={v => setForm({ ...form, applicationProcess: v })} placeholder="Step-by-step application instructions..." />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Required Documents (Comma separated)" value={form.documents} onChange={v => setForm({ ...form, documents: v })} placeholder="e.g. Aadhaar Card, Pan Card, Land Records" />
                  <Input label="Official Application URL" value={form.applicationLink} onChange={v => setForm({ ...form, applicationLink: v })} placeholder="https://..." />
                </div>

              </form>
            </div>
            
            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs text-gray-400 font-medium">* indicates required fields</span>
              <div className="flex gap-3">
                <button type="button" onClick={() => setModal(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" form="scheme-form" className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2">
                  <FaCheckCircle /> {editing ? 'Save Changes' : 'Publish Scheme'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, required, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{label}</label>
      <input value={value || ''} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none hover:bg-gray-100 transition-colors placeholder-gray-400" />
    </div>
  );
}

function Textarea({ label, value, onChange, required, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{label}</label>
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none hover:bg-gray-100 transition-colors resize-none placeholder-gray-400" />
    </div>
  );
}
