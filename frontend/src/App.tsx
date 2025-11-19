import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { ChatPage } from './components/ChatPage';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // 🔥 Função chamada após login bem-sucedido
  // Recebe o userData do LoginPage com { user_id, email }
  const handleLogin = (userData: { user_id: number; email: string }) => {
    setUserId(userData.user_id);
    setIsLoggedIn(true);
    console.log('✅ Usuário logado:', userData);
  };

  // 🔥 Função de logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    console.log('👋 Usuário deslogado');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-950 dark:to-gray-900 transition-colors duration-500">
        {!isLoggedIn ? (
          <LoginPage 
            onLogin={handleLogin}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
        ) : (
          <ChatPage 
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
            userId={userId!}
          />
        )}
        <Toaster />
      </div>
    </div>
  );
}