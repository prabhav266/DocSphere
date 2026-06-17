import React from 'react';
import { Bell, Search, User, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 w-64 lg:w-96">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full placeholder:text-slate-500"
            onKeyDown={(e) => e.key === 'Enter' && navigate('/dashboard/search')}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative text-slate-600 dark:text-slate-400">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div
          onClick={() => navigate("/dashboard/settings")}
          className="pl-4 border-l border-slate-200 dark:border-slate-800 ml-2 cursor-pointer"
        >
          <div className="w-10 h-10 overflow-hidden rounded-full cursor-pointer hover:scale-105 transition">
            {user?.profile_image ? (
              <img
                src={`http://localhost:5000${user.profile_image}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-sm">
                {getInitials(user?.name || user?.email)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
