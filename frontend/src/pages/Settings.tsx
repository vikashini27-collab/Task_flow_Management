import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api/axios';
import { Bell, BarChart2, Palette, Check, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const tx = theme === 'light' ? 'text-slate-800' : 'text-white';
  const sub = theme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const card = theme === 'light' ? 'bg-white/80 backdrop-blur-md shadow-xl shadow-pink-100/30 border-pink-100' : 'bg-brand-dark/80 backdrop-blur-md border-white/10';

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifications, setNotifs] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'week' | 'month' | null>(null);

  useEffect(() => {
    api.get('/notifications').then(r => setNotifs(r.data.data || [])).catch(() => {});
    api.get('/tasks').then(r => setTasks(r.data.data || [])).catch(() => {});
  }, []);

  const markRead = async (id: number) => {
    try { await api.patch(`/notifications/${id}/read`); setNotifs(prev => prev.map(n => n.id === id ? {...n, read: true} : n)); } catch {}
  };

  const sendTestNotif = async () => {
    try { await api.post('/notifications', { message: 'Reminder: Check your tasks! (' + new Date().toLocaleTimeString() + ')' });
      const r = await api.get('/notifications'); setNotifs(r.data.data || []); } catch {}
  };

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7*24*60*60*1000);
  const monthAgo = new Date(now.getTime() - 30*24*60*60*1000);
  const pastWeek = tasks.filter(t => t.status === 'COMPLETED' && t.updatedAt && new Date(t.updatedAt) >= weekAgo);
  const pastMonth = tasks.filter(t => t.status === 'COMPLETED' && t.updatedAt && new Date(t.updatedAt) >= monthAgo);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <h1 className={`text-3xl font-bold ${tx}`}>Settings</h1>

      {/* Theme */}
      <div className={`${card} p-6 rounded-3xl border`}>
        <div className="flex items-center gap-3 mb-4"><Palette size={22} className="text-purple-500"/><h3 className={`text-xl font-bold ${tx}`}>Theme</h3></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button onClick={() => { if (theme !== 'light') toggleTheme(); }}
            className={`p-5 rounded-2xl border-2 transition-all ${theme==='light'?'border-pink-400 shadow-lg shadow-pink-100':'border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-2"><Sun size={20} className="text-orange-400"/><span className={`font-bold ${tx}`}>Pastel Light</span></div>
            <div className="flex gap-2">{['#fce7f3','#dbeafe','#ede9fe','#ffffff','#fecdd3'].map(c => <div key={c} className="w-6 h-6 rounded-full border border-slate-200" style={{background:c}}/>)}</div>
            <p className={`text-xs mt-2 ${sub}`}>Pink, blue, purple, white pastels</p>
          </button>
          <button onClick={() => { if (theme !== 'dark') toggleTheme(); }}
            className={`p-5 rounded-2xl border-2 transition-all ${theme==='dark'?'border-purple-400 shadow-lg shadow-purple-900/30':'border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-2"><Moon size={20} className="text-purple-400"/><span className={`font-bold ${tx}`}>Dark Navy</span></div>
            <div className="flex gap-2">{['#0f172a','#1e293b','#6366f1','#a855f7','#ec4899'].map(c => <div key={c} className="w-6 h-6 rounded-full border border-slate-600" style={{background:c}}/>)}</div>
            <p className={`text-xs mt-2 ${sub}`}>Dark navy with neon accents</p>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className={`${card} p-6 rounded-3xl border`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3"><Bell size={22} className="text-pink-500"/><h3 className={`text-xl font-bold ${tx}`}>Notifications</h3></div>
          <div className="flex items-center gap-3">
            <button onClick={sendTestNotif} className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">Send Test</button>
            <button onClick={() => setNotifEnabled(!notifEnabled)} className={`w-12 h-6 rounded-full relative transition-colors ${notifEnabled?'bg-pink-400':'bg-slate-300'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${notifEnabled?'right-1':'left-1'}`}/></button>
          </div>
        </div>
        {notifications.length === 0 ? <p className={sub}>No notifications. Click "Send Test" or add tasks with due dates — reminders pop on login!</p> :
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className={`flex items-center justify-between p-3 rounded-xl ${n.read?(theme==='light'?'bg-slate-50':'bg-brand-navy/30'):(theme==='light'?'bg-pink-50 border border-pink-100':'bg-purple-900/20 border border-purple-800/20')}`}>
                <span className={`text-sm ${n.read?sub:tx}`}>{n.message}</span>
                {!n.read && <button onClick={() => markRead(n.id)} className="text-xs font-semibold text-green-500 flex items-center gap-1 shrink-0"><Check size={14}/> Read</button>}
              </div>
            ))}
          </div>
        }
      </div>

      {/* Completed Task History */}
      <div className={`${card} p-6 rounded-3xl border`}>
        <div className="flex items-center gap-3 mb-4"><BarChart2 size={22} className="text-orange-500"/><h3 className={`text-xl font-bold ${tx}`}>Completed Task History</h3></div>
        <div className="flex gap-3 mb-4">
          <button onClick={() => setViewMode(viewMode==='week'?null:'week')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode==='week'?'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md':theme==='light'?'bg-pink-50 text-slate-600 hover:bg-pink-100':'bg-brand-navy text-slate-400'}`}>
            Past Week ({pastWeek.length})</button>
          <button onClick={() => setViewMode(viewMode==='month'?null:'month')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode==='month'?'bg-gradient-to-r from-purple-400 to-blue-500 text-white shadow-md':theme==='light'?'bg-blue-50 text-slate-600 hover:bg-blue-100':'bg-brand-navy text-slate-400'}`}>
            Past Month ({pastMonth.length})</button>
        </div>
        <AnimatePresence>
          {viewMode && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(viewMode==='week'?pastWeek:pastMonth).length===0?<p className={sub}>No completed tasks in this period.</p>:
                  (viewMode==='week'?pastWeek:pastMonth).map(t => (
                    <div key={t.id} className={`p-3 rounded-xl flex justify-between ${theme==='light'?'bg-green-50 border border-green-100':'bg-green-900/10 border border-green-800/20'}`}>
                      <span className={`font-medium ${tx} line-through opacity-70`}>{t.title}</span>
                      <span className={`text-xs ${sub}`}>{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : ''}</span>
                    </div>
                  ))
                }
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Settings;
