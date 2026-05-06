import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Send, X, Leaf, Image, Trophy, Zap, Flame } from 'lucide-react';
import { toast } from 'sonner';
import { theme } from '../theme';

interface Post {
  id: number; descricao: string; categoria: string;
  imagem_url: string | null; criada_em: string;
  usuario: { id: number; nome: string };
  likes: number; comentarios: number; user_liked: boolean;
}
interface Comentario { id: number; texto: string; criada_em: string; usuario: { id: number; nome: string }; }
interface FeedSectionProps { userId: number; isDarkMode: boolean; toggleTheme?: () => void; }

const CATS = [
  { id: 'geral', label: 'Geral', emoji: '🌍' },
  { id: 'reciclagem', label: 'Reciclagem', emoji: '♻️' },
  { id: 'agua', label: 'Água', emoji: '💧' },
  { id: 'energia', label: 'Energia', emoji: '⚡' },
  { id: 'transporte', label: 'Transporte', emoji: '🚴' },
  { id: 'alimentacao', label: 'Alimentação', emoji: '🥗' },
];

const CAT_COLOR: Record<string, string> = {
  geral: '#10b981', reciclagem: '#06b6d4', agua: '#3b82f6',
  energia: '#f59e0b', transporte: '#8b5cf6', alimentacao: '#ec4899',
};

function ago(s: string) {
  const d = Math.floor((Date.now() - new Date(s).getTime()) / 1000);
  if (d < 60) return 'agora mesmo';
  if (d < 3600) return `há ${Math.floor(d / 60)}min`;
  if (d < 86400) return `há ${Math.floor(d / 3600)}h`;
  return `há ${Math.floor(d / 86400)}d`;
}
function initials(name: string) { return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(); }

function PostCard({ post, userId, onLike, isDarkMode }: { post: Post; userId: number; onLike: (id: number) => void; isDarkMode: boolean }) {
  const T = theme(isDarkMode);
  const [showC, setShowC] = useState(false);
  const [coms, setComs] = useState<Comentario[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [liked, setLiked] = useState(post.user_liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const cat = CATS.find(c => c.id === post.categoria) || CATS[0];
  const color = CAT_COLOR[post.categoria] || '#10b981';

  const loadComs = async () => {
    setLoading(true);
    try { const r = await fetch(`http://localhost:5000/api/posts/${post.id}/comments`); if (r.ok) setComs(await r.json()); }
    finally { setLoading(false); }
  };

  const sendCom = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      const r = await fetch(`http://localhost:5000/api/posts/${post.id}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, texto: text }),
      });
      const d = await r.json();
      if (r.ok) { setComs(p => [...p, d.comentario]); setText(''); }
    } finally { setSending(false); }
  };

  const doLike = () => { setLiked(l => !l); setLikeCount(n => liked ? n - 1 : n + 1); onLike(post.id); };

  return (
    <motion.div
      style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, overflow: 'hidden', transition: 'all 0.3s' }}
      whileHover={{ y: -3, boxShadow: isDarkMode ? '0 16px 48px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 12px' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${color},${color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
          {initials(post.usuario.nome)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{post.usuario.nome}</p>
          <p style={{ fontSize: 11, color: T.textMuted }}>{ago(post.criada_em)}</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: `${color}18`, border: `1px solid ${color}35`, color }}>
          {cat.emoji} {cat.label}
        </span>
      </div>

      {post.imagem_url && (
        <div style={{ overflow: 'hidden', maxHeight: 300 }}>
          <img src={`http://localhost:5000${post.imagem_url}`} alt="" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      <div style={{ padding: '14px 20px 12px' }}>
        <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.6 }}>{post.descricao}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 20px 14px', borderTop: `1px solid ${T.border}` }}>
        <motion.button onClick={doLike} whileTap={{ scale: 1.3 }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: liked ? 'rgba(239,68,68,0.1)' : T.bgCardHover, color: liked ? '#ef4444' : T.textMuted, transition: 'all 0.2s' }}>
          <Heart size={16} style={{ fill: liked ? '#ef4444' : 'none' }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{likeCount}</span>
        </motion.button>
        <button onClick={() => { if (!showC) loadComs(); setShowC(s => !s); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: showC ? T.accentSub : T.bgCardHover, color: showC ? T.accent : T.textMuted, transition: 'all 0.2s' }}>
          <MessageCircle size={16} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{post.comentarios}</span>
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 10, background: T.accentSub, border: `1px solid ${T.accentBorder}` }}>
          <Leaf size={12} style={{ color: T.accent }} />
          <span style={{ fontSize: 11, color: T.accent, fontWeight: 700 }}>+5 pts</span>
        </div>
      </div>

      <AnimatePresence>
        {showC && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ borderTop: `1px solid ${T.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: 12 }}>
                  <div style={{ width: 20, height: 20, border: `2px solid ${T.accentBorder}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                </div>
              ) : coms.length === 0 ? (
                <p style={{ fontSize: 13, color: T.textMuted, textAlign: 'center', padding: '8px 0' }}>Sê o primeiro a comentar!</p>
              ) : coms.map(c => (
                <div key={c.id} style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {c.usuario.nome[0].toUpperCase()}
                  </div>
                  <div style={{ background: T.bgCardHover, border: `1px solid ${T.border}`, borderRadius: 10, padding: '8px 12px', flex: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.text, marginRight: 8 }}>{c.usuario.nome}</span>
                    <span style={{ fontSize: 13, color: T.textSub }}>{c.texto}</span>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendCom()}
                  placeholder="Adicionar comentário..."
                  style={{ flex: 1, padding: '9px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: T.bgInput, color: T.text, fontSize: 13, outline: 'none' }} />
                <button onClick={sendCom} disabled={sending || !text.trim()}
                  style={{ padding: '9px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', cursor: 'pointer', opacity: sending || !text.trim() ? 0.5 : 1 }}>
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RightPanel({ isDarkMode }: { isDarkMode: boolean }) {
  const T = theme(isDarkMode);
  const tips = ['Usa sacos reutilizáveis nas compras.', 'Reduz o consumo de carne 2x/semana.', 'Fecha a torneira ao escovar os dentes.'];
  const tip = tips[new Date().getDay() % tips.length];
  const top5 = [
    { name: 'Ana Silva', pts: 980, emoji: '🥇' }, { name: 'João Costa', pts: 860, emoji: '🥈' },
    { name: 'Maria Lopes', pts: 720, emoji: '🥉' }, { name: 'Rui Santos', pts: 610, emoji: '4️⃣' },
    { name: 'Sofia Neves', pts: 540, emoji: '5️⃣' },
  ];
  const block = { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: '18px 20px', marginBottom: 14 };

  return (
    <div style={{ width: 280, flexShrink: 0 }}>
      <div style={block}>
        <p style={{ fontSize: 10, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 10 }}>Missão do Dia</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: T.accentSub, border: `1px solid ${T.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>♻️</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Recicla 3 itens hoje</p>
            <p style={{ fontSize: 11, color: T.textMuted }}>+30 pontos</p>
          </div>
        </div>
        <div style={{ marginTop: 12, height: 5, background: T.border, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '33%', background: 'linear-gradient(90deg,#10b981,#34d399)', borderRadius: 10 }} />
        </div>
        <p style={{ fontSize: 10, color: T.textMuted, marginTop: 5 }}>1 de 3 completo</p>
      </div>

      <div style={{ ...block, display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Flame size={22} style={{ color: '#f97316', margin: '0 auto 6px' }} />
          <p style={{ fontSize: 22, fontWeight: 900, color: T.text }}>5</p>
          <p style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Streak</p>
        </div>
        <div style={{ width: 1, background: T.border }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <Zap size={22} style={{ color: T.accent, margin: '0 auto 6px' }} />
          <p style={{ fontSize: 22, fontWeight: 900, color: T.text }}>120</p>
          <p style={{ fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pontos</p>
        </div>
      </div>

      <div style={block}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Trophy size={15} style={{ color: '#f59e0b' }} />
          <p style={{ fontSize: 10, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>Top Comunidade</p>
        </div>
        {top5.map((u, i) => (
          <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < 4 ? `1px solid ${T.border}` : 'none' }}>
            <span style={{ fontSize: 14 }}>{u.emoji}</span>
            <p style={{ flex: 1, fontSize: 13, fontWeight: 600, color: i === 0 ? '#fbbf24' : T.textSub, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>{u.pts}</p>
          </div>
        ))}
      </div>

      <div style={{ ...block, background: T.accentSub, border: `1px solid ${T.accentBorder}` }}>
        <p style={{ fontSize: 10, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700, marginBottom: 8 }}>💡 Dica do Dia</p>
        <p style={{ fontSize: 13, color: T.textSub, lineHeight: 1.5 }}>{tip}</p>
      </div>
    </div>
  );
}

export function FeedSection({ userId, isDarkMode }: FeedSectionProps) {
  const T = theme(isDarkMode);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('geral');
  const [img, setImg] = useState<File | null>(null);
  const [imgPrev, setImgPrev] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFeed = async () => {
    try {
      const r = await fetch(`http://localhost:5000/api/feed/${userId}`);
      if (r.ok) setPosts(await r.json());
    } catch { toast.error('Erro ao carregar feed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadFeed(); }, [userId]);

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setImg(f); const r = new FileReader(); r.onloadend = () => setImgPrev(r.result as string); r.readAsDataURL(f); }
  };

  const publish = async () => {
    if (!desc.trim()) { toast.error('Escreve uma descrição!'); return; }
    setPosting(true);
    try {
      const fd = new FormData();
      fd.append('user_id', String(userId)); fd.append('descricao', desc); fd.append('categoria', cat);
      if (img) fd.append('imagem', img);
      const r = await fetch('http://localhost:5000/api/posts', { method: 'POST', body: fd });
      const d = await r.json();
      if (r.ok) { toast.success('Publicação criada! +5 pontos 🌱'); setPosts(p => [d.post, ...p]); setDesc(''); setCat('geral'); setImg(null); setImgPrev(null); }
      else toast.error(d.erro || 'Erro ao criar publicação');
    } catch { toast.error('Erro de ligação'); } finally { setPosting(false); }
  };

  const doLike = async (id: number) => {
    try {
      const r = await fetch(`http://localhost:5000/api/posts/${id}/like`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const d = await r.json();
      if (r.ok) setPosts(p => p.map(x => x.id === id ? { ...x, likes: d.likes, user_liked: d.acao === 'adicionado' } : x));
    } catch { /* silent */ }
  };

  const filtered = filtro === 'todos' ? posts : posts.filter(p => p.categoria === filtro);

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', paddingBottom: 40 }}>
      <div style={{ flex: 1, minWidth: 0, maxWidth: 640 }}>
        {/* Create post */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 18, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>EC</div>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="O que fizeste hoje pelo planeta? 🌱"
              style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: `1px solid ${T.border}`, background: T.bgInput, color: T.text, fontSize: 14, outline: 'none', resize: 'none', transition: 'border 0.2s' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {CATS.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)}
                style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${cat === c.id ? CAT_COLOR[c.id] : T.border}`, background: cat === c.id ? `${CAT_COLOR[c.id]}18` : 'transparent', color: cat === c.id ? CAT_COLOR[c.id] : T.textMuted, transition: 'all 0.2s' }}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          {imgPrev && (
            <div style={{ position: 'relative', marginBottom: 14 }}>
              <img src={imgPrev} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 10 }} />
              <button onClick={() => { setImg(null); setImgPrev(null); }}
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                <X size={14} />
              </button>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => fileRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: `1px solid ${T.border}`, background: 'transparent', color: T.textMuted, fontSize: 13, cursor: 'pointer' }}>
              <Image size={15} /> Foto
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
            <motion.button onClick={publish} disabled={posting || !desc.trim()} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ marginLeft: 'auto', padding: '9px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: posting || !desc.trim() ? 0.55 : 1, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
              <Leaf size={15} />{posting ? 'A publicar…' : 'Publicar'}
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {[{ id: 'todos', label: '🌍 Todos' }, ...CATS.map(c => ({ id: c.id, label: `${c.emoji} ${c.label}` }))].map(f => (
            <button key={f.id} onClick={() => setFiltro(f.id)}
              style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${filtro === f.id ? T.accent : T.border}`, background: filtro === f.id ? T.accentSub : 'transparent', color: filtro === f.id ? T.accent : T.textMuted, transition: 'all 0.2s' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${T.accentBorder}`, borderTopColor: T.accent, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: T.bgCard, borderRadius: 18, border: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🌱</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>Nenhuma publicação ainda</p>
            <p style={{ fontSize: 14, color: T.textMuted }}>Sê o primeiro a partilhar!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <PostCard post={post} userId={userId} onLike={doLike} isDarkMode={isDarkMode} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden xl:block">
        <RightPanel isDarkMode={isDarkMode} />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
