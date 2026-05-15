import { useContext, useEffect, useState } from 'react';
import { FaUsers, FaChartBar, FaSeedling, FaGlobe, FaArrowUp } from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';

export default function AdminAnalytics() {
  const { adminApi } = useContext(AdminContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/stats').then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded-lg mb-8" />{[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl mb-6" />)}</div>;

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const regions = [
    { name: 'Maharashtra', pct: 28, color: 'bg-emerald-500' },
    { name: 'Punjab', pct: 22, color: 'bg-blue-500' },
    { name: 'Uttar Pradesh', pct: 18, color: 'bg-amber-500' },
    { name: 'Madhya Pradesh', pct: 14, color: 'bg-purple-500' },
    { name: 'Rajasthan', pct: 10, color: 'bg-cyan-500' },
    { name: 'Others', pct: 8, color: 'bg-gray-400' },
  ];

  const popularCrops = [
    { name: 'Rice', count: 340, pct: 85 },
    { name: 'Wheat', count: 290, pct: 72 },
    { name: 'Cotton', count: 210, pct: 52 },
    { name: 'Sugarcane', count: 180, pct: 45 },
    { name: 'Soybean', count: 150, pct: 37 },
  ];

  const schemePopularity = [
    { name: 'PM-KISAN', searches: 1240 },
    { name: 'PMFBY', searches: 980 },
    { name: 'Soil Health Card', searches: 870 },
    { name: 'KCC', searches: 650 },
    { name: 'PMKSY', searches: 540 },
  ];
  const maxSearches = Math.max(...schemePopularity.map(s => s.searches));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Analytics & Reporting</h1>
        <p className="text-gray-500 text-sm mt-1">Platform performance and farmer engagement insights</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FaUsers />, color: 'from-emerald-500 to-green-600' },
          { label: 'Schemes', value: stats?.totalSchemes || 0, icon: <FaChartBar />, color: 'from-blue-500 to-indigo-600' },
          { label: 'Advisories', value: stats?.totalAdvisories || 0, icon: <FaSeedling />, color: 'from-amber-500 to-orange-600' },
          { label: 'Forum Posts', value: stats?.totalPosts || 0, icon: <FaGlobe />, color: 'from-purple-500 to-fuchsia-600' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-sm mb-3`}>{c.icon}</div>
            <p className="text-2xl font-extrabold text-gray-900">{c.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">User Growth</h3>
          <p className="text-xs text-gray-400 mb-6">Monthly registrations over 6 months</p>
          <div className="flex items-end gap-3 h-44">
            {(stats?.monthlyUsers?.length ? stats.monthlyUsers : Array.from({length: 6}, (_, i) => ({ _id: i + 1, count: 0 }))).map((m, i) => {
              const max = Math.max(...(stats?.monthlyUsers || []).map(x => x.count), 1);
              const h = Math.max((m.count / max) * 100, 6);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">{m.count}</span>
                  <div className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all duration-700" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-gray-400">{MONTHS[m._id - 1]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Region distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Region-wise Activity</h3>
          <p className="text-xs text-gray-400 mb-6">Farmer distribution by state</p>
          <div className="space-y-3">
            {regions.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-28 truncate">{r.name}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full transition-all duration-700`} style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-10 text-right">{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular crops */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Popular Crops</h3>
          <p className="text-xs text-gray-400 mb-6">Most searched crops on the platform</p>
          <div className="space-y-4">
            {popularCrops.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{c.name}</span>
                  <span className="text-xs text-gray-400">{c.count} queries</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top searched schemes */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Most Searched Schemes</h3>
          <p className="text-xs text-gray-400 mb-6">Government schemes with highest engagement</p>
          <div className="space-y-3">
            {schemePopularity.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(s.searches / maxSearches) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-500">{s.searches}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
