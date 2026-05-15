import { useContext, useEffect, useState } from 'react';
import { FaSearch, FaTrash, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';

export default function AdminFarmers() {
  const { adminApi } = useContext(AdminContext);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (search) params.search = search;
    adminApi.get('/users', { params }).then(r => {
      setUsers(r.data.users); setTotal(r.data.total); setPages(r.data.pages);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load(); };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove farmer "${name}"? This cannot be undone.`)) return;
    await adminApi.delete(`/users/${id}`);
    load();
  };

  const exportCSV = () => {
    const csv = ['Name,Email,Location,Farm Size,Crops,Joined'];
    users.forEach(u => csv.push(`"${u.name}","${u.email}","${u.location || ''}","${u.farmSize || ''}","${(u.primaryCrops || []).join('; ')}","${new Date(u.createdAt).toLocaleDateString()}"`));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'farmers.csv'; a.click();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Farmer Management</h1>
          <p className="text-gray-500 text-sm mt-1">{total} registered farmers</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
          <FaDownload className="text-xs" /> Export CSV
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl border border-gray-200 px-4 py-2 mb-6 max-w-md">
        <FaSearch className="text-gray-400 text-sm mr-2" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or location..." className="bg-transparent border-none outline-none text-sm flex-1" />
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="px-6 py-4">Farmer</th><th className="px-4 py-4">Location</th><th className="px-4 py-4">Farm Size</th><th className="px-4 py-4">Crops</th><th className="px-4 py-4">Joined</th><th className="px-4 py-4 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-5 bg-gray-100 rounded animate-pulse" /></td></tr>
              )) : users.map((u) => (
                <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0">{u.name?.charAt(0)?.toUpperCase()}</div>
                      <div>
                        <p className="font-semibold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{u.location || '—'}</td>
                  <td className="px-4 py-4 text-gray-600">{u.farmSize || '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(u.primaryCrops || []).slice(0, 2).map((c, i) => <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700">{c}</span>)}
                      {(u.primaryCrops?.length || 0) > 2 && <span className="text-xs text-gray-400">+{u.primaryCrops.length - 2}</span>}
                      {!u.primaryCrops?.length && <span className="text-xs text-gray-400">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => handleDelete(u._id, u.name)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><FaTrash /></button>
                  </td>
                </tr>
              ))}
              {!loading && !users.length && <tr><td colSpan={6} className="text-center py-12 text-gray-400">No farmers found</td></tr>}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30"><FaChevronLeft className="text-xs" /></button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30"><FaChevronRight className="text-xs" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
