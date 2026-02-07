import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Beer, Trophy, Utensils, BarChart3, Clock, Calendar, Lock, CheckCircle2, Send, MessageSquare, Star, Image as ImageIcon } from 'lucide-react';

// --- CONFIGURACIÓN DE SUPABASE ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  console.warn('Supabase no configurado aún.');
}

const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
);

const CustomStyles = () => (
  <style>{`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInFromTop { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInFromRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideInFromLeft { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes shatter { 0% { transform: perspective(1000px) rotateX(0) rotateY(0); } 50% { transform: perspective(1000px) rotateX(2deg) rotateY(-2deg); } 100% { transform: perspective(1000px) rotateX(0) rotateY(0); } }
    .animate-fadeIn { animation: fadeIn 500ms ease-in-out; }
    .animate-slideInFromTop { animation: slideInFromTop 500ms ease-out; }
    .animate-slideInFromRight { animation: slideInFromRight 500ms ease-out; }
    .animate-slideInFromLeft { animation: slideInFromLeft 500ms ease-out; }
    .sb-gradient { background: linear-gradient(135deg, #D91E63 0%, #8B008B 25%, #4169E1 50%, #00CED1 75%, #FFD700 100%); }
    .sb-glow { text-shadow: 0 0 10px rgba(216, 30, 99, 0.5), 0 0 20px rgba(65, 105, 225, 0.3); }
  `}</style>
);

export default function App() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(localStorage.getItem('basurto_name') || '');
  const [favTeam, setFavTeam] = useState(localStorage.getItem('basurto_team') || '');
  const [view, setView] = useState('onboarding_name');
  const [globalStats, setGlobalStats] = useState({ cheves: 0, participants: 7 });
  const [allQuinielas, setAllQuinielas] = useState([]);
  const [myQuiniela, setMyQuiniela] = useState(null);
  const [messages, setMessages] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [now, setNow] = useState(new Date());
  const [newMessage, setNewMessage] = useState('');
  const [mySurvey, setMySurvey] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showQuinielasDetail, setShowQuinielasDetail] = useState(false);
  const [showCheveMeter, setShowCheveMeter] = useState(false);
  const [showQuiniela, setShowQuiniela] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);
  const [cheveCount, setCheveCount] = useState(parseInt(localStorage.getItem('basurto_cheves')) || 0);
  const [isSendingSurvey, setIsSendingSurvey] = useState(false);

  const [formQuiniela, setFormQuiniela] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '',
    q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '', q20: '',
    q21: '', q22: '', q23: '', q24: '', q25: ''
  });

  const quinielaQuestions = [
    { id: 'q1', q: 'Ganador del volado de inicio', opt: ['SEA', 'NE'] },
    { id: 'q2', q: '1er Touchdown (tipo)', opt: ['Pase', 'Carrera'] },
    { id: 'q3', q: 'Color Gatorade ganador', opt: ['Naranja', 'Azul', 'Verde', 'Otro'] },
    { id: 'q4', q: 'Total TDs parte 1', opt: ['Menos de 3', '3-4', 'Más de 4'] },
    { id: 'q5', q: 'Equipo con 1er score', opt: ['SEA', 'NE'] },
    { id: 'q6', q: 'MVP será...', opt: ['QBack', 'RB', 'WR', 'Defensa'] },
    { id: 'q7', q: 'Halftime show sorpresa', opt: ['Sí', 'No'] },
    { id: 'q8', q: 'Penales totales', opt: ['Menos de 10', '10-15', 'Más de 15'] },
    { id: 'q9', q: 'Final será cercano', opt: ['Sí (menos 7)', 'No (más 8)'] },
    { id: 'q10', q: 'Héroe inesperado', opt: ['SEA', 'NE'] },
    { id: 'q11', q: 'Jugada más épica en', opt: ['1er tiempo', '2do tiempo'] },
    { id: 'q12', q: 'Puntuación final par/impar', opt: ['Par', 'Impar'] },
    { id: 'q13', q: 'Equipo en rojo más veces', opt: ['SEA', 'NE'] },
    { id: 'q14', q: 'Retraso por problemas técnicos', opt: ['Sí', 'No'] },
    { id: 'q15', q: 'Canción halftime que suene', opt: ['Original', 'Remix'] },
    { id: 'q16', q: 'Primer 3er down', opt: ['SEA', 'NE'] },
    { id: 'q17', q: 'Más intercepciones (equipo)', opt: ['SEA', 'NE', 'Empate'] },
    { id: 'q18', q: 'Último TD será en', opt: ['Pase', 'Carrera'] },
    { id: 'q19', q: 'Ovación más larga en', opt: ['1er tiempo', '2do tiempo', 'Igual'] },
    { id: 'q20', q: 'Sorpresa en comerciales', opt: ['Sí', 'No'] },
    { id: 'q21', q: 'Win probabilidad final', opt: ['SEA daba menos', 'NE daba menos'] },
    { id: 'q22', q: 'Touchdown defensivo', opt: ['Sí', 'No'] },
    { id: 'q23', q: 'Celebración más épica', opt: ['SEA', 'NE', 'Ninguna'] },
    { id: 'q24', q: 'Jarretazo post-juego', opt: ['Sí', 'No'] },
    { id: 'q25', q: '🏈 GANADOR SUPERBOWL 🏈', opt: ['SEAHAWKS', 'PATRIOTS'] }
  ];

  const agenda = [
    { id: 1, name: 'Pre-Game & Botanas', time: new Date('2026-02-08T15:30:00') },
    { id: 2, name: 'Himno Nacional', time: new Date('2026-02-08T16:15:00') },
    { id: 3, name: 'KICKOFF', time: new Date('2026-02-08T16:30:00') },
    { id: 4, name: 'Halftime Show', time: new Date('2026-02-08T18:30:00') },
    { id: 5, name: 'Trofeo Lombardi', time: new Date('2026-02-08T20:15:00') },
  ];

  const menuOptions = [
    { name: 'Hamburguesas', desc: 'Ricas hamburguesas calidad cojco.' },
    { name: 'Papas Fritas', desc: '' },
    { name: 'Nachos Supreme', desc: '' },
    { name: 'Refresco', desc: '' },
    { name: 'Cerveza', desc: '' },
    { name: 'Agua mineral', desc: '' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getNextEvent = () => {
    return agenda.find(e => e.time > now) || agenda[agenda.length - 1];
  };

  const getStatus = (eventTime) => {
    if (now > eventTime) return 'passed';
    if (now.getTime() + 3600000 > eventTime.getTime() && now < eventTime) return 'current';
    return 'future';
  };

  const isGameEnded = now > new Date('2026-02-08T20:15:00');

  // Auth - Usar solo localStorage sin Supabase Auth
  useEffect(() => {
    const initAuth = async () => {
      const storedUserId = localStorage.getItem('basurto_uid');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        const newUserId = 'user-' + Date.now();
        setUserId(newUserId);
        localStorage.setItem('basurto_uid', newUserId);
        
        // Insertar usuario en Supabase para evitar FK constraint
        if (supabase) {
          try {
            await supabase.from('users').insert({
              uid: newUserId,
              name: 'Guest',
              team: null
            }).then(() => null).catch(() => null); // No fallar si ya existe
          } catch (err) {
            // Silenciar errores
          }
        }
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (userName && favTeam) setView('dashboard');
    else if (userName) setView('onboarding_team');
  }, []);

  // Fetch data
  useEffect(() => {
    if (!userId || !supabase) return;
    fetchStats();
    fetchQuinielas();
    fetchMessages();
    fetchSurveys();
  }, [userId]);

  const fetchStats = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from('stats').select('*').limit(1);
      if (data?.length > 0) setGlobalStats(data[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuinielas = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from('quinielas').select('*');
      if (data) {
        setAllQuinielas(data);
        setMyQuiniela(data.find(q => q.uid === userId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
      if (data) setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSurveys = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from('surveys').select('*');
      if (data) {
        setSurveys(data);
        setMySurvey(data.find(s => s.uid === userId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || !supabase) return;
    try {
      // Asegurar que el usuario existe en la tabla
      await supabase.from('users').upsert({
        uid: userId,
        name: userName || 'Guest',
        team: favTeam || null,
        lastActive: new Date().toISOString()
      }, { onConflict: 'uid' }).then(() => null).catch(() => null);
      
      const { error } = await supabase.from('messages').insert({
        uid: userId,
        name: userName || 'Guest',
        text: newMessage,
        created_at: new Date().toISOString()
      });
      if (!error) {
        setNewMessage('');
        await fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitSurvey = async (responses) => {
    if (mySurvey) {
      alert('Ya has respondido la encuesta!');
      return;
    }
    if (!userId || !supabase) {
      alert('No se pudo guardar la encuesta. Intenta recargar la página.');
      return;
    }
    if (isSendingSurvey) return;
    
    setIsSendingSurvey(true);
    try {
      // Asegurar que el usuario existe
      await supabase.from('users').upsert({
        uid: userId,
        name: userName || 'Guest',
        team: favTeam || null,
        lastActive: new Date().toISOString()
      }, { onConflict: 'uid' }).then(() => null).catch(() => null);
      
      const { error } = await supabase.from('surveys').insert({
        uid: userId,
        name: userName,
        q1: responses.q1 || '',
        q2: responses.q2 || '',
        q3: responses.q3 || '',
        q4: responses.q4 || '',
        q5: responses.q5 || ''
      });
      if (error) {
        console.error('Error al guardar encuesta:', error);
        alert('Error: ' + (error.message || 'No se pudo guardar'));
        setIsSendingSurvey(false);
      } else {
        setMySurvey({ uid: userId, name: userName, ...responses });
        setIsSendingSurvey(false);
      }
    } catch (err) {
      console.error('Exception:', err);
      alert('Error: ' + err.message);
      setIsSendingSurvey(false);
    }
  };

  const teamColor = favTeam === 'Seahawks' ? 'bg-[#69BE28]' : favTeam === 'Patriots' ? 'bg-[#C60C30]' : 'bg-yellow-400';
  const teamText = favTeam === 'Seahawks' ? 'text-[#69BE28]' : favTeam === 'Patriots' ? 'text-[#C60C30]' : 'text-yellow-400';

  const handleRegisterName = (name) => {
    if (!name.trim()) return;
    setUserName(name);
    localStorage.setItem('basurto_name', name);
    setView('onboarding_team');
  };

  const handleSelectTeam = async (team) => {
    setFavTeam(team);
    localStorage.setItem('basurto_team', team);
    if (userId && supabase) {
      try {
        await supabase.from('users').upsert({
          uid: userId,
          name: userName,
          team: team,
          lastActive: new Date().toISOString()
        });
      } catch (err) {
        console.error(err);
      }
    }
    setView('dashboard');
  };

  // --- VISTAS ---

  if (view === 'onboarding_name') return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans animate-fadeIn">
      <FontLink />
      <CustomStyles />
      <div className="w-24 h-24 bg-yellow-300 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-yellow-300/50 animate-bounce">
        <Trophy size={56} className="text-slate-950" />
      </div>
      <h1 className="text-6xl md:text-7xl font-black mb-3 italic text-white drop-shadow-2xl" style={{ fontFamily: 'Permanent Marker' }}>CASA BASURTO</h1>
      <p className="text-yellow-200 mb-12 uppercase text-sm tracking-[0.3em] font-black drop-shadow">The Hub</p>
      <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-3xl border-2 border-yellow-300/50 w-full max-w-sm shadow-2xl">
        <p className="text-sm font-black text-yellow-300 mb-6 uppercase tracking-widest">Identifícate, Coach</p>
        <input 
          id="nameIn" type="text" placeholder="Tu nombre..."
          className="w-full bg-slate-700/80 p-4 rounded-xl mb-4 border-2 border-yellow-400/40 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/30 transition-all font-bold text-white text-base"
          onKeyDown={(e) => e.key === 'Enter' && handleRegisterName(e.target.value)}
        />
        <button onClick={() => handleRegisterName(document.getElementById('nameIn').value)}
          className="w-full bg-yellow-300 text-slate-950 font-black py-4 rounded-xl uppercase italic tracking-tighter shadow-lg hover:shadow-2xl hover:bg-yellow-200 hover:scale-105 transition-all active:scale-95">
          Entrar
        </button>
      </div>
    </div>
  );

  if (view === 'onboarding_team') return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white p-4 flex flex-col items-center justify-center font-sans animate-fadeIn">
      <FontLink />
      <CustomStyles />
      <h2 className="text-6xl md:text-7xl font-black mb-3 text-center italic text-white drop-shadow-2xl" style={{ fontFamily: 'Permanent Marker' }}>ELIGE TU BANDO</h2>
      <p className="text-yellow-200 mb-12 text-center text-sm font-black uppercase tracking-widest">La casa se divide hoy</p>
      <div className="grid gap-6 w-full max-w-sm">
        <button onClick={() => handleSelectTeam('Seahawks')} 
          className="bg-slate-800/60 backdrop-blur-sm border-2 border-[#69BE28]/60 p-6 rounded-2xl flex items-center gap-4 hover:border-[#69BE28] hover:scale-105 transition-all shadow-lg hover:shadow-[#69BE28]/30">
          <div className="w-14 h-14 bg-[#002244] border-2 border-[#69BE28] rounded-full flex items-center justify-center font-black text-[#7FD144]">SEA</div>
          <div>
            <h4 className="font-black uppercase text-lg text-white">Seahawks</h4>
            <p className="text-xs text-[#7FD144] font-black">Action Green</p>
          </div>
        </button>
        <button onClick={() => handleSelectTeam('Patriots')} 
          className="bg-slate-800/60 backdrop-blur-sm border-2 border-[#C60C30]/60 p-6 rounded-2xl flex items-center gap-4 hover:border-[#C60C30] hover:scale-105 transition-all shadow-lg hover:shadow-[#C60C30]/30">
          <div className="w-14 h-14 bg-[#002244] border-2 border-[#C60C30] rounded-full flex items-center justify-center font-black text-[#FF6B6B]">NE</div>
          <div>
            <h4 className="font-black uppercase text-lg text-white">Patriots</h4>
            <p className="text-xs text-[#FF6B6B] font-black">Dynasty</p>
          </div>
        </button>
      </div>
    </div>
  );

  const nextEv = getNextEvent();

  if (view === 'dashboard') return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <FontLink />
      <CustomStyles />
      
      {/* Header con gradiente Super Bowl LX */}
      <header className="sb-gradient text-white border-b-4 border-slate-900 p-4 shadow-2xl sticky top-0 z-50" style={{boxShadow: '0 10px 30px rgba(216, 30, 99, 0.3)'}}>
        <div className="flex items-center justify-center mb-2">
          <div className="flex-1 text-center">
            <h1 className="text-5xl md:text-6xl font-black italic drop-shadow-2xl sb-glow" style={{fontFamily: 'Arial, sans-serif', letterSpacing: '-3px', fontWeight: '900'}}>LX</h1>
          </div>
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-center text-white/90" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)', fontFamily: 'Arial, sans-serif'}}>THE BIG GAME 🏈</p>
        <p className="text-xs font-black uppercase tracking-tight text-white/70 text-center mt-2 drop-shadow" style={{fontFamily: 'Arial, sans-serif'}}>Casa Basurto • {userName} • {favTeam}</p>
      </header>

      <main className="p-4 max-w-2xl mx-auto space-y-6 pb-6 animate-fadeIn">
        
        {!isGameEnded ? (
          <>
            {/* ANTES Y DURANTE EL PARTIDO */}
            {/* 1. Para Saber Más */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border-2 border-pink-500/50 shadow-2xl hover:shadow-3xl transition-all drop-shadow-lg" style={{boxShadow: '0 20px 25px -5px rgba(217, 30, 99, 0.3)'}}>
              <button onClick={() => setShowMoreInfo(true)} className="w-full text-left hover:opacity-90 transition-all">
                <h2 className="text-3xl font-black italic text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #D91E63, #FF1493)', fontFamily: 'Arial, sans-serif', letterSpacing: '-1px', fontWeight: '900'}}>ℹ️ PARA SABER MÁS</h2>
                <p className="text-xs text-pink-300 mt-2 font-bold">Equipos, jugadores, curiosidades</p>
              </button>
            </div>

            {/* 2. Estado Actual */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border-2 border-cyan-500/50 shadow-2xl hover:shadow-3xl transition-all drop-shadow-lg" style={{boxShadow: '0 20px 25px -5px rgba(65, 105, 225, 0.3)'}}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black italic text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #4169E1, #00CED1)', fontFamily: 'Arial, sans-serif', fontWeight: '900'}}>ESTADO ACTUAL</h2>
                <button onClick={() => setShowAgenda(true)} className="text-xs font-black text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 transition-all" style={{fontFamily: 'Arial, sans-serif'}}>
                  <Calendar size={14} /> AGENDA
                </button>
              </div>
              <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-4 rounded-xl border-2 border-cyan-500/50 mb-4">
                <p className="text-xs text-cyan-300 font-black uppercase mb-1">Próximo evento:</p>
                <h3 className="text-3xl font-black italic text-white drop-shadow" style={{fontFamily: 'Arial, sans-serif'}}>{nextEv.name}</h3>
                <p className="text-sm text-cyan-200 font-bold mt-2">{nextEv.time.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <button onClick={() => setShowCheveMeter(true)} className={`w-full p-4 rounded-xl border-2 font-black transition-all active:scale-95 ${
                cheveCount >= 6 ? 'bg-gradient-to-r from-red-900 to-red-800 border-red-600 text-red-100' :
                cheveCount > 4 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-500 text-yellow-50' :
                'bg-gradient-to-r from-slate-700 to-slate-600 border-blue-400 text-white'
              }`} style={{fontFamily: 'Arial, sans-serif'}}>
                <p className="text-xs font-black opacity-80">CHEVE-METER</p>
                <p className="text-4xl font-black drop-shadow">{cheveCount} 🍺</p>
              </button>
            </div>

            {/* 3. La Quiniela */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border-2 border-cyan-500/50 shadow-2xl hover:shadow-3xl transition-all drop-shadow-lg" style={{boxShadow: '0 20px 25px -5px rgba(0, 206, 209, 0.3)'}}>
              <button onClick={() => setShowQuiniela(true)} className="w-full text-left hover:opacity-90 transition-all">
                <h2 className="text-2xl font-black italic text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #00CED1, #00FF00)', fontFamily: 'Arial, sans-serif', fontWeight: '900'}}>🏆 LA QUINIELA</h2>
                <p className="text-xs text-cyan-300 mt-2 font-bold\">{myQuiniela ? '✅ BLOQUEADA' : '📝 25 PREGUNTAS'}</p>
              </button>
              {myQuiniela && (
                <button onClick={() => setShowQuinielasDetail(true)} className="w-full mt-4 bg-gradient-to-r from-slate-700 to-slate-600 p-3 rounded-xl border-2 border-cyan-500/40 hover:border-cyan-500/70 transition-all text-cyan-300 font-black hover:bg-slate-600" style={{fontFamily: 'Arial, sans-serif'}}>
                  Ver todas las quinielas ({allQuinielas.length} jugadores)
                </button>
              )}
            </div>

            {/* 4. Mensajes */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border-2 border-yellow-500/50 shadow-2xl hover:shadow-3xl transition-all drop-shadow-lg" style={{boxShadow: '0 20px 25px -5px rgba(255, 215, 0, 0.3)'}}>
              <button onClick={() => setShowMessages(true)} className="w-full text-left hover:opacity-90 transition-all">
                <h2 className="text-2xl font-black italic text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #FFD700, #FFA500)', fontFamily: 'Arial, sans-serif', fontWeight: '900'}}>💬 MENSAJES</h2>
                <p className="text-xs text-yellow-300 mt-2 font-bold">{messages.length} mensajes • Haz clic para abrir</p>
              </button>
            </div>

            {/* 5. Menú - Purple Accent */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border-2 border-pink-500/50 shadow-2xl shadow-sm transition-all drop-shadow-lg opacity-60 pointer-events-none" style={{boxShadow: '0 10px 15px -3px rgba(217, 30, 99, 0.2)'}}>
              <button className="w-full text-left cursor-not-allowed">
                <h2 className="text-2xl font-black italic text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #D91E63, #8B008B)', fontFamily: 'Arial, sans-serif', fontWeight: '900'}}>🍔 MENÚ</h2>
                <p className="text-xs text-pink-300 mt-2 font-bold">Disponible durante el evento</p>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* DESPUÉS DEL PARTIDO - Solo Encuesta */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border-2 border-pink-500/50 shadow-2xl hover:shadow-3xl transition-all drop-shadow-lg" style={{boxShadow: '0 20px 25px -5px rgba(216, 30, 99, 0.3)'}}>
              <h2 className="text-2xl font-black italic text-transparent bg-clip-text mb-4" style={{backgroundImage: 'linear-gradient(135deg, #D91E63, #4169E1)', fontFamily: 'Arial, sans-serif', fontWeight: '900'}}>⭐ ENCUESTA DE CALIDAD</h2>
              {!mySurvey ? (
                <SurveyForm onSubmit={submitSurvey} isLoading={isSendingSurvey} />
              ) : (
                <p className="text-sm bg-pink-500/20 text-pink-300 p-3 rounded-xl border border-pink-500/40 font-bold text-center">✅ ¡Gracias por tu feedback!</p>
              )}
            </div>
          </>
        )}
      </main>

      {/* MODAL: Quinielas Detail */}
      {showQuinielasDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-800 rounded-3xl border-2 border-emerald-500/40 shadow-2xl w-full max-h-[90vh] overflow-y-auto max-w-lg">
            <div className="sticky top-0 bg-slate-800 p-6 border-b-2 border-emerald-500/40 flex justify-between items-center">
              <h2 className="text-2xl font-black italic text-emerald-400 drop-shadow" style={{ fontFamily: 'Permanent Marker' }}>Tabla de Posiciones</h2>
              <button onClick={() => setShowQuinielasDetail(false)} className="text-2xl text-emerald-400 hover:text-emerald-300 font-black">✕</button>
            </div>
            <div className="p-6 space-y-3">
              {allQuinielas.map((q, idx) => (
                <div key={q.id} className="bg-slate-700 p-4 rounded-xl border-2 border-slate-600 hover:border-emerald-500/40 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-white">{idx+1}. {q.name}</p>
                      <p className={`text-xs font-black uppercase ${q.team === 'Seahawks' ? 'text-[#69BE28]' : 'text-[#C60C30]'}`}>{q.team}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">GANA:</p>
                      <p className="text-lg font-black text-emerald-400">{q.q25}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: More Info */}
      {showMoreInfo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto z-50 animate-fadeIn">
          <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="bg-slate-800 rounded-3xl border-2 border-cyan-400/40 shadow-2xl w-full max-w-2xl">
              <div className="sticky top-0 bg-slate-800 p-6 border-b-2 border-cyan-400/40 flex justify-between items-center rounded-t-3xl">
                <div>
                  <h1 className="text-2xl font-black italic text-cyan-400 drop-shadow" style={{ fontFamily: 'Permanent Marker' }}>SUPER BOWL LX</h1>
                  <p className="text-xs font-black uppercase tracking-tight text-cyan-300">Para Saber Más</p>
                </div>
                <button onClick={() => setShowMoreInfo(false)} className="text-2xl text-cyan-400 hover:text-cyan-300 font-black">✕</button>
              </div>
              
              <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Generalidades */}
                <div className="bg-slate-700 p-4 rounded-2xl border-2 border-cyan-400/40">
                  <h2 className="text-xl font-black italic text-cyan-400 drop-shadow mb-3" style={{ fontFamily: 'Permanent Marker' }}>📺 Generalidades</h2>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-black text-cyan-300">📅 Fecha:</span> Domingo, 8 de Febrero de 2026</p>
                    <p><span className="font-black text-cyan-300">🕐 Hora:</span> 4:30 PM (Kickoff 5:30 PM)</p>
                    <p><span className="font-black text-cyan-300">📍 Estadio:</span> Caesars Superdome, New Orleans, Louisiana</p>
                    <p><span className="font-black text-cyan-300">🎭 Halftime:</span> Show especial TBA</p>
                    <p><span className="font-black text-cyan-300">🏆 Champion:</span> El ganador se lleva el Trofeo Lombardi y gloria eterna</p>
                  </div>
                </div>

                {/* Equipos */}
                <div className="bg-slate-700 p-4 rounded-2xl border-2 border-emerald-400/40">
                  <h2 className="text-xl font-black italic text-emerald-400 drop-shadow mb-3" style={{ fontFamily: 'Permanent Marker' }}>🏈 Equipos</h2>
                  <div className="space-y-3">
                    <div className="bg-slate-600 p-3 rounded-xl border-2 border-[#69BE28]/40">
                      <h3 className="font-black text-[#7FD144] text-base mb-1">🦅 SEATTLE SEAHAWKS</h3>
                      <p className="text-xs text-slate-300 mb-2">Seattle, Washington | AFC West</p>
                      <p className="text-xs text-slate-200 font-bold mb-2">Una dinastía defensiva que busca volver a la gloria. Conocidos por su "Legion of Boom" y su defensa sofocante.</p>
                      <a href="https://seahawks.com" target="_blank" rel="noopener noreferrer" className="text-xs font-black text-[#69BE28] hover:text-[#7FD144] underline">→ Sitio oficial</a>
                    </div>
                    <div className="bg-slate-600 p-3 rounded-xl border-2 border-[#C60C30]/40">
                      <h3 className="font-black text-[#FF6B6B] text-base mb-1">🛡️ NEW ENGLAND PATRIOTS</h3>
                      <p className="text-xs text-slate-300 mb-2">Foxborough, Massachusetts | AFC East</p>
                      <p className="text-xs text-slate-200 font-bold mb-2">La dinastía histórica de New England. Ganadores de 6 Super Bowls. Buscan agregar otro capítulo a su legenda.</p>
                      <a href="https://patriots.nfl.com" target="_blank" rel="noopener noreferrer" className="text-xs font-black text-[#C60C30] hover:text-[#FF6B6B] underline">→ Sitio oficial</a>
                    </div>
                  </div>
                </div>

                {/* Jugadores Clave */}
                <div className="bg-slate-700 p-4 rounded-2xl border-2 border-purple-400/40">
                  <h2 className="text-xl font-black italic text-purple-400 drop-shadow mb-3" style={{ fontFamily: 'Permanent Marker' }}>⭐ Jugadores CLAVE</h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-black text-[#7FD144] text-sm mb-2">SEAHAWKS</h3>
                      <div className="space-y-2">
                        <div className="bg-slate-600 p-2 rounded-lg border-l-4 border-[#69BE28]">
                          <p className="font-black text-white text-sm">Geno Smith - QB</p>
                          <p className="text-xs text-slate-300">MVP del equipo. Brazo fuerte.</p>
                        </div>
                        <div className="bg-slate-600 p-2 rounded-lg border-l-4 border-[#69BE28]">
                          <p className="font-black text-white text-sm">DK Metcalf - WR</p>
                          <p className="text-xs text-slate-300">Receptor de élite con atletismo excepcional.</p>
                        </div>
                        <div className="bg-slate-600 p-2 rounded-lg border-l-4 border-[#69BE28]">
                          <p className="font-black text-white text-sm">Jamal Adams - DB/LB</p>
                          <p className="text-xs text-slate-300">Defensor versátil líder defensivo.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-black text-[#FF6B6B] text-sm mb-2">PATRIOTS</h3>
                      <div className="space-y-2">
                        <div className="bg-slate-600 p-2 rounded-lg border-l-4 border-[#C60C30]">
                          <p className="font-black text-white text-sm">Mac Jones - QB</p>
                          <p className="text-xs text-slate-300">Joven promesa. Precisión quirúrgica.</p>
                        </div>
                        <div className="bg-slate-600 p-2 rounded-lg border-l-4 border-[#C60C30]">
                          <p className="font-black text-white text-sm">Deion Jones - LB</p>
                          <p className="text-xs text-slate-300">Corazón defensivo del equipo.</p>
                        </div>
                        <div className="bg-slate-600 p-2 rounded-lg border-l-4 border-[#C60C30]">
                          <p className="font-black text-white text-sm">JC Jackson - CB</p>
                          <p className="text-xs text-slate-300">Cobertura elite. Cazador intercepciones.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Datos Curiosos */}
                <div className="bg-slate-700 p-4 rounded-2xl border-2 border-pink-400/40">
                  <h2 className="text-xl font-black italic text-pink-400 drop-shadow mb-3" style={{ fontFamily: 'Permanent Marker' }}>🎯 Datos Curiosos</h2>
                  <div className="space-y-2 text-xs">
                    <div className="flex gap-2">
                      <span className="font-black text-pink-400 min-w-fit">🏆</span>
                      <p><span className="font-black">Historial:</span> Seahawks ganaron SB XLVIII. Patriots ganaron 6 títulos.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-black text-pink-400 min-w-fit">🍕</span>
                      <p><span className="font-black">Consumo:</span> Se consumen 1.4 billones de alitas de pollo ¡en USA!</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-black text-pink-400 min-w-fit">📺</span>
                      <p><span className="font-black">Comerciales:</span> Pagan $7M+ por 30 segundos.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-black text-pink-400 min-w-fit">💰</span>
                      <p><span className="font-black">Boletos:</span> Promedio $10K+. Máximo: $30K+</p>
                    </div>
                  </div>
                </div>

                {/* Estadio */}
                <div className="bg-slate-700 p-4 rounded-2xl border-2 border-amber-400/40">
                  <h2 className="text-xl font-black italic text-amber-400 drop-shadow mb-3" style={{ fontFamily: 'Permanent Marker' }}>🏟️ Caesars Superdome</h2>
                  <div className="space-y-2 text-xs">
                    <p><span className="font-black text-amber-300">📍 Ubicación:</span> New Orleans, Louisiana</p>
                    <p><span className="font-black text-amber-300">👥 Capacidad:</span> 73,208 espectadores</p>
                    <p><span className="font-black text-amber-300">🏗️ Construido:</span> 1975. Diseño futurista de "domos"</p>
                    <p><span className="font-black text-amber-300">🎪 Nota:</span> Hogar de los New Orleans Saints.</p>
                    <a href="https://caesarssuperdome.com" target="_blank" rel="noopener noreferrer" className="text-xs font-black text-amber-400 hover:text-amber-300 underline">→ Sitio oficial</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cheve-Meter */}
      {showCheveMeter && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-800 rounded-3xl border-2 border-yellow-300/40 shadow-2xl w-full max-w-md p-8 text-center">
            <h2 className="text-3xl font-black italic text-yellow-300 drop-shadow mb-4" style={{ fontFamily: 'Permanent Marker' }}>🍺 CHEVE-METER</h2>
            <p className="text-5xl font-black text-white drop-shadow mb-6">{cheveCount}</p>
            <div className="space-y-3 mb-6">
              <p className="text-sm text-slate-300">¿Ya te acabaste tu cheve?</p>
              <div className="flex gap-3">
                <button onClick={() => {
                  setCheveCount(cheveCount + 1);
                  localStorage.setItem('basurto_cheves', (cheveCount + 1).toString());
                }} className="flex-1 bg-emerald-500 text-white font-black py-3 rounded-xl hover:bg-emerald-400 transition-all">
                  Sí! ✅
                </button>
                <button onClick={() => setShowCheveMeter(false)} className="flex-1 bg-slate-700 text-white font-black py-3 rounded-xl hover:bg-slate-600 transition-all">
                  Aún no
                </button>
              </div>
            </div>
            <button onClick={() => setShowCheveMeter(false)} className="text-2xl text-yellow-300 hover:text-yellow-200 font-black mx-auto block mt-4">✕</button>
          </div>
        </div>
      )}

      {/* MODAL: Quiniela */}
      {showQuiniela && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto z-50 animate-fadeIn">
          <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="bg-slate-800 rounded-3xl border-2 border-emerald-500/40 shadow-2xl w-full max-w-2xl">
              <div className="sticky top-0 bg-slate-800 p-6 border-b-2 border-emerald-500/40 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-2xl font-black italic text-emerald-400 drop-shadow" style={{ fontFamily: 'Permanent Marker' }}>🏆 La Quiniela</h2>
                <button onClick={() => setShowQuiniela(false)} className="text-2xl text-emerald-400 hover:text-emerald-300 font-black">✕</button>
              </div>
              <div className="p-6">
                {!myQuiniela ? (
                  <div className="space-y-4">
                    <p className="text-xs bg-emerald-500/20 text-emerald-300 p-3 rounded-xl border border-emerald-500/40 font-bold">⚠️ Al guardar no podrás editar. ¡Elige con sabiduría!</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
                      {quinielaQuestions.map((item, idx) => (
                        <div key={item.id} className="space-y-2">
                          <p className="text-xs font-black text-yellow-300 uppercase leading-tight">{idx+1}. {item.q}</p>
                          <div className="flex flex-wrap gap-2">
                            {item.opt.map(o => (
                              <button key={o} onClick={() => setFormQuiniela({...formQuiniela, [item.id]: o})} 
                                className={`flex-1 min-w-16 py-2 rounded-lg text-xs font-black transition-all border-2 ${formQuiniela[item.id] === o ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-95 shadow-lg' : 'border-slate-600 text-slate-300 hover:border-emerald-500/50'}`}>
                                {o}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={async () => {
                      if (!userId || !supabase) return;
                      try {
                        // Asegurar que el usuario existe
                        await supabase.from('users').upsert({
                          uid: userId,
                          name: userName,
                          team: favTeam,
                          lastActive: new Date().toISOString()
                        }, { onConflict: 'uid' }).then(() => null).catch(() => null);
                        
                        await supabase.from('quinielas').insert({
                          uid: userId,
                          name: userName,
                          team: favTeam,
                          ...formQuiniela
                        });
                        await fetchQuinielas();
                        setShowQuiniela(false);
                      } catch (err) {
                        console.error(err);
                      }
                    }} className="w-full bg-emerald-500 text-slate-950 font-black py-4 rounded-xl shadow-lg hover:bg-emerald-400 transition-all active:scale-95 text-lg" style={{ fontFamily: 'Permanent Marker' }}>BLOQUEAR Y ENVIAR</button>
                  </div>
                ) : (
                  <p className="text-sm bg-emerald-500/20 text-emerald-300 p-3 rounded-xl border border-emerald-500/40 font-bold">✅ Tu quiniela está bloqueada</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Mensajes */}
      {showMessages && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto z-50 animate-fadeIn">
          <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="bg-slate-800 rounded-3xl border-2 border-blue-400/40 shadow-2xl w-full max-w-md">
              <div className="sticky top-0 bg-slate-800 p-6 border-b-2 border-blue-400/40 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-2xl font-black italic text-blue-400 drop-shadow" style={{ fontFamily: 'Permanent Marker' }}>💬 Mensajes</h2>
                <button onClick={() => setShowMessages(false)} className="text-2xl text-blue-400 hover:text-blue-300 font-black">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-slate-700 p-4 rounded-xl max-h-56 overflow-y-auto space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">Sin mensajes aún...</p>
                  ) : (
                    messages.map((msg, idx) => (
                      <div key={idx} className="bg-slate-600 p-3 rounded-lg border-l-2 border-blue-400">
                        <p className="text-xs font-black text-blue-300">{msg.name}</p>
                        <p className="text-sm text-white mt-1">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Tu mensaje..."
                    className="flex-1 bg-slate-700 p-3 rounded-lg border-2 border-slate-600 focus:border-blue-400 text-white text-sm outline-none transition-all"
                  />
                  <button onClick={sendMessage} className="bg-blue-500 text-white p-3 rounded-lg font-black hover:bg-blue-400 transition-all flex items-center gap-1">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Agenda */}
      {showAgenda && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto z-50 animate-fadeIn">
          <div className="min-h-screen p-4 flex items-center justify-center">
            <div className="bg-slate-800 rounded-3xl border-2 border-orange-400/40 shadow-2xl w-full max-w-md">
              <div className="sticky top-0 bg-slate-800 p-6 border-b-2 border-orange-400/40 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-2xl font-black italic text-orange-400 drop-shadow" style={{ fontFamily: 'Permanent Marker' }}>📅 Agenda</h2>
                <button onClick={() => setShowAgenda(false)} className="text-2xl text-orange-400 hover:text-orange-300 font-black">✕</button>
              </div>
              <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                {agenda.map((item, idx) => {
                  const status = getStatus(item.time);
                  const statusColor = status === 'Próximamente' ? 'from-slate-600 to-slate-700 border-slate-500' :
                                    status === 'En curso' ? 'from-green-600/30 to-green-700/30 border-green-500/50' :
                                    'from-slate-700 to-slate-800 border-slate-600';
                  const statusBadge = status === 'Próximamente' ? 'bg-slate-500 text-slate-100' :
                                    status === 'En curso' ? 'bg-green-500 text-white animate-pulse' :
                                    'bg-slate-600 text-slate-300';
                  
                  return (
                    <div key={idx} className={`bg-gradient-to-r ${statusColor} p-4 rounded-xl border-2 transition-all`}>
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-black text-orange-300">{item.time}</p>
                          <p className="text-white font-bold mt-1">{item.event}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap ${statusBadge}`}>
                          {status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function SurveyForm({ onSubmit, isLoading }) {
  const [responses, setResponses] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: ''
  });

  const survey = [
    { id: 'q1', q: '¿Cómo estuvo el juego?', opt: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'] },
    { id: 'q2', q: 'Comida', opt: ['Mala', 'Regular', 'Buena', 'Excelente'] },
    { id: 'q3', q: 'Ambiente', opt: ['Frío', 'Normal', 'Bueno', 'Épico'] },
    { id: 'q4', q: '¿Volvería el próximo año?', opt: ['No', 'Quizá', 'Claro'] },
    { id: 'q5', q: 'Lo mejor fue...', opt: ['El juego', 'La comida', 'El ambiente', 'Todo'] },
  ];

  return (
    <div className="space-y-4">
      {survey.map((item, idx) => (
        <div key={item.id} className="space-y-2">
          <p className="text-sm font-black text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #D91E63, #4169E1)', fontFamily: 'Arial, sans-serif'}}>{idx+1}. {item.q}</p>
          <div className="flex flex-wrap gap-2">
            {item.opt.map(o => (
              <button key={o} onClick={() => setResponses({...responses, [item.id]: o})}
                className={`px-3 py-2 rounded-lg text-xs font-black transition-all border-2 ${responses[item.id] === o ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-pink-400 text-white shadow-lg shadow-pink-500/30' : 'border-slate-500 text-slate-300 bg-slate-700 hover:border-pink-500/70 hover:bg-slate-600'}`} style={{fontFamily: 'Arial, sans-serif'}}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => onSubmit(responses)} disabled={isLoading} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black py-3 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/30" style={{fontFamily: 'Arial, sans-serif'}}>{isLoading ? 'ENVIANDO...' : 'ENVIAR ENCUESTA'}</button>
    </div>
  );
}
