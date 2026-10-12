import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import api from '../api/axios';
import { Users, Copy, UserPlus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const Team = () => {
  const { theme } = useContext(ThemeContext);
  const tx = theme === 'light' ? 'text-slate-800' : 'text-white';
  const sub = theme === 'light' ? 'text-slate-500' : 'text-slate-400';
  const bg = theme === 'light' ? 'bg-white shadow-xl shadow-blue-100/50 border-blue-50' : 'bg-brand-dark border-white/10';
  const inp = theme === 'light' ? 'bg-blue-50 border-blue-100 text-slate-800' : 'bg-brand-navy border-white/10 text-white';

  const [teamName, setTeamName] = useState('');
  const [invites, setInvites] = useState<any[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [joinMsg, setJoinMsg] = useState('');
  const [copied, setCopied] = useState('');

  const fetchInvites = async () => { try { const r = await api.get('/team/invites'); setInvites(r.data.data || []); } catch {} };
  useEffect(() => { fetchInvites(); }, []);

  const createInvite = async () => {
    if (!teamName.trim()) return;
    try { await api.post('/team/invite', { teamName }); setTeamName(''); fetchInvites(); } catch {}
  };

  const joinTeam = async () => {
    if (!joinCode.trim()) return;
    try { const r = await api.post('/team/join', { code: joinCode }); setJoinMsg(r.data.message); setJoinCode(''); } catch (e: any) { setJoinMsg(e.response?.data?.message || 'Invalid code'); }
  };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(''), 2000); };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className={`text-3xl font-bold ${tx}`}>Team & Friends</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`${bg} p-6 rounded-3xl border`}>
          <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg"><Users size={22}/></div><h3 className={`text-xl font-bold ${tx}`}>Create Invite</h3></div>
          <p className={`text-sm ${sub} mb-4`}>Create a team and share the invite code with friends so they can join and plan tasks together.</p>
          <div className="flex gap-2">
            <input type="text" placeholder="Team name..." value={teamName} onChange={e => setTeamName(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-indigo ${inp}`}/>
            <button onClick={createInvite} className="bg-gradient-to-r from-brand-indigo to-brand-purple text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg">Create</button>
          </div>

          {invites.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className={`font-semibold ${tx}`}>Your Invite Codes</h4>
              {invites.map(inv => (
                <div key={inv.id} className={`flex items-center justify-between p-3 rounded-xl border ${theme==='light'?'bg-blue-50 border-blue-100':'bg-brand-navy border-white/5'}`}>
                  <div><span className={`font-bold ${tx}`}>{inv.teamName}</span><span className={`ml-3 font-mono text-sm px-2 py-1 rounded bg-pink-100 text-pink-600`}>{inv.inviteCode}</span></div>
                  <button onClick={() => copyCode(inv.inviteCode)} className="p-2 text-indigo-400 hover:bg-indigo-400/10 rounded-lg">
                    {copied === inv.inviteCode ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${bg} p-6 rounded-3xl border`}>
          <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-pink-500/10 text-pink-500 rounded-lg"><UserPlus size={22}/></div><h3 className={`text-xl font-bold ${tx}`}>Join a Team</h3></div>
          <p className={`text-sm ${sub} mb-4`}>Enter a code shared by your friend to join their team.</p>
          <div className="flex gap-2">
            <input type="text" placeholder="Paste invite code..." value={joinCode} onChange={e => setJoinCode(e.target.value)}
              className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-pink ${inp}`}/>
            <button onClick={joinTeam} className="bg-gradient-to-r from-brand-pink to-brand-orange text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg">Join</button>
          </div>
          {joinMsg && <motion.p initial={{opacity:0}} animate={{opacity:1}} className={`mt-4 p-3 rounded-xl text-sm font-medium ${joinMsg.includes('Joined') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{joinMsg}</motion.p>}
        </div>
      </div>
    </div>
  );
};
export default Team;
