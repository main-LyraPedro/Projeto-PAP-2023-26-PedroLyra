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
import { theme } from '../theme';

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
  const T = theme(isDarkMode);

  useEffect(() => {
    const name = localStorage.getItem('user_name') || localStorage.getItem('user_email') || '';
    setUserName(name);
  }, []);

  // Close mobile menu on section change
  const handleSetSection = (s: Section) => {
    setActiveSection(s);
    setIsMobileMenuOpen(false);
  };

  const renderSection = () => {
    const commonProps = { isDarkMode, toggleTheme };
    switch (activeSection) {
      case 'chat':    return <ChatArea />;
      case 'feed':    return <FeedSection userId={userId} {...commonProps} />;
      case 'ranking': return <RankingSection userId={userId} />;
      case 'tasks':   return <TasksSection userId={userId} />;
      case 'friends': return <FriendsSection userId={userId} />;
      case 'profile': return <ProfileSection onLogout={onLogout} userId={userId} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      default:        return <FeedSection userId={userId} {...commonProps} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, transition: 'background 0.3s', fontFamily: '"Inter","Segoe UI",system-ui,sans-serif' }}>

      {/* Mobile hamburger */}
      <button
        onClick={() => setIsMobileMenuOpen(o => !o)}
        className="lg:hidden"
        style={{ position: 'fixed', top: 14, left: 14, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: T.bgCard, border: `1px solid ${T.border}`, cursor: 'pointer', color: T.text, boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar — fixed */}
      <div className="hidden lg:block" style={{ flexShrink: 0, width: 260 }}>
        <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 20 }}>
          <Sidebar
            activeSection={activeSection}
            setActiveSection={handleSetSection}
            onLogout={onLogout}
            userName={userName}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
          />
        </div>
      </div>

      {/* Mobile sidebar + overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 40, backdropFilter: 'blur(4px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 24, stiffness: 200 }}
              style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 50 }}
              className="lg:hidden">
              <Sidebar
                activeSection={activeSection}
                setActiveSection={handleSetSection}
                onLogout={onLogout}
                userName={userName}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div style={{ flex: 1, padding: '28px 24px', minHeight: '100vh', overflowX: 'hidden', transition: 'background 0.3s' }}>
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}>
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
}