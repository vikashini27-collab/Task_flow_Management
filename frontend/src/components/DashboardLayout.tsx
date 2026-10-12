import React, { useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Folder, Calendar, Users, Bell, Settings, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { DashboardBackground } from './CloudScene';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'My Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Projects', icon: Folder, path: '/projects' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Team', icon: Users, path: '/team' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const sidebarBg = theme === 'light' ? 'bg-white/90 backdrop-blur-xl text-slate-800 border-r border-pink-100' : 'bg-brand-dark/90 backdrop-blur-xl text-slate-400 border-r border-white/5';
  const headerBg = theme === 'light' ? 'bg-white/70 backdrop-blur-xl border-pink-100' : 'bg-brand-navy/70 backdrop-blur-xl border-white/5';

  return (
    <div className={`flex h-screen transition-colors duration-300 ${theme === 'light' ? 'bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50' : 'bg-brand-navy'}`}>
      <DashboardBackground isLight={theme === 'light'} />

      {/* Sidebar */}
      <div className={`w-64 flex flex-col z-20 ${sidebarBg}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md"><CheckSquare size={18} /></div>
          <span className={`text-xl font-bold tracking-wide ${theme === 'light' ? 'text-pink-600' : 'text-white'}`}>TASKFLOW</span>
        </div>

        <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? (theme === 'light' ? 'bg-pink-100 text-pink-600 font-semibold' : 'bg-brand-purple/20 text-brand-purple font-semibold') : (theme === 'light' ? 'hover:bg-pink-50 text-slate-500' : 'hover:text-white hover:bg-white/5')}`}>
                <item.icon size={20} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className={`p-4 space-y-1 border-t ${theme === 'light' ? 'border-pink-100' : 'border-white/10'}`}>
          <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${theme === 'light' ? 'hover:bg-pink-50 text-slate-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}><UserIcon size={20}/><span className="text-sm">Profile</span></Link>
          <button onClick={() => navigate('/logout')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${theme === 'light' ? 'hover:bg-red-50 text-slate-500 hover:text-red-500' : 'text-slate-400 hover:text-red-400 hover:bg-white/5'}`}><LogOut size={20}/><span className="text-sm">Logout</span></button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className={`h-16 border-b flex items-center justify-between px-8 z-10 ${headerBg}`}>
          <input type="text" placeholder="Search..." className={`w-80 border rounded-full px-5 py-2 text-sm focus:outline-none ${theme === 'light' ? 'bg-pink-50/50 border-pink-100 focus:border-pink-300 text-slate-800 placeholder-slate-400' : 'bg-brand-dark/50 border-white/10 focus:border-brand-purple text-white placeholder-slate-500'}`} />
          <div className="flex items-center gap-5">
            <button onClick={toggleTheme} className={theme === 'light' ? 'text-slate-400 hover:text-pink-500' : 'text-slate-400 hover:text-white'}>{theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}</button>
            <Link to="/settings" className={`relative ${theme === 'light' ? 'text-slate-400 hover:text-pink-500' : 'text-slate-400 hover:text-white'}`}><Bell size={20}/><span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></span></Link>
            <div className={`flex items-center gap-3 pl-5 border-l ${theme === 'light' ? 'border-pink-100' : 'border-white/10'}`}>
              <div className="text-right">
                <div className={`text-sm font-semibold ${theme === 'light' ? 'text-slate-800' : 'text-white'}`}>{user?.fullName || 'User'}</div>
                <div className={`text-xs ${theme === 'light' ? 'text-slate-400' : 'text-slate-500'}`}>{user?.role || 'MEMBER'}</div>
              </div>
              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username || 'user'}&backgroundColor=fce7f3`} className="w-9 h-9 rounded-full shadow border-2 border-pink-200" alt=""/>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8 z-10 relative"><Outlet /></main>
      </div>
    </div>
  );
};
export default DashboardLayout;
