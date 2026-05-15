import { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FaSeedling, FaLock, FaUser, FaChevronRight } from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';

export default function AdminLogin() {
  const { admin, login } = useContext(AdminContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1f14] via-[#0d2b1a] to-[#14532d] px-4">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-green-500/5 blur-3xl" />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <FaSeedling className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AgroVerse Admin</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage the platform</p>
        </div>

        {/* Login card */}
        <form onSubmit={handleSubmit} className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Username</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><FaChevronRight className="text-xs" /></>}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">AgroVerse Administration Panel v1.0</p>
      </div>
    </div>
  );
}
