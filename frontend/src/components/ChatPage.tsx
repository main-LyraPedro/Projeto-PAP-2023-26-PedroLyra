import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { FeedSection } from './FeedSection';
import { RankingSection } from './RankingSection';
import { TasksSection } from './TasksSection';
import { FriendsSection } from './FriendsSection';
import { ProfileSection } from './ProfileSection';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatPageProps {
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  userId: number; // 🔥 RECEBE O ID DO USUÁRIO DO APP.TSX
}

type Section = 'chat' | 'feed' | 'ranking' | 'tasks' | 'friends' | 'profile';

export function ChatPage({ onLogout, isDarkMode, toggleTheme, userId }: ChatPageProps) {
  const [activeSection, setActiveSection] = useState<Section>('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderSection = () => {
  switch (activeSection) {
    case 'chat':
      return <ChatArea />;
    case 'feed':
      return <FeedSection userId={userId} />;
    case 'ranking':
  return <RankingSection userId={userId} />;
    case 'tasks':
      return <TasksSection userId={userId} />;
    case 'friends':
      return <FriendsSection userId={userId} />;
    case 'profile':
      return <ProfileSection onLogout={onLogout} userId={userId} />;
    default:
      return <ChatArea />;
  }
};

  return (
    <div className="min-h-screen flex">
      {/* Botão de menu mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Botão de tema */}
      <motion.button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isDarkMode ? (
          <Sun className="text-yellow-500" size={24} />
        ) : (
          <Moon className="text-indigo-600" size={24} />
        )}
      </motion.button>

      {/* Sidebar para desktop */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen z-20">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>

      {/* Espaçador invisível — reserva o espaço da sidebar no layout flex */}
      <div className="hidden lg:block w-20 lg:w-72 flex-shrink-0" />

      {/* Sidebar mobile com overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 20 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-40"
            >
              <Sidebar 
                activeSection={activeSection} 
                setActiveSection={(section) => {
                  setActiveSection(section);
                  setIsMobileMenuOpen(false);
                }} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
      <div className="flex-1 p-4 lg:p-8 min-h-screen overflow-x-hidden">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
}