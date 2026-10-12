import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { DashboardBackground } from '../components/CloudScene';

const Register = () => {
  const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMockGoogleLogin = async () => {
      try {
        setLoading(true);
        const res = await api.post('/auth/google', { token: 'mock-google-token-123' });
        const { token, user } = res.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/'; 
      } catch (err: any) {
        setError(err.response?.data?.message || 'Google Login failed on server.');
        setLoading(false);
      }
  };

  return (
    <div className="flex min-h-screen bg-blue-50 relative overflow-hidden">
      <DashboardBackground isLight={true} />
      
      {/* Right side branding (flipped for register) */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative z-10 p-12 order-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-pink mb-4 filter drop-shadow-md">Join Us</h1>
          <p className="text-xl text-slate-600 font-medium max-w-md mx-auto">Start organizing your life in a cute pastel environment.</p>
        </motion.div>
      </div>

      {/* Left side form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 z-10 order-1">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-blue-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
            <p className="text-slate-500">Please fill in your details.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-blue-50 border-none focus:ring-2 focus:ring-brand-indigo text-slate-800 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
              <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-blue-50 border-none focus:ring-2 focus:ring-brand-indigo text-slate-800 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-blue-50 border-none focus:ring-2 focus:ring-brand-indigo text-slate-800 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-5 py-3 rounded-xl bg-blue-50 border-none focus:ring-2 focus:ring-brand-indigo text-slate-800 transition-all"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-brand-indigo to-brand-pink text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform hover:-translate-y-0.5 mt-4">
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
            
             <button type="button" onClick={handleMockGoogleLogin} className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 mt-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign up with Google
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-brand-indigo font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
