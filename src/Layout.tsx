import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { logOut } from './firebase';
import { BookOpen, Trophy, User, LogOut, Info, Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function Layout() {
  const { user, userData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Hub', path: '/dashboard', icon: BookOpen },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Badges', path: '/badges', icon: Award },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-main text-white">
      <header className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-md border-b border-border-glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center font-bold text-gray-900 shadow-md">
                B
              </div>
              <span className="font-bold text-xl tracking-tight">B_LEARNING</span>
            </Link>

            {user && (
              <nav className="hidden md:flex space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                        isActive ? 'text-bronze' : 'text-white hover:text-gold'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute bottom-0 h-0.5 w-full bg-bronze"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}

            <div className="flex items-center space-x-4">
              {userData && (
                <div className="hidden sm:flex items-center space-x-2 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20">
                  <span className="text-xs font-bold text-bronze uppercase tracking-wider">XP</span>
                  <span className="text-sm font-bold text-white">{userData.xp}</span>
                </div>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="p-2 text-white hover:text-bronze transition-colors rounded-full hover:bg-bg-glass"
                  title="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  to="/"
                  className="bg-gold hover:bg-gold/90 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-glass border-t border-border-glass pb-safe">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                    isActive ? 'text-bronze' : 'text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
