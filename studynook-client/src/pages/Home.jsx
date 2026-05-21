import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { Search, Compass, BookOpen, Layers, Users, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

const Home = () => {
  const [latestRooms, setLatestRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'StudyNook – Home';
    const fetchLatestRooms = async () => {
      try {
        const response = await api.get('/rooms/latest');
        if (response.data?.success) {
          setLatestRooms(response.data.rooms);
        }
      } catch (error) {
        console.error('Error loading latest rooms:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestRooms();
  }, []);

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full filter blur-3xl animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-300 text-sm font-semibold mb-2">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>Find Your Next Study Spot</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-none">
              Find Your Perfect <br />
              <span className="text-gradient">Study Room</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-light leading-relaxed">
              Browse and book quiet, private study rooms in your library. List your own room and earn. Zero friction, total focus.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                to="/rooms"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 text-base"
              >
                <span>Explore Rooms</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Available Study Rooms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-800 dark:text-white">
            Available Study Rooms
          </h2>
          <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full" />
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Discover our newest spaces designed for deep study sessions, group project works, and video conferences.
          </p>
        </div>

        {loading ? (
          <div className="py-20">
            <Spinner size="large" />
          </div>
        ) : latestRooms.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 p-8">
            <p className="text-slate-500 dark:text-slate-400">No rooms listed yet. Be the first to add one!</p>
            <Link
              to="/add-room"
              className="mt-4 inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-bold"
            >
              <span>Add a study room</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {latestRooms.map((room) => (
              <motion.div key={room._id} variants={itemVariants} className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
                {/* Room Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold shadow-lg">
                    {room.floor}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold font-display text-slate-800 dark:text-white line-clamp-1">
                      {room.name}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span>Capacity: {room.capacity} people</span>
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">
                      ${room.hourlyRate}/hr
                    </div>
                  </div>

                  {/* Amenities Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 text-[10px] font-bold tracking-wide uppercase"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/rooms/${room._id}`}
                    className="mt-auto w-full text-center py-3 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:hover:bg-indigo-600 dark:text-slate-200 transition-all font-bold text-sm hover:scale-[1.02] active:scale-[0.98]"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Extra Static Section 1: How It Works */}
      <section id="how-it-works" className="bg-white dark:bg-slate-950 py-20 transition-colors border-y border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-800 dark:text-white">
              How It Works
            </h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full" />
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Find, book, and access premium library study zones in three extremely quick steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center space-y-4 glass-card rounded-2xl hover:scale-100 hover:shadow-md border border-slate-100 dark:border-slate-800/50">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">1. Browse Rooms</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                Filter study rooms by capacity, amenities, hourly rates, and library floors. Check out exact interior images.
              </p>
            </div>

            <div className="p-6 text-center space-y-4 glass-card rounded-2xl hover:scale-100 hover:shadow-md border border-slate-100 dark:border-slate-800/50">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">2. Book Instantly</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                Select your calendar date and hours. Our robust time-conflict detector blocks double bookings immediately.
              </p>
            </div>

            <div className="p-6 text-center space-y-4 glass-card rounded-2xl hover:scale-100 hover:shadow-md border border-slate-100 dark:border-slate-800/50">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">3. Focus & Study</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                Check in to your custom quiet nook. Hook up to professional whiteboard setups, Wi-Fi, and complete AV assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Static Section 2: Core Advantages */}
      <section id="advantages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-800 dark:text-white leading-tight">
              Designed For High-Performance Study & Collaboration
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Why settle for distracting coffee shops or crowded open tables? StudyNook brings structured privacy, silent concentration, and premium teamwork environments directly to campus students and freelancers.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start space-x-3.5">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">
                    Secure Real-time Scheduling
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
                    Advanced time-conflict protection blocks double bookings automatically on our secure servers.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 mt-1">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 font-display">
                    Acoustically Treated Silent Spaces
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-normal">
                    Filter by quiet-zone designations and air-conditioned properties to secure a silent concentration environment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Visual Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            <div className="absolute inset-0 bg-indigo-600/5 rounded-3xl filter blur-xl" />
            <img
              src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=300&q=80"
              alt="Library interior study spot"
              className="rounded-2xl object-cover w-full h-48 sm:h-64 shadow-md sm:mt-8"
            />
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=300&q=80"
              alt="Group studying inside library nook"
              className="rounded-2xl object-cover w-full h-48 sm:h-64 shadow-md"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
