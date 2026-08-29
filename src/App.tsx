import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ActivationPage } from './pages/ActivationPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentDashboard } from './pages/StudentDashboard';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPath === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }

  if (currentPath === '/forgot-password') {
    return <ForgotPasswordPage onNavigate={navigate} />;
  }

  if (currentPath === '/activate') {
    return <ActivationPage onNavigate={navigate} />;
  }

  if (currentPath === '/admin') {
    return <AdminDashboard onNavigate={navigate} />;
  }

  if (currentPath === '/teacher') {
    return <TeacherDashboard onNavigate={navigate} />;
  }

  if (currentPath === '/student') {
    return <StudentDashboard onNavigate={navigate} />;
  }

  return <LandingPage onNavigate={navigate} />;
}

export default App;
