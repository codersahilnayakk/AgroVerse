import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaSeedling, FaUsers, FaFileAlt, FaMicrophone, FaLanguage, FaRobot, FaChevronRight, FaPhone, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaLeaf, FaCloudSunRain, FaHandHoldingUsd, FaShieldAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import queryService from '../services/queryService';

/* ───── Scroll Reveal Hook ───── */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

/* ───── Animated Counter ───── */
const Counter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ───── Data ───── */
const FEATURES = [
  { icon: <FaRobot />, title: 'AI Crop Advisory', desc: 'Get intelligent crop recommendations based on your soil, weather, and regional data — powered by advanced AI.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: <FaHandHoldingUsd />, title: 'Scheme Finder', desc: 'Discover and check eligibility for 150+ government schemes, subsidies, and financial benefits instantly.', color: 'bg-amber-50 text-amber-600' },
  { icon: <FaLanguage />, title: 'Multilingual Support', desc: 'Interact in Hindi, Tamil, Telugu, Bengali, Marathi, and 5+ more Indian languages seamlessly.', color: 'bg-blue-50 text-blue-600' },
  { icon: <FaMicrophone />, title: 'Voice Assistance', desc: 'Speak your queries naturally. Our voice-first AI understands rural dialects and low-literacy inputs.', color: 'bg-purple-50 text-purple-600' },
];

const STEPS = [
  { num: '01', title: 'Enter Farm Details', desc: 'Share your soil type, location, and season.' },
  { num: '02', title: 'AI Analysis', desc: 'Our AI analyzes soil, weather, and market data.' },
  { num: '03', title: 'Smart Recommendations', desc: 'Receive crop picks and relevant government schemes.' },
  { num: '04', title: 'Personalized Guidance', desc: 'Get ongoing advisory tailored to your farm.' },
];

const SCHEMES = [
  { name: 'PM-KISAN', desc: 'Direct income support of ₹6,000/year to eligible farmer families in three installments.', badge: 'Income Support', badgeColor: 'bg-emerald-100 text-emerald-700', icon: '💰' },
  { name: 'Soil Health Card', desc: 'Free soil testing and nutrient-based recommendations to improve crop productivity.', badge: 'Soil Analysis', badgeColor: 'bg-amber-100 text-amber-700', icon: '🧪' },
  { name: 'PMFBY Crop Insurance', desc: 'Comprehensive crop insurance against natural calamities at minimal premium rates.', badge: 'Insurance', badgeColor: 'bg-blue-100 text-blue-700', icon: '🛡️' },
  { name: 'PMKSY Irrigation', desc: 'Per Drop More Crop — subsidies for micro-irrigation and water-saving technologies.', badge: 'Irrigation', badgeColor: 'bg-cyan-100 text-cyan-700', icon: '💧' },
];

const LANGUAGES = ['हिन्दी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी', 'ગુજરાતી', 'ಕನ್ನಡ', 'ਪੰਜਾਬੀ', 'മലയാളം', 'English'];

/* ───── Contact Section Component ───── */
const ContactSection = ({ revealRef }) => {
  const [formData, setFormData] = useState({ farmerName: '', location: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.farmerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please describe your farming query');
      return;
    }

    setLoading(true);
    try {
      await queryService.submitQuery({
        farmerName: formData.farmerName.trim(),
        location: formData.location.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
      toast.success('Your query has been submitted successfully! Our team will get back to you soon.');
      setFormData({ farmerName: '', location: '', message: '' });
    } catch (error) {
      console.error('Query submission error:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset success state after 5 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div ref={revealRef} className="reveal max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">✦ Get In Touch</span>
          <h2 className="section-title">Need Farming Assistance?</h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">Our team is ready to help you with any agricultural query. Reach out and we'll connect you with the right resources.</p>
        </div>
        <div className="contact-glass p-8 md:p-12">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-emerald-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Query Submitted Successfully!</h3>
              <p className="text-gray-500 max-w-md mx-auto">Thank you for reaching out. Our agricultural experts will review your query and get back to you shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 px-6 py-2.5 text-sm font-semibold text-emerald-600 border-2 border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all"
              >
                Submit Another Query
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact-farmerName" className="block text-sm font-semibold text-gray-700 mb-2">Farmer Name *</label>
                  <input
                    id="contact-farmerName"
                    type="text"
                    name="farmerName"
                    value={formData.farmerName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="contact-input"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="contact-location" className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    id="contact-location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Village, District, State"
                    className="contact-input"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-2">Farming Query *</label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your question or issue..."
                  rows={4}
                  className="contact-input resize-none"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="cta-primary text-base px-10 py-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" /> Submitting...
                    </>
                  ) : (
                    <>
                      Get Farming Assistance <FaChevronRight className="text-sm" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

function Home() {
  const { user } = useContext(AuthContext);
  const r1 = useReveal(), r2 = useReveal(), r3 = useReveal(), r4 = useReveal(), r5 = useReveal(), r6 = useReveal(), r7 = useReveal(), r8 = useReveal();

  return (
    <div className="bg-white" style={{ marginTop: '-64px' }}>

      {/* ═══════════ 1. HERO ═══════════ */}
      <section className="hero-section flex flex-col justify-center items-center text-center">
        <img src="/img/hero-bg.png" alt="" className="hero-bg" loading="eager" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 z-[1]" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
        <div className="hero-content w-full max-w-5xl mx-auto px-6 py-32 lg:py-48 flex flex-col items-center justify-center relative z-10">
          <div className="hero-badge justify-center mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Agriculture Platform
          </div>
          <h1 className="hero-title max-w-4xl mx-auto mt-4">
            Your Digital Companion for <br className="hidden md:block" />
            <span className="highlight">Smarter Farming</span>
          </h1>
          <p className="hero-subtitle mx-auto mt-6" style={{ maxWidth: '640px' }}>
            Access crop advisory, scheme eligibility, and AI-powered farming insights — tailored to your land and location.
          </p>
          <div className="hero-cta-group justify-center mt-10">
            <Link to={user ? '/advisory' : '/register'} className="cta-primary px-8 py-4">
              Explore Services <FaChevronRight className="text-sm" />
            </Link>
            <Link to="/schemes" className="cta-secondary px-8 py-4">
              Find Government Schemes
            </Link>
          </div>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-12 text-white/70 text-sm font-medium" style={{ animation: 'fadeInUp 0.8s ease-out 0.7s both' }}>
            <span className="flex items-center gap-2"><FaShieldAlt className="text-emerald-400" /> 100% Free</span>
            <span className="flex items-center gap-2"><FaLeaf className="text-emerald-400" /> 10+ Languages</span>
            <span className="flex items-center gap-2"><FaRobot className="text-emerald-400" /> AI-Powered</span>
          </div>
        </div>
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 z-[3] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      </section>

      {/* ═══════════ 2. FEATURES ═══════════ */}
      <section className="py-24 px-6 bg-gray-50/50">
        <div ref={r1} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">✦ Core Features</span>
            <h2 className="section-title">Everything a Modern Farmer Needs</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">Intelligent tools designed to simplify decisions, increase yields, and connect you to government support.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className={`feature-icon ${f.color}`}>{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 3. ABOUT ═══════════ */}
      <section className="py-24 px-6">
        <div ref={r2} className="reveal max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="about-image-wrapper">
              <img src="/img/about-farmer.png" alt="Indian farmer using technology" className="w-full h-auto" />
            </div>
            {/* Floating stat card */}
            <div className="stat-card absolute -bottom-6 -right-4 lg:-right-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600"><FaSeedling /></div>
                <div>
                  <p className="text-2xl font-extrabold text-gray-900">95%</p>
                  <p className="text-xs text-gray-500">Advisory Accuracy</p>
                </div>
              </div>
            </div>
          </div>
          {/* Content side */}
          <div>
            <span className="section-label">✦ About AgroVerse</span>
            <h2 className="section-title mb-6">Empowering Farmers Through <span className="text-emerald-600">Intelligent Technology</span></h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              AgroVerse is a unified ecosystem that combines artificial intelligence, government scheme databases, personalized crop recommendations, and multilingual accessibility — all designed to help Indian farmers make smarter decisions and improve their livelihoods.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Whether you need to find the right crop for your soil, discover subsidies you're eligible for, or get real-time farming advice in your native language — AgroVerse is your trusted digital companion.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '1000+', label: 'Farmers Assisted' },
                { val: '150+', label: 'Schemes Integrated' },
                { val: '10+', label: 'Languages Supported' },
                { val: '24/7', label: 'Smart Assistance' },
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <p className="text-xl font-extrabold text-emerald-700">{s.val}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 4. HOW IT WORKS ═══════════ */}
      <section className="py-24 px-6 bg-gray-50/50">
        <div ref={r3} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">✦ How It Works</span>
            <h2 className="section-title">From Farm to Insight in 4 Steps</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="process-step">
                {i < 3 && <div className="process-connector hidden lg:block" />}
                <div className="process-number bg-emerald-600 text-white">{s.num}</div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 5. MULTILINGUAL & VOICE ═══════════ */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div ref={r4} className="reveal max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Content */}
          <div>
            <span className="section-label" style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', borderColor: 'rgba(110,231,183,0.2)' }}>
              ✦ Accessibility First
            </span>
            <h2 className="section-title-white mb-6">Speak Your Language,<br />We Understand</h2>
            <p className="text-white/60 leading-relaxed mb-8 text-lg">
              AgroVerse supports 10+ Indian languages with voice-first interaction. Rural farmers can simply speak their queries — no typing, no complex navigation. Just natural conversation.
            </p>
            {/* Language badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {LANGUAGES.map((l, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/8 border border-white/15 text-white/80 hover:bg-white/15 transition-all cursor-default">
                  {l}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-white/50 text-sm">
              <FaMicrophone className="text-emerald-400 text-lg" />
              <span>Voice input available on Chrome & Edge browsers</span>
            </div>
          </div>
          {/* Image */}
          <div className="flex justify-center">
            <img src="/img/voice-multilingual.png" alt="Multilingual voice assistant" className="w-full max-w-sm rounded-2xl shadow-2xl border border-white/10" />
          </div>
        </div>
      </section>

      {/* ═══════════ 6. GOVERNMENT SCHEMES ═══════════ */}
      <section className="py-24 px-6">
        <div ref={r5} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label">✦ Government Schemes</span>
            <h2 className="section-title">Access Benefits You Deserve</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">Browse, compare, and check eligibility for agricultural schemes — all in one place.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SCHEMES.map((s, i) => (
              <div key={i} className="scheme-card">
                <span className="text-3xl mb-4 block">{s.icon}</span>
                <span className={`scheme-badge ${s.badgeColor} mb-3`}>{s.badge}</span>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{s.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <Link to="/schemes" className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition-colors inline-flex items-center gap-1">
                  Learn More <FaChevronRight className="text-xs" />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/schemes" className="cta-primary inline-flex">
              Explore All Schemes <FaChevronRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 7. IMPACT / STATS ═══════════ */}
      <section className="impact-section py-24 px-6 text-white">
        <div ref={r6} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="section-label" style={{ background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', borderColor: 'rgba(110,231,183,0.2)' }}>
              ✦ Our Impact
            </span>
            <h2 className="section-title-white">Making a Real Difference</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { end: 1000, suffix: '+', label: 'Farmers Assisted', icon: <FaUsers /> },
              { end: 150, suffix: '+', label: 'Schemes Integrated', icon: <FaFileAlt /> },
              { end: 95, suffix: '%', label: 'Advisory Accuracy', icon: <FaSeedling /> },
              { end: 24, suffix: '/7', label: 'Smart Assistance', icon: <FaRobot /> },
            ].map((s, i) => (
              <div key={i} className="glass-card p-8 text-center">
                <div className="text-emerald-400 text-2xl mb-4 mx-auto w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">{s.icon}</div>
                <p className="impact-number"><Counter end={s.end} suffix={s.suffix} /></p>
                <p className="text-white/50 text-sm mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 8. CONTACT ═══════════ */}
      <ContactSection revealRef={r7} />

      {/* ═══════════ 9. CTA BANNER ═══════════ */}
      {!user && (
        <section ref={r8} className="reveal mx-6 mb-16">
          <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #0d2b1a 0%, #14532d 50%, #166534 100%)' }}>
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative z-10 py-16 px-8 md:px-16 text-center">
              <h2 className="section-title-white mb-4">Ready to Transform Your Farming?</h2>
              <p className="text-white/60 text-lg max-w-lg mx-auto mb-8">
                Join thousands of farmers already using AgroVerse to grow smarter, earn more, and access government benefits.
              </p>
              <Link to="/register" className="cta-primary text-base px-10 py-4 inline-flex">
                Join AgroVerse — It's Free <FaChevronRight className="text-sm" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;