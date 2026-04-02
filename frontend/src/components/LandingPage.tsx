import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, ArrowRight, Leaf } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

/* ─── Cycling words (Runway style) ────────────────────── */
const WORDS = ['recicla', 'poupa', 'inspira', 'conecta', 'impacta'];

function CyclingWord({ dark }: { dark: boolean }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % WORDS.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={idx}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35 }}
        style={{
          background: dark
            ? 'linear-gradient(135deg,#34d399,#10b981,#06b6d4)'
            : 'linear-gradient(135deg,#059669,#10b981,#0284c7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
        }}
      >
        {WORDS[idx]}
      </motion.span>
    </AnimatePresence>
  );
}

/* ─── Animated counter ─────────────────────────────────── */
function Counter({ n, label, dark }: { n: number; label: string; dark: boolean }) {
  const [c, setC] = useState(0);
  useEffect(() => {
    let v = 0;
    const inc = n / 60;
    const t = setInterval(() => {
      v += inc;
      if (v >= n) { setC(n); clearInterval(t); }
      else setC(Math.floor(v));
    }, 30);
    return () => clearInterval(t);
  }, [n]);
  const num = dark ? 'text-white' : 'text-gray-900';
  const lbl = dark ? 'text-white/40' : 'text-gray-400';
  return (
    <div>
      <p className={`text-4xl font-black tabular-nums ${num}`}>{c.toLocaleString('pt-PT')}+</p>
      <p className={`text-xs uppercase tracking-widest mt-1 ${lbl}`}>{label}</p>
    </div>
  );
}

/* ─── Feature row (alternating, Perplexity style) ──────── */
type Feat = { n: string; emoji: string; title: string; desc: string; bullets: string[] };
const FEATS: Feat[] = [
  {
    n: '01', emoji: '📸', title: 'Feed Ecológico',
    desc: 'Uma rede social focada em ações reais. Publica fotos, recebe likes e inspira a tua comunidade a fazer mais pelo planeta.',
    bullets: ['Posts com foto e descrição', 'Likes e comentários', 'Filtro por categoria'],
  },
  {
    n: '02', emoji: '🤖', title: 'EcoBot — IA integrada',
    desc: 'Um assistente conversacional especializado em sustentabilidade. Perguntas diretas, respostas claras e dicas acionáveis.',
    bullets: ['Respostas em tempo real', 'Dados sobre clima, água e energia', 'Sempre disponível'],
  },
  {
    n: '03', emoji: '🏆', title: 'Missões & Ranking',
    desc: 'Gamificação que funciona. Completa desafios diários, acumula pontos e sobe no ranking global da plataforma.',
    bullets: ['Missões diárias, semanais e mensais', 'Ranking entre amigos', 'Sistema de níveis'],
  },
];

export function LandingPage({ onEnter, isDarkMode, toggleTheme }: LandingPageProps) {
  const [stats, setStats] = useState({ usuarios: 5, publicacoes: 12, likes: 48, tarefas: 30 });
  const dark = isDarkMode;

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/stats').then(r => r.json())
      .then(d => setStats({ usuarios: Math.max(d.usuarios, 5), publicacoes: Math.max(d.publicacoes, 12), likes: Math.max(d.likes, 48), tarefas: Math.max(d.tarefas_completas, 30) }))
      .catch(() => {});
  }, []);

  /* theme tokens */
  const T = {
    bg: dark ? '#080c0a' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
    text: dark ? '#ffffff' : '#0a0a0a',
    sub: dark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    card: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
    sep: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    accent: dark ? '#10b981' : '#059669',
    accentSub: dark ? 'rgba(16,185,129,0.12)' : 'rgba(5,150,105,0.08)',
    accentBorder: dark ? 'rgba(16,185,129,0.3)' : 'rgba(5,150,105,0.25)',
    navBg: dark ? 'rgba(8,12,10,0.85)' : 'rgba(255,255,255,0.85)',
  };

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif' }} className="min-h-screen">

      {/* ── NAV ── */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ background: T.navBg, borderBottom: `1px solid ${T.border}`, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf size={18} color={T.accent} />
            <span style={{ color: T.text, letterSpacing: '-0.02em' }} className="font-bold text-base">EcoChat</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} style={{ color: T.sub, background: T.card, border: `1px solid ${T.border}` }}
              className="p-2 rounded-lg transition-all hover:opacity-80">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={onEnter}
              style={{ background: T.accentSub, border: `1px solid ${T.accentBorder}`, color: T.accent }}
              className="px-4 py-1.5 text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-all hover:opacity-80">
              Entrar <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="max-w-4xl mx-auto px-6 pt-40 pb-32 text-center">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-10">
          <span style={{ background: T.accentSub, border: `1px solid ${T.accentBorder}`, color: T.accent }}
            className="text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
            🌍 PAP 2023–2026 · Pedro Lyra
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ letterSpacing: '-0.035em', lineHeight: 1.0 }}
          className="text-6xl sm:text-7xl md:text-8xl font-black mb-8"
        >
          O planeta pediu
          <br />
          uma rede social.
          <br />
          Tu{' '}
          <span className="inline-block" style={{ minWidth: '6.5ch', textAlign: 'left' }}>
            <CyclingWord dark={dark} />.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ color: T.sub, letterSpacing: '-0.01em' }}
          className="text-xl md:text-2xl max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Partilha ações sustentáveis, completa missões ecológicas e constrói um impacto real — junto à tua comunidade.
        </motion.p>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 rounded-xl font-bold text-base text-white flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 26px rgba(16,185,129,0.35)' }}
          >
            Começar gratuitamente <ArrowRight size={18} />
          </motion.button>
          <button onClick={onEnter}
            style={{ color: T.sub, border: `1px solid ${T.border}`, background: T.card }}
            className="px-8 py-3.5 rounded-xl font-medium text-base transition-all hover:opacity-70">
            Já tenho conta
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-20 flex flex-col items-center gap-2">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 1, height: 48, background: `linear-gradient(to bottom, transparent, ${T.accent})` }} />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ borderTop: `1px solid ${T.sep}`, borderBottom: `1px solid ${T.sep}` }}
        className="py-16"
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          <Counter n={stats.usuarios} label="utilizadores" dark={dark} />
          <Counter n={stats.publicacoes} label="publicações" dark={dark} />
          <Counter n={stats.likes} label="likes dados" dark={dark} />
          <Counter n={stats.tarefas} label="missões feitas" dark={dark} />
        </div>
      </motion.section>

      {/* ── FEATURES ── */}
      <section className="max-w-4xl mx-auto px-6 py-28">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-20">
          <p style={{ color: T.sub }} className="text-xs uppercase tracking-[0.2em] mb-4">Funcionalidades</p>
          <h2 style={{ letterSpacing: '-0.03em' }} className="text-4xl md:text-5xl font-black leading-tight max-w-lg">
            Tudo o que precisas.<br />Nada do que não precisas.
          </h2>
        </motion.div>

        <div className="space-y-0">
          {FEATS.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ backgroundColor: dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}
              style={{ borderTop: `1px solid ${T.sep}` }}
              className="py-12 grid md:grid-cols-[80px_1fr_1fr] gap-8 rounded-xl px-4 transition-colors duration-200 cursor-default"
            >
              {/* Number */}
              <div style={{ color: T.accent }} className="text-sm font-bold uppercase tracking-widest pt-1">{f.n}</div>
              {/* Left */}
              <div>
                <p className="text-3xl mb-3">{f.emoji}</p>
                <h3 style={{ letterSpacing: '-0.02em', color: T.text }} className="text-2xl font-black mb-3">{f.title}</h3>
                <p style={{ color: T.sub }} className="text-base leading-relaxed">{f.desc}</p>
              </div>
              {/* Right — bullets */}
              <div className="flex flex-col gap-3 pt-1">
                {f.bullets.map(b => (
                  <div key={b} className="flex items-start gap-2.5">
                    <span style={{ color: T.accent, marginTop: 3 }}>✓</span>
                    <span style={{ color: T.sub }} className="text-sm">{b}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          <div style={{ borderTop: `1px solid ${T.sep}` }} />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="max-w-4xl mx-auto px-6 pb-32 text-center"
      >
        <div style={{ border: `1px solid ${T.border}`, background: T.card, borderRadius: 24 }} className="py-20 px-8">
          <p style={{ color: T.accent }} className="text-xs uppercase tracking-[0.2em] mb-6">Junta-te à comunidade</p>
          <h2
            style={{ letterSpacing: '-0.03em' }}
            className="text-5xl md:text-6xl font-black mb-6 max-w-xl mx-auto leading-tight"
          >
            O teu próximo hábito começa aqui.
          </h2>
          <p style={{ color: T.sub }} className="text-lg mb-10 max-w-md mx-auto">
            Gratuito, simples e com impacto real. Regista-te e começa hoje.
          </p>
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-xl font-bold text-lg text-white inline-flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}
          >
            Entrar na comunidade <ArrowRight size={20} />
          </motion.button>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${T.sep}` }} className="text-center py-8">
        <p style={{ color: T.sub }} className="text-xs tracking-wide">
          EcoChat · Projeto Académico PAP 2023–2026 · Pedro Lyra
        </p>
      </footer>

    </div>
  );
}
