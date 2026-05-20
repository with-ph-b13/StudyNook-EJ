import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import { Search, SlidersHorizontal, Users, RefreshCw, XCircle } from 'lucide-react';

const AMENITIES_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState('');
  const [maxRate, setMaxRate] = useState('');

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedFloor) params.append('floor', selectedFloor);
      if (maxRate) params.append('maxRate', maxRate);
      if (selectedAmenities.length > 0) {
        params.append('amenities', selectedAmenities.join(','));
      }

      const response = await api.get(`/rooms?${params.toString()}`);
      if (response.data?.success) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedAmenities, selectedFloor, maxRate]);

  useEffect(() => {
    document.title = 'StudyNook – Available Rooms';
    fetchRooms();
  }, [fetchRooms]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedAmenities([]);
    setSelectedFloor('');
    setMaxRate('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pb-24">
      {/* Header Banner */}
      <section className="bg-slate-100 dark:bg-slate-950 py-12 border-b border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-800 dark:text-white">
            Available Study Rooms
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse and reserve custom nooks equipped for maximum focus and seamless study.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-6 text-slate-800 dark:text-slate-100">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center space-x-2 font-bold font-display">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Search input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Search Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by room name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Floor Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Library Floor</label>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="">All Floors</option>
                  <option value="Floor 1">Floor 1</option>
                  <option value="Floor 2">Floor 2</option>
                  <option value="Floor 3">Floor 3</option>
                  <option value="Floor 4">Floor 4</option>
                  <option value="Floor 5">Floor 5</option>
                </select>
              </div>

              {/* Rate Range filter */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Rate</label>
                  {maxRate && <span className="text-xs font-bold text-indigo-500">${maxRate}/hr</span>}
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={maxRate || 50}
                  onChange={(e) => setMaxRate(e.target.value === '50' ? '' : e.target.value)}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>$0/hr</span>
                  <span>$50+/hr</span>
                </div>
              </div>

              {/* Amenities Checkboxes */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Amenities</label>
                <div className="space-y-2">
                  {AMENITIES_OPTIONS.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2.5 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-800 text-indigo-600 focus:ring-indigo-500/50"
                      />
                      <span className="text-slate-600 dark:text-slate-300 font-sans">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Rooms Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="py-24">
                <Spinner size="large" />
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-slate-950 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 text-center text-slate-800 dark:text-slate-100">
                <XCircle className="w-14 h-14 text-rose-500 animate-bounce mb-4" />
                <h3 className="text-xl font-bold font-display">No study rooms found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                  We couldn't find any rooms matching your search options. Try relaxing your filters or resetting parameters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-8"
              >
                {rooms.map((room) => (
                  <motion.div
                    key={room._id}
                    variants={cardVariants}
                    className="glass-card rounded-2xl overflow-hidden flex flex-col h-full"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={room.imageUrl}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold shadow-lg">
                        {room.floor}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex flex-col flex-1 space-y-4 text-slate-800 dark:text-slate-100">
                      <div>
                        <h3 className="text-lg font-bold font-display line-clamp-1">{room.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">Listed by {room.owner?.name || 'Owner'}</p>
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

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 text-[9px] font-bold uppercase tracking-wider"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[9px] font-bold">
                            +{room.amenities.length - 3}
                          </span>
                        )}
                      </div>

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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
