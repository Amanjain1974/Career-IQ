import { Outlet, Link } from 'react-router-dom';
import { HomeIcon, UserIcon, BriefcaseIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-indigo-600">CareerIQ</h1>
        </div>
        <nav className="p-4 space-y-1">
          <Link to="/" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">
            <HomeIcon className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/profile" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">
            <UserIcon className="w-5 h-5 mr-3" />
            Profile
          </Link>
          <Link to="/jobs" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">
            <BriefcaseIcon className="w-5 h-5 mr-3" />
            Jobs
          </Link>
          <Link to="/applications" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">
            <DocumentTextIcon className="w-5 h-5 mr-3" />
            Applications
          </Link>
          <Link to="/analytics" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">
            <ChartBarIcon className="w-5 h-5 mr-3" />
            Analytics
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              U
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
