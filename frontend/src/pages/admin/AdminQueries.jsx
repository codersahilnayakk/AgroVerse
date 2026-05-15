import { useContext, useEffect, useState } from 'react';
import { FaSearch, FaTimes, FaReply, FaEye, FaMapMarkerAlt, FaClock, FaUser, FaTag, FaInbox } from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';

const STATUSES = ['pending', 'in-progress', 'resolved'];

export default function AdminQueries() {
  const { adminApi } = useContext(AdminContext);
  const [queries, setQueries] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const load = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    adminApi.get('/queries', { params }).then(r => {
      setQueries(r.data.queries); setTotal(r.data.total);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const openReply = (q) => { setReplyModal(q); setReplyText(q.adminReply || ''); setNewStatus(q.status); };

  const handleReply = async () => {
    await adminApi.put(`/queries/${replyModal._id}`, { adminReply: replyText, status: newStatus });
    setReplyModal(null);
    load();
  };

  const statusColor = (s) => s === 'resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : s === 'in-progress' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200';

  const statusDot = (s) => s === 'resolved' ? 'bg-emerald-500' : s === 'in-progress' ? 'bg-amber-500' : 'bg-red-500';

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (d) => {
    const date = new Date(d);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const pendingCount = queries.filter(q => q.status === 'pending').length;
  const resolvedCount = queries.filter(q => q.status === 'resolved').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Farmer Queries</h1>
        <p className="text-gray-500 text-sm mt-1">{total} total queries</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 font-medium">Total</p>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-100 p-4">
          <p className="text-xs text-red-400 font-medium">Pending</p>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-100 p-4">
          <p className="text-xs text-amber-400 font-medium">In Progress</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{queries.filter(q => q.status === 'in-progress').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-100 p-4">
          <p className="text-xs text-emerald-400 font-medium">Resolved</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{resolvedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={e => { e.preventDefault(); load(); }} className="flex items-center bg-white rounded-xl border border-gray-200 px-4 py-2 flex-1">
          <FaSearch className="text-gray-400 text-sm mr-2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, subject, or location..." className="bg-transparent border-none outline-none text-sm flex-1" />
        </form>
        <div className="flex gap-2 flex-wrap">
          {['', ...STATUSES].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${statusFilter === s ? 'bg-emerald-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Query List */}
      <div className="space-y-3">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />) :
          queries.map(q => (
            <div key={q._id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Top Row: Avatar + Name + Status */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-sm font-bold flex-shrink-0 shadow-sm">
                      {q.farmerName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{q.farmerName}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        {q.location && (
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-[10px]" /> {q.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FaClock className="text-[10px]" /> {formatDate(q.createdAt)} at {formatTime(q.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(q.status)} capitalize`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot(q.status)}`}></span>
                        {q.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 capitalize">{q.category}</span>
                    </div>
                  </div>

                  {/* Subject */}
                  <h3 className="text-sm font-bold text-gray-800 mb-1.5">{q.subject}</h3>

                  {/* Message Preview */}
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{q.message}</p>

                  {/* Admin Reply Preview */}
                  {q.adminReply && (
                    <div className="mt-3 pl-4 border-l-2 border-emerald-300 bg-emerald-50/50 rounded-r-lg py-2 pr-3">
                      <p className="text-xs text-emerald-700 font-semibold mb-0.5">Admin Reply:</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{q.adminReply}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => setDetailModal(q)} className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors" title="View Details">
                    <FaEye />
                  </button>
                  <button onClick={() => openReply(q)} className="p-2.5 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors" title="Reply">
                    <FaReply />
                  </button>
                </div>
              </div>
            </div>
          ))
        }
        {!loading && !queries.length && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaInbox className="text-gray-300 text-2xl" />
            </div>
            <p className="text-gray-400 font-medium">No queries found</p>
            <p className="text-gray-300 text-sm mt-1">Farmer queries submitted from the website will appear here</p>
          </div>
        )}
      </div>

      {/* ─── Detail Modal ─── */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setDetailModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Query Details</h2>
                <button onClick={() => setDetailModal(null)} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Farmer Info */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-lg font-bold shadow-sm">
                  {detailModal.farmerName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{detailModal.farmerName}</p>
                  <p className="text-xs text-gray-400">{detailModal.location || 'Location not provided'}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5"><FaTag className="text-[10px]" /> Category</p>
                  <p className="text-sm font-semibold text-gray-800 capitalize mt-1">{detailModal.category}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${statusDot(detailModal.status)}`}></span>
                    Status
                  </p>
                  <p className="text-sm font-semibold text-gray-800 capitalize mt-1">{detailModal.status}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5"><FaClock className="text-[10px]" /> Submitted</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">{formatDate(detailModal.createdAt)}</p>
                  <p className="text-xs text-gray-400">{formatTime(detailModal.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5"><FaUser className="text-[10px]" /> User ID</p>
                  <p className="text-xs font-mono text-gray-600 mt-1 truncate">{detailModal.userId || 'Guest'}</p>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Subject</p>
                <p className="text-sm font-bold text-gray-900">{detailModal.subject}</p>
              </div>

              {/* Full Message */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Full Message</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{detailModal.message}</p>
                </div>
              </div>

              {/* Admin Reply */}
              {detailModal.adminReply ? (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1.5">Admin Reply</p>
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-sm text-emerald-800 leading-relaxed whitespace-pre-wrap">{detailModal.adminReply}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-4">
                  <p className="text-sm text-amber-700 font-medium">⏳ No reply yet. Click "Reply" to respond to this query.</p>
                </div>
              )}

              {/* Action Button */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setDetailModal(null); openReply(detailModal); }} className="flex-1 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <FaReply className="text-xs" /> Reply to Query
                </button>
                <button onClick={() => setDetailModal(null)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Reply Modal ─── */}
      {replyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setReplyModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Reply to Query</h2>
              <button onClick={() => setReplyModal(null)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><FaTimes /></button>
            </div>

            {/* Query Preview */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                  {replyModal.farmerName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{replyModal.farmerName}</p>
                  <p className="text-[10px] text-gray-400">{replyModal.location || 'No location'} · {formatDate(replyModal.createdAt)}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">{replyModal.subject}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{replyModal.message}</p>
            </div>

            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Update Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm mb-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
              {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>

            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Admin Reply</label>
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none mb-4" placeholder="Type your reply..." />

            <div className="flex justify-end gap-3">
              <button onClick={() => setReplyModal(null)} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleReply} className="px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all">Send Reply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
