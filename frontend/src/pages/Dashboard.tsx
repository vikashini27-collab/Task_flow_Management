import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RT, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, Clock, AlertTriangle, Folder, TrendingUp, ArrowRight, Bell } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState<any>({});
  const [tasks, setTasks] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/analytics/dashboard').then(r => setStats(r.data.data || {})).catch(() => {});
    api.get('/tasks').then(r => setTasks(r.data.data || [])).catch(() => {});
    api.get('/notifications').then(r => setNotifs(r.data.data || [])).catch(() => {});
  }, []);

  const tx = theme === 'light' ? 'text-slate-800' : 'text-white';
  const sub = theme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const card = theme === 'light' ? 'bg-white/80 backdrop-blur-md shadow-lg shadow-pink-100/30 border-pink-100' : 'bg-brand-dark/80 backdrop-blur-md border-white/5';

  const completed = tasks.filter(t => t.status === 'COMPLETED');
  const recentTasks = tasks.slice(0, 5);
  const unreadNotifs = notifs.filter(n => !n.read);

  const pie = [
    { name: 'Done', value: Number(stats.completedTasks) || 0 },
    { name: 'Active', value: Number(stats.inProgressTasks) || 0 },
    { name: 'Todo', value: Number(stats.todoTasks) || 0 },
  ];
  const COLS = ['#22c55e', '#8b5cf6', '#f97316'];

  const weekData = (() => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const counts: Record<string, number> = {}; days.forEach(d => counts[d] = 0);
    completed.forEach(t => { if (t.updatedAt) { counts[days[new Date(t.updatedAt).getDay()]] += 1; } });
    return days.map(d => ({ name: d, completed: counts[d] }));
  })();

  const statCards = [
    { title: 'Total Tasks', value: stats.totalTasks ?? 0, icon: <CheckSquare size={20}/>, bg: 'bg-pink-100', tc: 'text-pink-500' },
    { title: 'Completed', value: stats.completedTasks ?? 0, icon: <TrendingUp size={20}/>, bg: 'bg-green-100', tc: 'text-green-500' },
    { title: 'In Progress', value: stats.inProgressTasks ?? 0, icon: <Clock size={20}/>, bg: 'bg-blue-100', tc: 'text-blue-500' },
    { title: 'Projects', value: stats.totalProjects ?? 0, icon: <Folder size={20}/>, bg: 'bg-purple-100', tc: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Deadline reminder pop */}
      {unreadNotifs.length > 0 && (
        <motion.div initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} className={`p-4 rounded-2xl border flex items-start gap-3 ${theme==='light'?'bg-pink-50 border-pink-200':'bg-pink-900/20 border-pink-800/30'}`}>
          <Bell size={20} className="text-pink-500 shrink-0 mt-0.5"/>
          <div>
            <p className={`font-semibold text-sm ${tx}`}>You have {unreadNotifs.length} reminder(s)!</p>
            {unreadNotifs.slice(0, 3).map(n => <p key={n.id} className={`text-sm ${sub}`}>{n.message}</p>)}
            {unreadNotifs.length > 3 && <Link to="/settings" className="text-xs text-pink-500 font-semibold">View all →</Link>}
          </div>
        </motion.div>
      )}

      {/* Welcome */}
      <div className={`${card} p-6 rounded-3xl border flex items-center justify-between`}>
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${tx}`}>Welcome back, {user?.fullName}! 👋</h1>
          <p className={sub}><span className="font-bold text-pink-500">{stats.todoTasks || 0}</span> pending · <span className="font-bold text-green-500">{stats.completedTasks || 0}</span> completed · <span className="font-bold text-purple-500">{stats.totalProjects || 0}</span> projects</p>
          <Link to="/tasks" className="inline-flex items-center gap-1 mt-3 text-pink-500 font-semibold text-sm hover:underline">Go to Tasks <ArrowRight size={14}/></Link>
        </div>
        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || 'user'}&backgroundColor=fce7f3`} className="w-20 h-20 rounded-full shadow-lg border-4 border-pink-200 hidden md:block" alt=""/>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.title} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className={`${card} p-4 rounded-2xl border`}>
            <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.tc} flex items-center justify-center mb-2`}>{s.icon}</div>
            <h3 className={`text-2xl font-bold ${tx}`}>{s.value}</h3>
            <p className={`text-xs ${sub}`}>{s.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${card} p-6 rounded-3xl border`}>
          <h3 className={`font-bold mb-3 ${tx}`}>Weekly Completion</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/><stop offset="95%" stopColor="#ec4899" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme==='light'?'#fce7f3':'#ffffff10'} vertical={false}/>
                <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize:11}}/>
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tick={{fontSize:11}} allowDecimals={false}/>
                <RT contentStyle={{borderRadius:'12px',border:'none',boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}/>
                <Area type="monotone" dataKey="completed" stroke="#ec4899" strokeWidth={3} fill="url(#cg)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className={`${card} p-6 rounded-3xl border`}>
          <h3 className={`font-bold mb-2 ${tx}`}>Breakdown</h3>
          {tasks.length > 0 ? (<ResponsiveContainer width="100%" height={170}><PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">{pie.map((_,i)=><Cell key={i} fill={COLS[i]}/>)}</Pie><RT/></PieChart></ResponsiveContainer>
          ) : <p className={`${sub} text-center mt-10 text-sm`}>Add tasks to see chart</p>}
          <div className="flex justify-center gap-3 mt-1">{pie.map((p,i) => <span key={i} className={`text-[10px] ${sub} flex items-center gap-1`}><span className="w-2 h-2 rounded-full" style={{background:COLS[i]}}/>{p.name}: {p.value}</span>)}</div>
        </div>
      </div>

      {/* Recent */}
      <div className={`${card} p-6 rounded-3xl border`}>
        <div className="flex justify-between items-center mb-3"><h3 className={`font-bold ${tx}`}>Recent Tasks</h3><Link to="/tasks" className="text-xs text-pink-500 font-semibold">View All</Link></div>
        {recentTasks.length === 0 ? <p className={sub}>No tasks. <Link to="/tasks" className="text-pink-500 underline">Create one</Link></p> :
          <div className="space-y-2">{recentTasks.map(t => (
            <div key={t.id} className={`flex items-center justify-between p-3 rounded-xl ${theme==='light'?'bg-pink-50/50':'bg-brand-navy/50'}`}>
              <div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${t.status==='COMPLETED'?'bg-green-500':t.status==='IN_PROGRESS'?'bg-blue-500':'bg-orange-400'}`}/><span className={`text-sm font-medium ${t.status==='COMPLETED'?'line-through text-slate-400':tx}`}>{t.title}</span></div>
              <span className={`text-xs ${sub}`}>{t.dueDate||'No date'}</span>
            </div>
          ))}</div>}
      </div>
    </div>
  );
};
export default Dashboard;
