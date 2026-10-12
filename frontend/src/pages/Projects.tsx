import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api/axios';
import { Plus, Trash2, X, Save, FolderOpen, CheckSquare, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors: Record<string, string> = {
  'ONGOING': 'bg-blue-100 text-blue-600',
  'NOT_STARTED': 'bg-orange-100 text-orange-600',
  'COMPLETED': 'bg-green-100 text-green-600',
};

const Projects = () => {
  const { theme } = useContext(ThemeContext);
  const [projects, setProjects] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', deadline: '', status: 'NOT_STARTED' });

  const tx = theme === 'light' ? 'text-slate-800' : 'text-white';
  const sub = theme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const bg = theme === 'light' ? 'bg-white/80 backdrop-blur-md shadow-xl shadow-pink-100/30 border-pink-100' : 'bg-brand-dark/80 backdrop-blur-md border-white/10';
  const inp = theme === 'light' ? 'bg-pink-50/50 border-pink-100 text-slate-800' : 'bg-brand-navy border-white/10 text-white';

  const fetch = async () => { try { const r = await api.get('/projects'); setProjects(r.data.data || []); } catch { setProjects([]); } };
  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const desc = `[${form.status}] ${form.description}`;
    try { await api.post('/projects', { name: form.name, description: desc, deadline: form.deadline }); setShowModal(false); setForm({ name: '', description: '', deadline: '', status: 'NOT_STARTED' }); fetch(); } catch {}
  };
  const handleDelete = async (id: number) => { try { await api.delete(`/projects/${id}`); fetch(); } catch {} };

  const getStatus = (desc: string) => {
    if (desc?.includes('[COMPLETED]')) return 'COMPLETED';
    if (desc?.includes('[ONGOING]')) return 'ONGOING';
    return 'NOT_STARTED';
  };
  const cleanDesc = (desc: string) => (desc || '').replace(/\[(COMPLETED|ONGOING|NOT_STARTED)\]\s*/g, '');

  const ongoing = projects.filter(p => getStatus(p.description) === 'ONGOING');
  const notStarted = projects.filter(p => getStatus(p.description) === 'NOT_STARTED');
  const completed = projects.filter(p => getStatus(p.description) === 'COMPLETED');

  const ProjectCard = ({ p }: { p: any }) => {
    const st = getStatus(p.description);
    return (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className={`p-4 rounded-2xl border ${theme==='light'?'bg-white/60 border-pink-50':'bg-brand-navy/50 border-white/5'} flex justify-between items-start`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold truncate ${st==='COMPLETED'?'line-through opacity-60':''} ${tx}`}>{p.name}</h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[st]}`}>{st.replace('_',' ')}</span>
          </div>
          <p className={`text-sm ${sub} truncate`}>{cleanDesc(p.description) || 'No description'}</p>
          {p.deadline && <p className={`text-xs mt-1 ${sub}`}>📅 Deadline: {p.deadline}</p>}
        </div>
        <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg shrink-0"><Trash2 size={15}/></button>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div><h1 className={`text-3xl font-bold ${tx}`}>My Projects</h1><p className={sub}>Plan upcoming and track ongoing projects.</p></div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-pink-300/30 flex items-center gap-2 hover:scale-105 transition-transform"><Plus size={20}/> Add Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${bg} p-5 rounded-3xl border`}>
          <div className="flex items-center gap-2 mb-4"><Clock size={18} className="text-orange-500"/><h3 className={`font-bold ${tx}`}>Not Started ({notStarted.length})</h3></div>
          <div className="space-y-3">{notStarted.length===0 ? <p className={`text-sm ${sub}`}>None</p> : notStarted.map(p => <ProjectCard key={p.id} p={p}/>)}</div>
        </div>
        <div className={`${bg} p-5 rounded-3xl border`}>
          <div className="flex items-center gap-2 mb-4"><FolderOpen size={18} className="text-blue-500"/><h3 className={`font-bold ${tx}`}>Ongoing ({ongoing.length})</h3></div>
          <div className="space-y-3">{ongoing.length===0 ? <p className={`text-sm ${sub}`}>None</p> : ongoing.map(p => <ProjectCard key={p.id} p={p}/>)}</div>
        </div>
        <div className={`${bg} p-5 rounded-3xl border`}>
          <div className="flex items-center gap-2 mb-4"><CheckSquare size={18} className="text-green-500"/><h3 className={`font-bold ${tx}`}>Completed ({completed.length})</h3></div>
          <div className="space-y-3">{completed.length===0 ? <p className={`text-sm ${sub}`}>None</p> : completed.map(p => <ProjectCard key={p.id} p={p}/>)}</div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} onClick={e => e.stopPropagation()}
            className={`${theme==='light'?'bg-white':'bg-brand-dark'} p-8 rounded-3xl w-full max-w-md shadow-2xl border ${theme==='light'?'border-pink-100':'border-white/10'}`}>
            <div className="flex justify-between items-center mb-6"><h2 className={`text-2xl font-bold ${tx}`}>New Project</h2><button onClick={() => setShowModal(false)} className={sub}><X size={22}/></button></div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className={`block text-sm mb-1 ${sub}`}>Project Name</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-400 ${inp}`}/></div>
              <div><label className={`block text-sm mb-1 ${sub}`}>Description / Notes</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none ${inp} h-20 resize-none`}/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={`block text-sm mb-1 ${sub}`}>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border ${inp}`}>
                    <option value="NOT_STARTED">Not Yet Started</option><option value="ONGOING">Ongoing</option><option value="COMPLETED">Completed</option></select></div>
                <div><label className={`block text-sm mb-1 ${sub}`}>Deadline</label><input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none ${inp}`}/></div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-3 rounded-xl font-semibold ${theme==='light'?'bg-slate-100 text-slate-600':'bg-brand-navy text-slate-300'}`}>Cancel</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-pink-400 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"><Save size={18}/> Create</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default Projects;
