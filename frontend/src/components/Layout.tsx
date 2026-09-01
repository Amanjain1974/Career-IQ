import { Outlet, Link } from 'react-router-dom';
import { HomeIcon, UserIcon, BriefcaseIcon, DocumentTextIcon, ChartBarIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">CareerIQ</h1>
        </div>
        <nav className="p-4 space-y-1">
          <Link to="/" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400">
            <HomeIcon className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/profile" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400">
            <UserIcon className="w-5 h-5 mr-3" />
            Profile
          </Link>
          <Link to="/jobs" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400">
            <BriefcaseIcon className="w-5 h-5 mr-3" />
            Jobs
          </Link>
          <Link to="/applications" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400">
            <DocumentTextIcon className="w-5 h-5 mr-3" />
            Applications
          </Link>
          <Link to="/analytics" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400">
            <ChartBarIcon className="w-5 h-5 mr-3" />
            Analytics
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-8 transition-colors">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
              U
            </div>
          </div>
        </header>
        <div className="p-8 dark:text-gray-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
