import { motion } from 'motion/react';
import { MessageCircle, Trophy, CheckSquare, Users, User, Leaf } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type Section = 'chat' | 'ranking' | 'tasks' | 'friends' | 'profile';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

export function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  const menuItems = [
    { id: 'chat' as Section, icon: MessageCircle, label: 'Chat', emoji: '💬' },
    { id: 'ranking' as Section, icon: Trophy, label: 'Ranking', emoji: '🏆' },
    { id: 'tasks' as Section, icon: CheckSquare, label: 'Tarefas', emoji: '✓' },
    { id: 'friends' as Section, icon: Users, label: 'Amigos', emoji: '👥' },
    { id: 'profile' as Section, icon: User, label: 'Perfil', emoji: '👤' }
  ];

  return (
    <div className="w-20 lg:w-72 h-screen bg-white dark:bg-gray-800 shadow-xl flex flex-col border-r border-green-200 dark:border-gray-700">
      {/* Logo */}
      <div className="p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-green-200 dark:border-gray-700">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Leaf className="text-green-600 dark:text-green-400" size={32} />
        </motion.div>
        <span className="hidden lg:block text-green-800 dark:text-green-300">
          EcoChat
        </span>
      </div>

      {/* Menu items */}
      <TooltipProvider>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full p-3 lg:p-4 rounded-xl flex items-center gap-3 transition-all
                      ${isActive 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                        : 'hover:bg-green-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={24} />
                    <span className="hidden lg:block">{item.label}</span>
                    <span className="lg:hidden">{item.emoji}</span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right" className="lg:hidden">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>

      {/* Footer */}
      <div className="p-4 border-t border-green-200 dark:border-gray-700">
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 hidden lg:block">
          Juntos por um planeta melhor 🌍
        </div>
        <div className="lg:hidden text-center">
          🌍
        </div>
      </div>
    </div>
  );
}
