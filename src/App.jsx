import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { useDataStore } from './store/useDataStore.js';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Clients = lazy(() => import('./pages/Clients.jsx'));
const ClientDetail = lazy(() => import('./pages/ClientDetail.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const Tickets = lazy(() => import('./pages/Tickets.jsx'));

export default function App() {
  const darkModeEnabled = useDataStore((s) => s.darkModeEnabled);
  useEffect(() => {
    const root = document.documentElement;
    if (darkModeEnabled) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkModeEnabled]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense fallback={<div className="text-sm text-gray-500">Caricamento…</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}


