import { motion } from 'motion/react';
import { MessageCircle, Trophy, CheckSquare, Users, User, Leaf, Newspaper, LogOut } from 'lucide-react';

type Section = 'chat' | 'feed' | 'ranking' | 'tasks' | 'friends' | 'profile';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  onLogout?: () => void;
  userName?: string;
}

const MENU = [
  { id: 'feed' as Section,    icon: Newspaper,     label: 'Feed',     emoji: '🌍' },
  { id: 'chat' as Section,    icon: MessageCircle, label: 'EcoBot',   emoji: '🤖' },
  { id: 'ranking' as Section, icon: Trophy,        label: 'Ranking',  emoji: '🏆' },
  { id: 'tasks' as Section,   icon: CheckSquare,   label: 'Missões',  emoji: '✓'  },
  { id: 'friends' as Section, icon: Users,         label: 'Amigos',   emoji: '👥' },
  { id: 'profile' as Section, icon: User,          label: 'Perfil',   emoji: '👤' },
];

const S = {
  sidebar: {
    width: 260,
    background: 'linear-gradient(180deg,#081a0f 0%,#050f08 100%)',
    borderRight: '1px solid rgba(16,185,129,0.12)',
    display: 'flex', flexDirection: 'column' as const,
    height: '100vh',
    fontFamily: '"Inter","Segoe UI",system-ui,sans-serif',
  },
  logo: {
    padding: '24px 20px 20px',
    display: 'flex', alignItems: 'center', gap: 12,
    borderBottom: '1px solid rgba(16,185,129,0.1)',
  },
  logoIcon: {
    background: 'linear-gradient(135deg,#10b981,#059669)',
    borderRadius: 10, padding: 8, display: 'flex',
    boxShadow: '0 0 16px rgba(16,185,129,0.4)',
  },
  logoText: { fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '-0.03em' },
  nav: { flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column' as const, gap: 4 },
  itemActive: {
    background: 'rgba(16,185,129,0.15)',
    border: '1px solid rgba(16,185,129,0.3)',
    boxShadow: '0 0 20px rgba(16,185,129,0.12)',
  },
  itemInactive: { background: 'transparent', border: '1px solid transparent' },
  footer: {
    padding: '12px 12px 20px',
    borderTop: '1px solid rgba(16,185,129,0.1)',
  },
};

export function Sidebar({ activeSection, setActiveSection, onLogout, userName }: SidebarProps) {
  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'EC';

  return (
    <div style={S.sidebar}>
      {/* Logo */}
      <div style={S.logo}>
        <div style={S.logoIcon}><Leaf size={18} color="white" /></div>
        <span style={S.logoText}>EcoChat</span>
      </div>

      {/* Nav */}
      <nav style={S.nav}>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.2em', padding: '8px 12px 4px', fontWeight: 600 }}>
          Navegação
        </p>
        {MENU.map(item => {
          const Icon = item.icon;
          const active = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ x: active ? 0 : 3 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', borderRadius: 12, cursor: 'pointer',
                transition: 'all 0.2s ease',
                ...(active ? S.itemActive : S.itemInactive),
              }}
            >
              <div style={{ color: active ? '#10b981' : 'rgba(255,255,255,0.45)', display: 'flex', transition: 'color 0.2s' }}>
                <Icon size={19} />
              </div>
              <span style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }}>
                {item.label}
              </span>
              {active && (
                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* User mini-profile */}
      <div style={S.footer}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '12px 14px', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName || 'Utilizador'}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Guardião Verde 🌿</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ v: '🔥 5', l: 'streak' }, { v: '⭐ 120', l: 'pts' }].map(s => (
              <div key={s.l} style={{ flex: 1, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 8, padding: '5px 8px', textAlign: 'center' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{s.v}</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        {onLogout && (
          <motion.button onClick={onLogout} whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.35)' }}>
            <LogOut size={15} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>Terminar Sessão</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
