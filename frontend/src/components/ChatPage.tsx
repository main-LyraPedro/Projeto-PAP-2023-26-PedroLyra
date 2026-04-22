import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { FeedSection } from './FeedSection';
import { RankingSection } from './RankingSection';
import { TasksSection } from './TasksSection';
import { FriendsSection } from './FriendsSection';
import { ProfileSection } from './ProfileSection';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatPageProps {
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  userId: number;
}

type Section = 'chat' | 'feed' | 'ranking' | 'tasks' | 'friends' | 'profile';

export function ChatPage({ onLogout, isDarkMode, toggleTheme, userId }: ChatPageProps) {
  const [activeSection, setActiveSection] = useState<Section>('feed');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('user_name') || localStorage.getItem('user_email') || '';
    setUserName(name);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'chat':    return <ChatArea />;
      case 'feed':    return <FeedSection userId={userId} />;
      case 'ranking': return <RankingSection userId={userId} />;
      case 'tasks':   return <TasksSection userId={userId} />;
      case 'friends': return <FriendsSection userId={userId} />;
      case 'profile': return <ProfileSection onLogout={onLogout} userId={userId} />;
      default:        return <FeedSection userId={userId} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg,#040f07 0%,#060d08 50%,#050f07 100%)', fontFamily: '"Inter","Segoe UI",system-ui,sans-serif' }}>

      {/* Mobile menu button */}
      <button onClick={() => setIsMobileMenuOpen(o => !o)}
        style={{ position: 'fixed', top: 14, left: 14, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: '#fff' }}
        className="lg:hidden">
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:block" style={{ flexShrink: 0 }}>
        <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 20 }}>
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} userName={userName} />
        </div>
      </div>

      {/* Desktop sidebar spacer */}
      <div className="hidden lg:block" style={{ width: 260, flexShrink: 0 }} />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 30 }}
              onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 22 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 40 }} className="lg:hidden">
              <Sidebar activeSection={activeSection} setActiveSection={s => { setActiveSection(s); setIsMobileMenuOpen(false); }} onLogout={onLogout} userName={userName} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, padding: '28px 28px 0', minHeight: '100vh', overflowX: 'hidden' }}>
        <motion.div key={activeSection} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
}