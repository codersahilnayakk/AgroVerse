import { useContext, useEffect, useState } from 'react';
import { FaUsers, FaFileAlt, FaQuestionCircle, FaSeedling, FaComments, FaArrowUp, FaClock } from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const { adminApi } = useContext(AdminContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/stats').then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton />;

  const cards = [
    { label: 'Total Farmers', value: stats?.totalUsers || 0, icon: <FaUsers />, color: 'from-emerald-500 to-green-600', change: '+12%' },
    { label: 'Total Schemes', value: stats?.totalSchemes || 0, icon: <FaFileAlt />, color: 'from-blue-500 to-indigo-600', change: '+3' },
    { label: 'Farmer Queries', value: stats?.totalQueries || 0, icon: <FaQuestionCircle />, color: 'from-amber-500 to-orange-600', change: `${stats?.pendingQueries || 0} pending` },
    { label: 'Advisories Given', value: stats?.totalAdvisories || 0, icon: <FaSeedling />, color: 'from-purple-500 to-fuchsia-600', change: '+8%' },
    { label: 'Forum Posts', value: stats?.totalPosts || 0, icon: <FaComments />, color: 'from-cyan-500 to-teal-600', change: 'active' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-sm`}>{c.icon}</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1"><FaArrowUp className="text-[8px]" />{c.change}</span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{c.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User growth chart placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">User Growth (Last 6 Months)</h3>
          <div className="flex items-end gap-3 h-40">
            {(stats?.monthlyUsers?.length ? stats.monthlyUsers : [{_id:1,count:0}]).map((m, i) => {
              const max = Math.max(...(stats?.monthlyUsers || []).map(x => x.count), 1);
              const h = Math.max((m.count / max) * 100, 8);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">{m.count}</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-500" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-gray-400">{MONTHS[m._id - 1]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats?.recentUsers?.map((u, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold flex-shrink-0">
                  {u.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <FaClock className="text-gray-300 text-xs flex-shrink-0" />
              </div>
            ))}
            {(!stats?.recentUsers?.length) && <p className="text-sm text-gray-400 text-center py-4">No recent users</p>}
          </div>
        </div>
      </div>

      {/* Recent queries */}
      <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Farmer Queries</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
              <th className="pb-3 pr-4">Farmer</th><th className="pb-3 pr-4">Subject</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Date</th>
            </tr></thead>
            <tbody>
              {stats?.recentQueries?.map((q, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 pr-4 font-medium text-gray-800">{q.farmerName}</td>
                  <td className="py-3 pr-4 text-gray-600 truncate max-w-[200px]">{q.subject}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${q.status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : q.status === 'in-progress' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!stats?.recentQueries?.length) && <tr><td colSpan={4} className="py-6 text-center text-gray-400">No queries yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2" />
      <div className="h-4 w-64 bg-gray-100 rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-2xl" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-56 bg-gray-100 rounded-2xl" />
        <div className="h-56 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}
