import { useState } from 'react';
import { FaSave, FaGlobe, FaBell, FaRobot, FaMicrophone, FaCode, FaPalette } from 'react-icons/fa';

export default function AdminSettings() {
  const [tab, setTab] = useState('branding');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'AgroVerse',
    tagline: 'AI-Powered Agriculture Platform',
    contactEmail: 'info@agroverse.com',
    contactPhone: '+91 98765 43210',
    address: 'AgroVerse HQ, Agri District, 560001',
    notifyNewUser: true,
    notifyNewQuery: true,
    notifySchemeExpiry: false,
    aiModel: 'mixtral-8x7b-32768',
    aiTemperature: 0.7,
    aiMaxTokens: 2048,
    voiceEnabled: true,
    voiceLanguage: 'hi-IN',
    groqApiKey: '••••••••••••',
    footerText: '© 2026 AgroVerse. All rights reserved.',
  });

  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const TABS = [
    { id: 'branding', icon: <FaPalette />, label: 'Branding' },
    { id: 'notifications', icon: <FaBell />, label: 'Notifications' },
    { id: 'ai', icon: <FaRobot />, label: 'AI Assistant' },
    { id: 'voice', icon: <FaMicrophone />, label: 'Voice' },
    { id: 'api', icon: <FaCode />, label: 'API Keys' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Platform configuration and preferences</p>
        </div>
        <button onClick={handleSave} className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm ${saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}>
          <FaSave className="text-xs" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab navigation */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500 hover:bg-gray-50'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6">
          {tab === 'branding' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Website Branding</h2>
              <Inp label="Site Name" value={settings.siteName} onChange={v => update('siteName', v)} />
              <Inp label="Tagline" value={settings.tagline} onChange={v => update('tagline', v)} />
              <Inp label="Contact Email" value={settings.contactEmail} onChange={v => update('contactEmail', v)} />
              <Inp label="Contact Phone" value={settings.contactPhone} onChange={v => update('contactPhone', v)} />
              <Inp label="Address" value={settings.address} onChange={v => update('address', v)} />
              <Inp label="Footer Text" value={settings.footerText} onChange={v => update('footerText', v)} />
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h2>
              <Toggle label="New User Registration" desc="Get notified when a new farmer registers" checked={settings.notifyNewUser} onChange={() => update('notifyNewUser', !settings.notifyNewUser)} />
              <Toggle label="New Farmer Query" desc="Get notified when a farmer submits a query" checked={settings.notifyNewQuery} onChange={() => update('notifyNewQuery', !settings.notifyNewQuery)} />
              <Toggle label="Scheme Expiry Alerts" desc="Get notified before scheme deadlines" checked={settings.notifySchemeExpiry} onChange={() => update('notifySchemeExpiry', !settings.notifySchemeExpiry)} />
            </div>
          )}

          {tab === 'ai' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">AI Assistant Configuration</h2>
              <Inp label="AI Model" value={settings.aiModel} onChange={v => update('aiModel', v)} />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Temperature: {settings.aiTemperature}</label>
                <input type="range" min="0" max="1" step="0.1" value={settings.aiTemperature} onChange={e => update('aiTemperature', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
              </div>
              <Inp label="Max Tokens" value={settings.aiMaxTokens} onChange={v => update('aiMaxTokens', v)} />
            </div>
          )}

          {tab === 'voice' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Voice Assistant Settings</h2>
              <Toggle label="Voice Input Enabled" desc="Allow farmers to use voice-based interaction" checked={settings.voiceEnabled} onChange={() => update('voiceEnabled', !settings.voiceEnabled)} />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Default Voice Language</label>
                <select value={settings.voiceLanguage} onChange={e => update('voiceLanguage', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500">
                  <option value="hi-IN">Hindi</option><option value="en-IN">English (India)</option><option value="ta-IN">Tamil</option><option value="te-IN">Telugu</option><option value="mr-IN">Marathi</option><option value="pa-IN">Punjabi</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'api' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">API Integrations</h2>
              <Inp label="GROQ API Key" value={settings.groqApiKey} onChange={v => update('groqApiKey', v)} />
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800">⚠️ API keys are sensitive. Changes here are for display only — update the backend <code className="bg-amber-100 px-1 rounded">.env</code> file to apply changes.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Inp({ label, value, onChange }) {
  return <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label><input value={value} onChange={e => onChange(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 transition-colors" /></div>;
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div><p className="text-sm font-medium text-gray-800">{label}</p>{desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}</div>
      <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-emerald-500' : 'bg-gray-300'}`}>
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
