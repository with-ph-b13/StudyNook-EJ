import React from 'react';
import { Link } from 'react-router-dom';
import { Library, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200/40 dark:border-slate-800/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <Library className="w-5 h-5" />
              </div>
              <span className="text-lg font-black font-display tracking-tight text-slate-800 dark:text-white">
                Study<span className="text-indigo-600 dark:text-indigo-400">Nook</span>
              </span>
            </Link>
            <p className="text-sm font-sans leading-relaxed">
              Find and reserve premium, private study rooms in university and public libraries. Experience silent focus, collaborative tools, and simple booking.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm font-sans">
              <li>
                <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  All Rooms
                </Link>
              </li>
              <li>
                <a href="#advantages" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Why Us
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How it Works
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm font-sans">
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span className="truncate">support@studynook.com</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-indigo-500" />
                <span>+1 (555) 349-2910</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <span>Central Library, 4th Floor, Campus Square</span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-display">
              Connect With Us
            </h4>
            <p className="text-xs">Follow us for library study tips, student stories, and platform releases.</p>
            <div className="flex space-x-3.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all hover:scale-105 active:scale-95 text-slate-500 dark:text-slate-400"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all hover:scale-105 active:scale-95 text-slate-500 dark:text-slate-400"
                aria-label="X (formerly Twitter)"
              >
                {/* Official rebranded X logo SVG */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all hover:scale-105 active:scale-95 text-slate-500 dark:text-slate-400"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-900 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-all hover:scale-105 active:scale-95 text-slate-500 dark:text-slate-400"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans">
          <p>&copy; {new Date().getFullYear()} StudyNook Inc. All study rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#privacy" className="hover:text-slate-800 dark:hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-800 dark:hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
