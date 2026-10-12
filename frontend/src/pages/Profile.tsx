import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Save, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { theme } = useContext(ThemeContext);
  const { user, setUser } = useContext(AuthContext);
  const tx = theme === 'light' ? 'text-slate-800' : 'text-white';
  const sub = theme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const bg = theme === 'light' ? 'bg-white shadow-xl shadow-blue-100/50 border-blue-50' : 'bg-brand-dark border-white/10';
  const inp = theme === 'light' ? 'bg-blue-50 border-blue-100 text-slate-800' : 'bg-brand-navy border-white/10 text-white';

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => { setFullName(user?.fullName || ''); setEmail(user?.email || ''); }, [user]);

  const saveProfile = async () => {
    try {
      const r = await api.put('/profile', { fullName, email });
      const updated = r.data.data;
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setMsg('Profile saved!');
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Failed to save.'); }
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 4) { setPwMsg('Password too short'); return; }
    try {
      await api.put('/profile/password', { newPassword });
      setPwMsg('Password changed!'); setNewPassword('');
      setTimeout(() => setPwMsg(''), 3000);
    } catch { setPwMsg('Failed to change password.'); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <h1 className={`text-3xl font-bold ${tx}`}>My Profile</h1>

      <div className={`${bg} p-8 rounded-3xl border`}>
        <div className="flex flex-col items-center mb-8">
          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || 'user'}&backgroundColor=fce7f3`} className="w-28 h-28 rounded-full mb-3 shadow-lg border-4 border-pink-200" alt="Avatar"/>
          <p className={`text-lg font-bold ${tx}`}>{user?.fullName}</p>
          <p className={`text-sm ${sub}`}>@{user?.username} · {user?.role}</p>
        </div>

        <div className="space-y-4">
          <div><label className={`block text-sm mb-1 ${sub}`}>Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-pink ${inp}`}/></div>
          <div><label className={`block text-sm mb-1 ${sub}`}>Username</label>
            <input type="text" disabled value={user?.username || ''} className={`w-full px-4 py-3 rounded-xl border ${inp} opacity-60 cursor-not-allowed`}/></div>
          <div><label className={`block text-sm mb-1 ${sub}`}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-pink ${inp}`}/></div>
          <button onClick={saveProfile} className="bg-gradient-to-r from-brand-pink to-brand-purple text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg flex items-center gap-2"><Save size={18}/> Save Profile</button>
          {msg && <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-green-500 font-medium">{msg}</motion.p>}
        </div>
      </div>

      <div className={`${bg} p-8 rounded-3xl border`}>
        <h3 className={`text-xl font-bold mb-4 ${tx} flex items-center gap-2`}><Key size={20}/> Change Password</h3>
        <div className="flex gap-3">
          <input type="password" placeholder="New password..." value={newPassword} onChange={e => setNewPassword(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-indigo ${inp}`}/>
          <button onClick={changePassword} className="bg-gradient-to-r from-brand-indigo to-brand-purple text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg">Change</button>
        </div>
        {pwMsg && <motion.p initial={{opacity:0}} animate={{opacity:1}} className={`mt-3 text-sm font-medium ${pwMsg.includes('changed') ? 'text-green-500' : 'text-red-500'}`}>{pwMsg}</motion.p>}
      </div>
    </div>
  );
};
export default Profile;
