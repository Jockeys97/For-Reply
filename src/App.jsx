import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { useDataStore } from './store/useDataStore.js';
import { authService } from './services/auth.js';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Clients = lazy(() => import('./pages/Clients.jsx'));
const ClientDetail = lazy(() => import('./pages/ClientDetail.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Tickets = lazy(() => import('./pages/Tickets.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));

// Protected Route Component
function ProtectedRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const darkModeEnabled = useDataStore((s) => s.darkModeEnabled);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  
  useEffect(() => {
    const root = document.documentElement;
    if (darkModeEnabled) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkModeEnabled]);
  
  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(authService.isAuthenticated());
    checkAuth();
    
    // Listen for storage changes (logout from another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Caricamento…</div>}>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/*" element={
            <ProtectedRoute>
              <Navbar onLogout={() => setIsAuthenticated(false)} />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/:id" element={<ClientDetail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}


