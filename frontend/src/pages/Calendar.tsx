import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api/axios';

const CalendarPage = () => {
  const { theme } = useContext(ThemeContext);
  const tx = theme === 'light' ? 'text-slate-800' : 'text-white';
  const sub = theme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const bg = theme === 'light' ? 'bg-white shadow-xl shadow-blue-100/50 border-blue-50' : 'bg-brand-dark border-white/10';

  const [tasks, setTasks] = useState<any[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => { api.get('/tasks').then(r => setTasks(r.data.data || [])).catch(() => {}); }, []);

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const offset = firstDay === 0 ? 6 : firstDay - 1; // shift to Mon-start
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const tasksForDay = (d: number) => {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return tasks.filter(t => t.dueDate === dateStr);
  };

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className={`text-3xl font-bold ${tx}`}>Calendar</h1>
      <div className={`${bg} rounded-3xl p-6 border`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(year-1); } else setMonth(month-1); }}
            className={`px-3 py-1 rounded-lg font-bold ${theme==='light'?'hover:bg-blue-50 text-slate-600':'hover:bg-white/5 text-slate-400'}`}>&larr;</button>
          <h2 className={`text-xl font-bold ${tx}`}>{months[month]} {year}</h2>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(year+1); } else setMonth(month+1); }}
            className={`px-3 py-1 rounded-lg font-bold ${theme==='light'?'hover:bg-blue-50 text-slate-600':'hover:bg-white/5 text-slate-400'}`}>&rarr;</button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map(d => <div key={d} className={`text-center text-xs font-bold py-2 ${sub}`}>{d}</div>)}
          {Array.from({length: offset}).map((_, i) => <div key={`e${i}`}/>)}
          {Array.from({length: daysInMonth}).map((_, i) => {
            const d = i + 1;
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const dayTasks = tasksForDay(d);
            return (
              <div key={d} onClick={() => setSelectedDay(d === selectedDay ? null : d)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all text-sm font-medium
                  ${isToday ? 'bg-gradient-to-br from-brand-pink to-brand-purple text-white shadow-md' :
                    theme==='light' ? 'hover:bg-pink-50 text-slate-700' : 'hover:bg-white/5 text-slate-300'}
                  ${selectedDay === d && !isToday ? (theme==='light'?'bg-blue-100 ring-2 ring-brand-indigo':'bg-white/10 ring-2 ring-brand-purple') : ''}
                `}>
                <span>{d}</span>
                {dayTasks.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-brand-pink mt-0.5"/>}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className={`${bg} rounded-3xl p-6 border`}>
          <h3 className={`font-bold mb-3 ${tx}`}>Tasks on {months[month]} {selectedDay}</h3>
          {tasksForDay(selectedDay).length === 0 ? <p className={sub}>No tasks scheduled.</p> :
            tasksForDay(selectedDay).map(t => (
              <div key={t.id} className={`p-3 rounded-xl mb-2 ${theme==='light'?'bg-pink-50 border border-pink-100':'bg-brand-navy border border-white/5'}`}>
                <span className={`font-semibold ${tx}`}>{t.title}</span>
                <span className={`ml-2 text-xs ${sub}`}>{t.priority}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};
export default CalendarPage;
