import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDataStore } from '../store/useDataStore.js';

export default function Navbar() {
  const darkModeEnabled = useDataStore((s) => s.darkModeEnabled);
  const toggleDarkMode = useDataStore((s) => s.toggleDarkMode);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="font-semibold tracking-wide">Consulting Dashboard</div>
          <div className="hidden sm:flex items-center gap-1">
            <NavLink to="/" className={linkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/clients" className={linkClass}>
              Clienti
            </NavLink>
            <NavLink to="/projects" className={linkClass}>
              Progetti
            </NavLink>
            <NavLink to="/tickets" className={linkClass}>
              Ticket
            </NavLink>
          </div>
        </div>
        <button
          aria-label="Toggle dark mode"
          className="px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={toggleDarkMode}
        >
          {darkModeEnabled ? 'Light' : 'Dark'}
        </button>
      </nav>
    </header>
  );
}


