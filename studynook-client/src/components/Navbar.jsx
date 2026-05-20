import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Menu, X, ChevronDown, LogOut, Library, BookmarkCheck, PlusCircle, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-semibold'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-800/50'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-semibold'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-800/50'
    }`;

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/40 dark:border-slate-800/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
              <div className="p-2 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-xl shadow-lg shadow-indigo-600/20 text-white">
                <Library className="w-5 h-5" />
              </div>
              <span className="text-xl font-black font-display tracking-tight text-slate-800 dark:text-white">
                Study<span className="text-indigo-600 dark:text-indigo-400">Nook</span>
              </span>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-2">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/rooms" className={navLinkClass}>
                Rooms
              </NavLink>
              
              {user && (
                <>
                  <NavLink to="/add-room" className={navLinkClass}>
                    Add Room
                  </NavLink>
                  <NavLink to="/my-listings" className={navLinkClass}>
                    My Listings
                  </NavLink>
                  <NavLink to="/my-bookings" className={navLinkClass}>
                    My Bookings
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Right utilities & dropdowns */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <img
                    src={user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="text-left leading-none hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                    <span className="text-[10px] text-slate-400">Member</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl glass-panel border border-slate-200/60 dark:border-slate-800/60 shadow-xl py-2 z-50 text-slate-700 dark:text-slate-200 animate-in fade-in slide-in-from-top-2 duration-250">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/50">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors"
                    >
                      <BookmarkCheck className="w-4 h-4" />
                      <span>My Bookings</span>
                    </Link>
                    <Link
                      to="/my-listings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>My Listings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors border-t border-slate-100 dark:border-slate-800/50 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-800/50"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200/40 dark:border-slate-800/40 py-3 px-4 space-y-1 shadow-inner animate-in slide-in-from-top duration-300">
          <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/rooms" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
            Rooms
          </NavLink>

          {user ? (
            <>
              <NavLink to="/add-room" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                Add Room
              </NavLink>
              <NavLink to="/my-listings" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                My Listings
              </NavLink>
              <NavLink to="/my-bookings" className={mobileNavLinkClass} onClick={() => setIsOpen(false)}>
                My Bookings
              </NavLink>
              <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2 px-4 flex items-center space-x-3">
                <img
                  src={user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-2 px-4 py-2.5 text-base font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 mt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/10"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
