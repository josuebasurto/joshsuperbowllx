import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Beer, Trophy, Utensils, BarChart3, Settings, UserCircle, ChevronRight, Info, Clock, Calendar, Lock, CheckCircle2 } from 'lucide-react';

// --- CONFIGURACIÓN DE SUPABASE ---
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Reemplaza con tu URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Reemplaza con tu key
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Google Fonts para el estilo NFL
const FontLink = () => (
  <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
);

export default function App() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(localStorage.getItem('basurto_name') || '');
  const [favTeam, setFavTeam] = useState(localStorage.getItem('basurto_team') || '');
  const [view, setView] = useState('onboarding_name');
  const [globalStats, setGlobalStats] = useState({ cheves: 0, participants: 7 });
  const [orders, setOrders] = useState([]);
  const [allQuinielas, setAllQuinielas] = useState([]);
  const [myQuiniela, setMyQuiniela] = useState(null);
  const [now, setNow] = useState(new Date());

  const [formQuiniela, setFormQuiniela] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: '', q11: '', q12: '', q13: '', q14: '', q15: ''
  });

  // Agenda de Eventos (Domingo 8 Feb 2026)
  const agenda = [
    { id: 1, name: 'Pre-Game & Botanas', time: new Date('2026-02-08T15:30:00') },
    { id: 2, name: 'Himno Nacional', time: new Date('2026-02-08T16:15:00') },
    { id: 3, name: 'KICKOFF', time: new Date('2026-02-08T16:30:00') },
    { id: 4, name: 'Halftime Show', time: new Date('2026-02-08T18:30:00') },
    { id: 5, name: 'Trofeo Lombardi', time: new Date('2026-02-08T20:15:00') },
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

  // 1. Auth Init - Supabase Anonymous Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (data?.user) {
          setUser(data.user);
          setUserId(data.user.id);
        }
        if (error) console.error(error);
      } catch (err) {
        console.error(err);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (userName && favTeam) setView('dashboard');
    else if (userName) setView('onboarding_team');
  }, []);

  // 2. Real-time Listeners - Supabase Subscriptions
  useEffect(() => {
    if (!userId) return;

    // Escuchar cambios en stats
    const statsSubscription = supabase
      .from('stats')
      .on('*', (payload) => {
        if (payload.new) {
          setGlobalStats({ cheves: payload.new.cheves, participants: payload.new.participants });
        }
      })
      .subscribe();

    // Escuchar cambios en orders
    const ordersSubscription = supabase
      .from('orders')
      .on('*', (payload) => {
        // Refetch all orders
        fetchOrders();
      })
      .subscribe();

    // Escuchar cambios en quinielas
    const quinielasSubscription = supabase
      .from('quinielas')
      .on('*', (payload) => {
        // Refetch all quinielas
        fetchQuinielas();
      })
      .subscribe();

    // Fetch inicial
    fetchStats();
    fetchOrders();
    fetchQuinielas();

    return () => {
      supabase.removeSubscription(statsSubscription);
      supabase.removeSubscription(ordersSubscription);
      supabase.removeSubscription(quinielasSubscription);
    };
  }, [userId]);

  const fetchStats = async () => {
    const { data, error } = await supabase.from('stats').select('*').limit(1);
    if (data && data.length > 0) {
      setGlobalStats({ cheves: data[0].cheves, participants: data[0].participants });
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('timestamp', { ascending: false });
    if (data) setOrders(data);
  };

  const fetchQuinielas = async () => {
    const { data, error } = await supabase.from('quinielas').select('*');
    if (data) {
      setAllQuinielas(data);
      const myQ = data.find(q => q.uid === userId);
      if (myQ) setMyQuiniela(myQ);
    }
  };

  // Colores dinámicos
  const teamColor = favTeam === 'Seahawks' ? 'bg-[#69BE28]' : favTeam === 'Patriots' ? 'bg-[#C60C30]' : 'bg-amber-500';
  const teamText = favTeam === 'Seahawks' ? 'text-[#69BE28]' : favTeam === 'Patriots' ? 'text-[#C60C30]' : 'text-amber-500';

  const handleRegisterName = (name) => {
    if (!name.trim()) return;
    setUserName(name);
    localStorage.setItem('basurto_name', name);
    setView('onboarding_team');
  };

  const handleSelectTeam = async (team) => {
    setFavTeam(team);
    localStorage.setItem('basurto_team', team);
    
    if (userId) {
      // Insertar usuario en la tabla users
      const { error } = await supabase.from('users').upsert({
        uid: userId,
        name: userName,
        team: team,
        lastActive: new Date().toISOString()
      });
      if (error) console.error(error);
    }
    setView('dashboard');
  };

  const addCheve = async () => {
    // Incrementar el contador de cheves
    const { data: currentStats, error: fetchError } = await supabase
      .from('stats')
      .select('cheves')
      .limit(1)
      .single();

    if (currentStats) {
      const { error } = await supabase
        .from('stats')
        .update({ cheves: currentStats.cheves + 1 })
        .eq('id', currentStats.id);
      
      if (error) console.error(error);
    }
  };

  // --- VISTAS ---

  if (view === 'onboarding_name') return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <FontLink />
      <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-amber-500/20 animate-bounce">
        <Trophy size={48} className="text-slate-900" />
      </div>
      <h1 className="text-5xl font-black mb-2 italic tracking-tighter" style={{ fontFamily: 'Permanent Marker' }}>CASA BASURTO</h1>
      <p className="text-slate-400 mb-8 uppercase text-xs tracking-[0.4em] font-bold">The Hub</p>
      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full max-w-sm">
        <p className="text-xs font-black text-slate-500 mb-4 uppercase tracking-widest">Identifícate, Coach</p>
        <input 
          id="nameIn" type="text" placeholder="Tu nombre..."
          className="w-full bg-slate-800 p-4 rounded-xl mb-4 outline-none border border-slate-700 focus:border-amber-500 transition-all font-bold"
          onKeyDown={(e) => e.key === 'Enter' && handleRegisterName(e.target.value)}
        />
        <button onClick={() => handleRegisterName(document.getElementById('nameIn').value)}
          className="w-full bg-amber-500 text-slate-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 uppercase italic tracking-tighter shadow-lg shadow-amber-500/20">
          Entrar al campo <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  if (view === 'onboarding_team') return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center font-sans">
      <FontLink />
      <h2 className="text-4xl font-black mb-2 text-center italic" style={{ fontFamily: 'Permanent Marker' }}>ELIGE TU BANDO</h2>
      <p className="text-slate-400 mb-8 text-center text-sm font-bold uppercase tracking-widest">La casa se divide hoy</p>
      
      <div className="grid gap-4 w-full max-w-sm">
        <button onClick={() => handleSelectTeam('Seahawks')} 
          className="bg-slate-900 border-4 border-slate-800 p-6 rounded-3xl flex items-center gap-4 hover:border-[#69BE28] transition-all text-left">
          <div className="w-12 h-12 bg-[#002244] border-2 border-[#69BE28] rounded-full flex items-center justify-center font-black text-[#69BE28]">SEA</div>
          <div>
            <h4 className="font-black uppercase italic text-lg">Seahawks</h4>
            <p className="text-[10px] text-[#69BE28] font-bold tracking-widest uppercase">Action Green Mode</p>
          </div>
        </button>

        <button onClick={() => handleSelectTeam('Patriots')} 
          className="bg-slate-900 border-4 border-slate-800 p-6 rounded-3xl flex items-center gap-4 hover:border-[#C60C30] transition-all text-left">
          <div className="w-12 h-12 bg-[#002244] border-2 border-[#C60C30] rounded-full flex items-center justify-center font-black text-[#C60C30]">NE</div>
          <div>
            <h4 className="font-black uppercase italic text-lg">Patriots</h4>
            <p className="text-[10px] text-[#C60C30] font-bold tracking-widest uppercase">Dynasty Mode</p>
          </div>
        </button>
      </div>
    </div>
  );

  const nextEv = getNextEvent();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28">
      <FontLink />
      {/* Header Dinámico */}
      <header className={`p-6 ${teamColor} text-slate-900 border-b-4 border-slate-900 flex justify-between items-center sticky top-0 z-50 shadow-xl`}>
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter leading-none" style={{ fontFamily: 'Permanent Marker' }}>CASA BASURTO</h1>
          <p className="text-[10px] font-black uppercase tracking-tighter opacity-80">{userName} • {favTeam} Fan</p>
        </div>
        <button onClick={() => setView('agenda')} className="bg-slate-900/20 p-2 rounded-xl flex flex-col items-end group active:scale-95 transition-all">
          <span className="text-[8px] font-black uppercase opacity-60">Próximo:</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-black uppercase italic">{nextEv.name}</span>
            <Clock size={12} />
          </div>
        </button>
      </header>

      <main className="p-4 max-w-xl mx-auto space-y-6">
        
        {view === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl border-2 border-slate-800 relative overflow-hidden shadow-2xl">
                <Beer className={`absolute -right-4 -bottom-4 w-24 h-24 ${teamText} opacity-10`} />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Cheve-Meter</p>
                <h3 className="text-5xl font-black italic" style={{ fontFamily: 'Permanent Marker' }}>{globalStats.cheves}</h3>
                <button onClick={addCheve} className={`${teamColor} text-slate-900 mt-4 w-full py-2 rounded-xl text-xs font-black uppercase italic tracking-tighter shadow-lg shadow-black/20`}>+ Sumar Fría</button>
              </div>
              
              <div className="bg-slate-900 p-6 rounded-3xl border-2 border-slate-800 flex flex-col justify-center items-center text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Kickoff local</p>
                <h3 className="text-3xl font-black italic text-amber-500" style={{ fontFamily: 'Permanent Marker' }}>4:30 PM</h3>
                <p className="text-[8px] text-slate-500 uppercase font-bold mt-2">Culiacán • Levi's Stadium</p>
              </div>
            </div>

            <div className="grid gap-4">
              <button onClick={() => setView('quiniela')} className={`p-6 rounded-3xl flex items-center justify-between group border-b-8 border-black/40 ${myQuiniela ? 'bg-slate-800 opacity-80' : 'bg-emerald-500'}`}>
                <div className="text-left text-slate-900">
                  <h4 className="font-black text-2xl italic uppercase" style={{ fontFamily: 'Permanent Marker' }}>{myQuiniela ? 'VER RESULTADOS' : 'LA QUINIELA PRO'}</h4>
                  <p className="text-[10px] font-black uppercase opacity-80">{myQuiniela ? 'Elecciones bloqueadas' : '15 preguntas de gloria'}</p>
                </div>
                {myQuiniela ? <Lock size={32} className="text-slate-600" /> : <Trophy size={32} className="text-slate-900" />}
              </button>
              
              <button onClick={() => setView('burger_order')} className="bg-slate-900 p-6 rounded-3xl border-2 border-slate-800 flex items-center justify-between border-b-8 border-black/40 group active:translate-y-1 transition-all">
                <div className="text-left">
                  <h4 className="font-black text-2xl italic uppercase text-amber-500" style={{ fontFamily: 'Permanent Marker' }}>ORDENAR BURGER</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Envía tu jugada a la cocina</p>
                </div>
                <Utensils size={32} className="text-slate-700 group-hover:text-amber-500 transition-colors" />
              </button>
            </div>
          </>
        )}

        {view === 'agenda' && (
          <div className="bg-slate-900 p-6 rounded-3xl border-2 border-slate-800 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-black italic uppercase text-amber-500" style={{ fontFamily: 'Permanent Marker' }}>Agenda del Juego</h2>
              <button onClick={() => setView('dashboard')} className="text-xs font-black uppercase tracking-widest text-slate-500 underline">Cerrar</button>
            </div>
            <div className="space-y-4">
              {agenda.map(item => {
                const status = getStatus(item.time);
                return (
                  <div key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${status === 'current' ? `${teamColor} text-slate-900 scale-105 shadow-xl` : status === 'passed' ? 'bg-slate-950 border-slate-800 opacity-40' : 'bg-slate-800 border-slate-700'}`}>
                    <div className="text-center min-w-[60px]">
                      <p className="text-[10px] font-black uppercase leading-none">{item.time.getHours()}:{item.time.getMinutes().toString().padStart(2, '0')}</p>
                      <p className="text-[8px] font-bold uppercase opacity-60">PM</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black italic uppercase tracking-tighter text-sm">{item.name}</h4>
                      {status === 'current' && <p className="text-[10px] font-black uppercase italic animate-pulse">¡Sucediendo ahora!</p>}
                    </div>
                    {status === 'passed' && <CheckCircle2 size={16} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === 'quiniela' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="bg-slate-900 p-6 rounded-3xl border-2 border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black italic uppercase text-emerald-500" style={{ fontFamily: 'Permanent Marker' }}>
                  {myQuiniela ? 'TABLA DE POSICIONES' : 'TU QUINIELA'}
                </h2>
                <button onClick={() => setView('dashboard')} className="text-xs font-black text-slate-500 underline">VOLVER</button>
              </div>

              {!myQuiniela ? (
                <div className="space-y-6">
                  <p className="text-[10px] bg-emerald-500/10 text-emerald-500 p-3 rounded-xl border border-emerald-500/20 font-bold uppercase text-center tracking-widest">
                    ⚠️ Al guardar no podrás editar. ¡Elige con sabiduría!
                  </p>
                  {[
                    {id:'q1', q: '¿Ganador del Volado?', opt:['SEA', 'NE']},
                    {id:'q2', q: '¿Primer Touchdown?', opt:['Pase', 'Carrera']},
                    {id:'q3', q: 'Color Gatorade Final', opt:['Naranja', 'Azul', 'Rojo']},
                    {id:'q15', q: 'GANADOR SUPER BOWL', opt:['SEAHAWKS', 'PATRIOTS']},
                  ].map((item, idx) => (
                    <div key={item.id} className="space-y-2">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{idx+1}. {item.q}</p>
                      <div className="flex gap-2">
                        {item.opt.map(o => (
                          <button key={o} onClick={() => setFormQuiniela({...formQuiniela, [item.id]: o})} 
                            className={`flex-1 py-3 rounded-xl text-xs font-black italic transition-all border-2 ${formQuiniela[item.id] === o ? 'bg-emerald-500 border-emerald-400 text-slate-900 scale-95' : 'border-slate-800 text-slate-500 hover:border-emerald-500/30'}`}>
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={async () => {
                    if (!userId) return;
                    const { error } = await supabase.from('quinielas').insert({
                      uid: userId,
                      name: userName,
                      team: favTeam,
                      ...formQuiniela
                    });
                    if (error) console.error(error);
                    else await fetchQuinielas();
                  }} className="w-full bg-emerald-500 text-slate-900 font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 text-xl italic uppercase" style={{ fontFamily: 'Permanent Marker' }}>BLOQUEAR Y ENVIAR</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Otras jugadas en la mesa:</h4>
                  <div className="grid gap-2">
                    {allQuinielas.map(q => (
                      <div key={q.id} className="bg-slate-800 p-4 rounded-2xl border-2 border-slate-700 flex justify-between items-center">
                        <div>
                          <p className="font-black text-sm uppercase italic">{q.name}</p>
                          <p className={`text-[8px] font-black uppercase ${q.team === 'Seahawks' ? 'text-[#69BE28]' : 'text-[#C60C30]'}`}>{q.team} FAN</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400">GANA:</p>
                          <p className="text-xs font-black text-emerald-500 uppercase italic">{q.q15}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'burger_order' && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.target);
            const toppings = f.getAll('toppings');
            
            const { error } = await supabase.from('orders').insert({
              uid: userId,
              name: userName,
              bread: f.get('bread'),
              doneness: f.get('doneness'),
              toppings: toppings,
              timestamp: new Date().toISOString()
            });

            if (error) console.error(error);
            else {
              await fetchOrders();
              setView('dashboard');
            }
          }} className="bg-slate-900 p-6 rounded-3xl border-2 border-slate-800 space-y-6 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black italic uppercase text-amber-500" style={{ fontFamily: 'Permanent Marker' }}>Jugada de Cocina</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Selección de Pan</label>
                <select name="bread" className="w-full bg-slate-800 p-4 rounded-2xl border-2 border-slate-700 outline-none font-bold text-sm">
                  <option>Brioche Estándar</option>
                  <option>Ajonjolí Coach</option>
                  <option>Wrap de Lechuga</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Término de la Carne</label>
                <select name="doneness" className="w-full bg-slate-800 p-4 rounded-2xl border-2 border-slate-700 outline-none font-bold text-sm">
                  <option>Término Medio</option>
                  <option>Poco Hecho</option>
                  <option>Bien Hecho</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-amber-500 text-slate-900 font-black py-5 rounded-2xl shadow-xl shadow-amber-500/20 text-xl italic uppercase" style={{ fontFamily: 'Permanent Marker' }}>Mandar Pedido</button>
              <button type="button" onClick={() => setView('dashboard')} className="w-full text-slate-500 font-bold text-xs uppercase tracking-widest">Mejor no, sigo botaneando</button>
            </div>
          </form>
        )}

      </main>

      {/* Footer Dinámico */}
      <nav className={`fixed bottom-6 left-6 right-6 ${teamColor} border-4 border-slate-950 rounded-[40px] p-2 flex justify-around items-center shadow-2xl z-40`}>
        <button onClick={() => setView('dashboard')} className={`p-4 rounded-full transition-all ${view === 'dashboard' ? 'bg-slate-950 text-white scale-110 shadow-lg' : 'text-slate-900'}`}><BarChart3 size={28}/></button>
        <button onClick={() => setView('agenda')} className={`p-4 rounded-full transition-all ${view === 'agenda' ? 'bg-slate-950 text-white scale-110 shadow-lg' : 'text-slate-900'}`}><Calendar size={28}/></button>
        <button onClick={() => setView('quiniela')} className={`p-4 rounded-full transition-all ${view === 'quiniela' ? 'bg-slate-950 text-white scale-110 shadow-lg' : 'text-slate-900'}`}><Trophy size={28}/></button>
      </nav>
    </div>
  );
}
