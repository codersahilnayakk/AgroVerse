import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ChatWidget from './components/chatbot/ChatWidget';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Advisory from './pages/Advisory';
import Forum from './pages/Forum';
import NewPost from './pages/NewPost';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';
import Schemes from './pages/Schemes';
import SchemeDetail from './pages/SchemeDetail';
import Dashboard from './pages/Dashboard';

import { AuthProvider } from './context/AuthContext';

// Admin imports
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSchemes from './pages/admin/AdminSchemes';
import AdminFarmers from './pages/admin/AdminFarmers';
import AdminQueries from './pages/admin/AdminQueries';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAdvisory from './pages/admin/AdminAdvisory';
import AdminLanguages from './pages/admin/AdminLanguages';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            {/* ─── Admin Routes (no Navbar/Footer) ─── */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="schemes" element={<AdminSchemes />} />
              <Route path="farmers" element={<AdminFarmers />} />
              <Route path="queries" element={<AdminQueries />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="advisory" element={<AdminAdvisory />} />
              <Route path="languages" element={<AdminLanguages />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* ─── Public / User Routes (with Navbar/Footer) ─── */}
            <Route path="*" element={
              <div className="flex flex-col min-h-screen bg-white">
                <Navbar />
                <main className="flex-grow pt-16">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<div className="container mx-auto px-4 py-8"><Login /></div>} />
                    <Route path="/register" element={<div className="container mx-auto px-4 py-8"><Register /></div>} />
                    <Route path="/schemes" element={<div className="container mx-auto px-4 py-8"><Schemes /></div>} />
                    <Route path="/schemes/:id" element={<div className="container mx-auto px-4 py-8"><SchemeDetail /></div>} />
                    
                    <Route element={<PrivateRoute />}>
                      <Route path="/dashboard" element={<div className="container mx-auto px-4 py-8"><Dashboard /></div>} />
                      <Route path="/profile" element={<div className="container mx-auto px-4 py-8"><Profile /></div>} />
                      <Route path="/advisory" element={<div className="container mx-auto px-4 py-8"><Advisory /></div>} />
                      <Route path="/forum" element={<div className="container mx-auto px-4 py-8"><Forum /></div>} />
                      <Route path="/forum/new" element={<div className="container mx-auto px-4 py-8"><NewPost /></div>} />
                      <Route path="/forum/post/:id" element={<div className="container mx-auto px-4 py-8"><PostDetail /></div>} />
                      <Route path="/forum/edit/:id" element={<div className="container mx-auto px-4 py-8"><EditPost /></div>} />
                    </Route>
                    
                    <Route path="*" element={<div className="container mx-auto px-4 py-8"><NotFound /></div>} />
                  </Routes>
                </main>
                <Footer />
                <ChatWidget />
              </div>
            } />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;