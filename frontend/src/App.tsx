import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { ChatPage } from './components/ChatPage';
import { LandingPage } from './components/LandingPage';
import { Toaster } from './components/ui/sonner';

type Page = 'landing' | 'login' | 'app';

const THEME_KEY = 'ecochat_theme';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(d => !d);

  const handleLogin = (userData: { user_id: number; email: string }) => {
    setUserId(userData.user_id);
    setPage('app');
  };

  const handleLogout = () => {
    setPage('landing');
    setUserId(null);
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {page === 'landing' && (
        <LandingPage
          onEnter={() => setPage('login')}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      )}
      {page === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      )}
      {page === 'app' && (
        <ChatPage
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          userId={userId!}
        />
      )}
      <Toaster />
    </div>
  );
}