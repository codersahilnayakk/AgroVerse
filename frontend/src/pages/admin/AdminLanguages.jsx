import { useState } from 'react';
import { FaGlobe, FaMicrophone, FaCheck, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const LANGS = [
  { code: 'en', name: 'English', native: 'English', enabled: true, voice: true },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', enabled: true, voice: true },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', enabled: true, voice: true },
  { code: 'mr', name: 'Marathi', native: 'मराठी', enabled: true, voice: true },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', enabled: true, voice: false },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', enabled: true, voice: true },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', enabled: true, voice: true },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', enabled: false, voice: false },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', enabled: false, voice: false },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', enabled: false, voice: false },
];

export default function AdminLanguages() {
  const [languages, setLanguages] = useState(LANGS);

  const toggle = (code, field) => {
    setLanguages(prev => prev.map(l => l.code === code ? { ...l, [field]: !l[field] } : l));
  };

  const enabledCount = languages.filter(l => l.enabled).length;
  const voiceCount = languages.filter(l => l.voice).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Language Management</h1>
        <p className="text-gray-500 text-sm mt-1">Configure multilingual and voice support</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600"><FaGlobe /></div>
            <div><p className="text-xl font-extrabold text-gray-900">{enabledCount}</p><p className="text-xs text-gray-400">Active Languages</p></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600"><FaMicrophone /></div>
            <div><p className="text-xl font-extrabold text-gray-900">{voiceCount}</p><p className="text-xs text-gray-400">Voice Enabled</p></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">{languages.length}</div>
            <div><p className="text-xl font-extrabold text-gray-900">{languages.length}</p><p className="text-xs text-gray-400">Total Languages</p></div>
          </div>
        </div>
      </div>

      {/* Language table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="px-6 py-4">Language</th><th className="px-4 py-4">Code</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Voice Support</th><th className="px-4 py-4">Translation</th>
            </tr></thead>
            <tbody>
              {languages.map(l => (
                <tr key={l.code} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 uppercase">{l.code}</span>
                      <div><p className="font-semibold text-gray-800">{l.name}</p><p className="text-xs text-gray-400">{l.native}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-500 font-mono text-xs">{l.code}</td>
                  <td className="px-4 py-4">
                    <button onClick={() => toggle(l.code, 'enabled')} className={`text-2xl transition-colors ${l.enabled ? 'text-emerald-500' : 'text-gray-300'}`}>
                      {l.enabled ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => toggle(l.code, 'voice')} className={`text-2xl transition-colors ${l.voice ? 'text-purple-500' : 'text-gray-300'}`}>
                      {l.voice ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    {l.enabled ? <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">Active</span>
                      : <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Disabled</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5">
        <p className="text-sm text-amber-800 font-medium">💡 Note: Language translation is powered by Google Translate integration. Voice support uses Web Speech API and is available on Chrome and Edge browsers.</p>
      </div>
    </div>
  );
}
