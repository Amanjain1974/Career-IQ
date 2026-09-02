import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, BriefcaseIcon, DocumentTextIcon, ChartBarIcon, MoonIcon, SunIcon, CogIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { getMe } from '../api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getMe().then(data => setUser(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Jobs', path: '/jobs', icon: BriefcaseIcon },
    { name: 'Applications', path: '/applications', icon: DocumentTextIcon },
    { name: 'Analytics', path: '/analytics', icon: ChartBarIcon },
  ];

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-colors duration-200">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md shadow-indigo-500/20">
              <BriefcaseIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">CareerIQ</h1>
          </div>
          <nav className="p-4 space-y-1.5 mt-2">
            {navItems.map((item) => (
              <NavLink 
                key={item.name}
                to={item.path} 
                className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <NavLink 
            to="/settings" 
            className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 mb-4 ${isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <CogIcon className="w-5 h-5 mr-3 flex-shrink-0" />
            Settings
          </NavLink>
          
          <div className="flex items-center px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            {user ? (
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} 
                alt="avatar" 
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shadow-sm border border-indigo-200 dark:border-indigo-800/50">
                U
              </div>
            )}
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user ? user.username : 'Guest'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user ? user.email : 'Not logged in'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10 transition-colors duration-200">
          <div className="flex-1 max-w-xl">
            <form action="/search" method="get" className="relative group">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                name="q"
                placeholder="Search jobs, companies, notes... (⌘K)" 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm"
              />
            </form>
          </div>
          <div className="flex items-center space-x-4 pl-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

