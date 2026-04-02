import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { ChatPage } from './components/ChatPage';
import { LandingPage } from './components/LandingPage';
import { Toaster } from './components/ui/sonner';

type Page = 'landing' | 'login' | 'app';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const handleLogin = (userData: { user_id: number; email: string }) => {
    setUserId(userData.user_id);
    setPage('app');
  };

  const handleLogout = () => {
    setPage('landing');
    setUserId(null);
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-green-950 dark:to-gray-900 transition-colors duration-500">
        {page === 'landing' && (
          <LandingPage
            onEnter={() => setPage('login')}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
        )}
        {page === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
        )}
        {page === 'app' && (
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