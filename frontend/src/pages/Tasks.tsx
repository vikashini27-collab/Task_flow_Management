import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RT, Legend } from 'recharts';
import api from '../api/axios';
import { ThemeContext } from '../context/ThemeContext';
import { Plus, Trash2, Edit2, CheckCircle, Clock, X, Save } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const { theme } = useContext(ThemeContext);
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '' });
  const [error, setError] = useState('');

  const fetchTasks = async () => { try { const r = await api.get('/tasks'); setTasks(r.data.data || []); } catch { setTasks([]); } };
  useEffect(() => { fetchTasks(); }, []);

  const openCreate = () => { setEditTask(null); setForm({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '' }); setError(''); setShowModal(true); };
  const openEdit = (t: any) => { setEditTask(t); setForm({ title: t.title, description: t.description || '', priority: t.priority || 'MEDIUM', status: t.status || 'TODO', dueDate: t.dueDate || '' }); setError(''); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editTask) {
        await api.put(`/tasks/${editTask.id}`, form);
      } else {
        await api.post('/tasks', form);
      }
      setShowModal(false); fetchTasks();
    } catch (err: any) { setError(err.response?.data?.message || 'Failed to save task'); }
  };

  const handleDelete = async (id: number) => { try { await api.delete(`/tasks/${id}`); fetchTasks(); } catch {} };
  const toggleDone = async (t: any) => {
    try { await api.patch(`/tasks/${t.id}/status`, { status: t.status === 'COMPLETED' ? 'TODO' : 'COMPLETED' }); fetchTasks(); } catch {}
  };

  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProg = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const todo = tasks.filter(t => t.status === 'TODO').length;
  const pie = [{ name: 'Done', value: completed }, { name: 'Active', value: inProg }, { name: 'Todo', value: todo }];
  const COLS = ['#22c55e', '#8b5cf6', '#f97316'];

  const bg = theme === 'light' ? 'bg-white/80 backdrop-blur-md shadow-xl shadow-pink-100/30 border-pink-100' : 'bg-brand-dark/80 backdrop-blur-md border-white/5';
  const tx = theme === 'light' ? 'text-slate-800' : 'text-white';
  const sub = theme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const inp = theme === 'light' ? 'bg-pink-50/50 border-pink-100 text-slate-800' : 'bg-brand-navy border-white/10 text-white';

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div><h1 className={`text-3xl font-bold ${tx}`}>My Tasks</h1><p className={sub}>Add, edit, delete and track your tasks.</p></div>
        <button onClick={openCreate} className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-pink-300/30 flex items-center gap-2 hover:scale-105 transition-transform"><Plus size={20}/> Add Task</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 ${bg} rounded-3xl p-6 border`}>
          <h3 className={`text-xl font-bold mb-4 ${tx}`}>All Tasks ({tasks.length})</h3>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            <AnimatePresence>
              {tasks.length === 0 && <p className={sub}>No tasks yet. Click "Add Task" to create your first one!</p>}
              {tasks.map((t, i) => (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.9}} transition={{delay:i*0.03}} key={t.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border ${theme==='light'?'bg-pink-50/30 border-pink-50':'bg-brand-navy/50 border-white/10'}`}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button onClick={() => toggleDone(t)} className={`shrink-0 ${t.status==='COMPLETED'?'text-green-500':'text-slate-300 hover:text-green-400'} transition-colors`}><CheckCircle size={22}/></button>
                    <div className="min-w-0">
                      <h4 className={`font-semibold truncate ${t.status==='COMPLETED'?'line-through text-slate-400':tx}`}>{t.title}</h4>
                      <p className={`text-xs ${sub} flex items-center gap-1 flex-wrap`}>
                        <Clock size={11}/> {t.dueDate || 'No date'}
                        <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${t.priority==='HIGH'||t.priority==='URGENT'?'bg-red-100 text-red-600':'bg-purple-100 text-purple-600'}`}>{t.priority}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.status==='COMPLETED'?'bg-green-100 text-green-600':t.status==='IN_PROGRESS'?'bg-blue-100 text-blue-600':'bg-orange-100 text-orange-600'}`}>{t.status?.replace('_',' ')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(t)} className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(t.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className={`${bg} rounded-3xl p-6 border`}>
          <h3 className={`text-lg font-bold mb-2 ${tx}`}>Overview</h3>
          {tasks.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                {pie.map((_, i) => <Cell key={i} fill={COLS[i]}/>)}</Pie><RT/><Legend/></PieChart>
            </ResponsiveContainer>
          ) : <p className={`${sub} text-center mt-16`}>Add tasks to see chart</p>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} onClick={e => e.stopPropagation()}
            className={`${theme==='light'?'bg-white':'bg-brand-dark'} p-8 rounded-3xl w-full max-w-md shadow-2xl border ${theme==='light'?'border-pink-100':'border-white/10'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${tx}`}>{editTask ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={() => setShowModal(false)} className={sub}><X size={22}/></button>
            </div>
            {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm border border-red-100">{error}</div>}
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className={`block text-sm mb-1 ${sub}`}>Title</label>
                <input type="text" required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-400 ${inp}`}/></div>
              <div><label className={`block text-sm mb-1 ${sub}`}>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-pink-400 ${inp} h-20 resize-none`}/></div>
              <div><label className={`block text-sm mb-1 ${sub}`}>Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none ${inp}`}/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={`block text-sm mb-1 ${sub}`}>Priority</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inp}`}>
                    <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option></select></div>
                <div><label className={`block text-sm mb-1 ${sub}`}>Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-xl border ${inp}`}>
                    <option value="TODO">Todo</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select></div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-3 rounded-xl font-semibold ${theme==='light'?'bg-slate-100 text-slate-600 hover:bg-slate-200':'bg-brand-navy text-slate-300 hover:bg-white/10'}`}>Cancel</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-pink-400 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"><Save size={18}/> {editTask ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
export default Tasks;
