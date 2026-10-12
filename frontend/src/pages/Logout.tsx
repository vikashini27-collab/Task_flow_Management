import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThreeLoginScene } from '../components/ThreeScenes';
import { motion } from 'framer-motion';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ThreeLoginScene />
      </div>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="z-10 bg-brand-dark/80 backdrop-blur-xl p-10 rounded-3xl border border-white/10 text-center max-w-md shadow-2xl"
      >
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">You're all set!</h2>
        <p className="text-slate-400 mb-8">You've been logged out successfully.</p>
        <button onClick={() => navigate('/login')} className="w-full bg-brand-purple text-white py-3.5 rounded-xl font-semibold hover:bg-brand-indigo transition-colors">
          Login Again
        </button>
      </motion.div>
    </div>
  );
};

export default Logout;
