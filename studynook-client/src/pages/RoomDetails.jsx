import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, DollarSign, Users, Award, Shield, Edit3, Trash2, CalendarCheck, HelpCircle, XCircle } from 'lucide-react';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const END_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals & Delete States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Booking Form States
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [specialNote, setSpecialNote] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const fetchRoomDetails = async () => {
    try {
      const response = await api.get(`/rooms/${id}`);
      if (response.data?.success) {
        setRoom(response.data.room);
        document.title = `StudyNook – ${response.data.room.name}`;
      }
    } catch (error) {
      toast.error('Could not load room details');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const handleDeleteRoom = async () => {
    try {
      const response = await api.delete(`/rooms/${id}`);
      if (response.data?.success) {
        toast.success('Room deleted successfully');
        navigate('/my-listings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !startTime || !endTime) {
      toast.error('Please fill in all booking fields');
      return;
    }

    setBookingSubmitting(true);
    try {
      const response = await api.post('/bookings', {
        roomId: id,
        date: bookingDate,
        startTime,
        endTime,
        specialNote,
      });

      if (response.data?.success) {
        toast.success('Room booked successfully!');
        setBookingModalOpen(false);
        // Clear booking fields
        setBookingDate('');
        setStartTime('');
        setEndTime('');
        setSpecialNote('');
        // Refetch to increment local booking count
        fetchRoomDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Time slot already booked. Try another time!');
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Filter end times to only show hours after start time
  const getFilteredEndTimes = () => {
    if (!startTime) return [];
    const startIndex = TIME_SLOTS.indexOf(startTime);
    return END_TIME_SLOTS.slice(startIndex);
  };

  // Calculate live booking duration and total cost
  const getLiveCost = () => {
    if (!startTime || !endTime || !room) return 0;
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const duration = endHour - startHour;
    return duration > 0 ? duration * room.hourlyRate : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Spinner size="large" />
      </div>
    );
  }

  if (!room) return null;

  // Check if active user is the room owner
  const isOwner = user && (room.owner?._id === user._id || room.owner === user._id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pb-24">
      {/* Visual Header Image Banner */}
      <div className="relative h-96 sm:h-[450px] w-full overflow-hidden bg-slate-900">
        <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-6 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="text-white space-y-2">
              <span className="px-3 py-1.5 rounded-xl bg-indigo-600/90 text-xs font-bold uppercase tracking-wider">
                {room.floor}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight mt-2">{room.name}</h1>
              <p className="text-sm text-slate-300 font-light flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Listed by {room.owner?.name || 'Academic Library'}</span>
              </p>
            </div>
            
            {/* Rates & Booking Counts floating */}
            <div className="flex gap-4">
              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center text-white min-w-[100px]">
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Hourly Rate</p>
                <p className="text-2xl font-black font-display text-indigo-300">${room.hourlyRate}/hr</p>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center text-white min-w-[100px]">
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Booking Count</p>
                <p className="text-2xl font-black font-display text-emerald-400">{room.bookingCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details Body */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-6 text-slate-800 dark:text-slate-100">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold font-display">About this room</h2>
                <div className="h-1 w-12 bg-indigo-600 rounded-full" />
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-sans text-base whitespace-pre-line">
                  {room.description}
                </p>
              </div>

              {/* Specifications row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Seat Capacity</p>
                    <p className="text-sm font-semibold">{room.capacity} people</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Access level</p>
                    <p className="text-sm font-semibold">General Public</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Min Booking</p>
                    <p className="text-sm font-semibold">1 hour minimum</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="glass-panel p-8 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 space-y-4 text-slate-800 dark:text-slate-100">
              <h3 className="text-xl font-bold font-display">Equipped Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm font-medium hover:scale-[1.01] transition-transform"
                  >
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
                {room.amenities.length === 0 && (
                  <p className="text-sm text-slate-500 col-span-full">No extra amenities listed for this room.</p>
                )}
              </div>
            </div>
          </div>

          {/* Action sidebar */}
          <aside className="lg:col-span-1">
            <div className="glass-panel p-6 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 sticky top-20 text-slate-800 dark:text-slate-100 space-y-6">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Hourly Pricing</span>
                  <p className="text-3xl font-black font-display text-indigo-600 dark:text-indigo-400">
                    ${room.hourlyRate}<span className="text-sm font-normal text-slate-400">/hr</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Total Bookings</span>
                  <p className="text-xl font-bold text-slate-700 dark:text-slate-350">{room.bookingCount}</p>
                </div>
              </div>

              {/* Edit/Delete Actions for Owners */}
              {isOwner ? (
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/40 dark:border-indigo-900/40 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    You listed this study nook. You can edit configurations or cancel/delete listing operations.
                  </div>
                  <Link
                    to={`/edit-room/${room._id}`}
                    className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-indigo-500" />
                    <span>Edit Nook Details</span>
                  </Link>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 hover:bg-rose-100/70 font-bold text-sm transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Study Room</span>
                  </button>
                </div>
              ) : (
                /* Customer Action */
                <div className="space-y-4">
                  {user ? (
                    <button
                      onClick={() => setBookingModalOpen(true)}
                      className="w-full py-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/10 font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
                    >
                      <CalendarCheck className="w-4.5 h-4.5" />
                      <span>Book Room Now</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      state={{ from: location }}
                      className="w-full py-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/10 font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 text-center"
                    >
                      <span>Login to Book</span>
                    </Link>
                  )}
                  <p className="text-[10px] text-slate-400 text-center leading-normal">
                    Free cancellations up to start of booking slot. Double-booking detection guarantees slot integrity.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete study nook?"
        message={`Are you sure you want to permanently delete "${room.name}"? This will cancel all bookings referencing this study room.`}
        confirmText="Yes, Delete Room"
        cancelText="Cancel"
        onConfirm={handleDeleteRoom}
        onClose={() => setDeleteModalOpen(false)}
        isDangerous={true}
      />

      {/* Booking Form Modal */}
      <AnimatePresence>
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 shadow-2xl z-10 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/50 mb-6">
                <div>
                  <h3 className="text-xl font-bold font-display">Book {room.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">Configure your reservation slot</p>
                </div>
                <button
                  onClick={() => setBookingModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Date Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Booking Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                    />
                    <Calendar className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                {/* Time Slots grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start time selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Start Time</label>
                    <select
                      required
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        setEndTime('');
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                    >
                      <option value="">Select Start</option>
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* End time selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">End Time</label>
                    <select
                      required
                      disabled={!startTime}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 dark:text-white"
                    >
                      <option value="">Select End</option>
                      {getFilteredEndTimes().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Note */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Special Note (Optional)</label>
                  <textarea
                    rows="2"
                    placeholder="e.g., quiet zone, bringing digital projectors..."
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none dark:text-white"
                  />
                </div>

                {/* Real-time calculated costs display */}
                {startTime && endTime && (
                  <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/40 flex items-center justify-between text-indigo-700 dark:text-indigo-400">
                    <div className="flex items-center space-x-2.5 text-sm">
                      <DollarSign className="w-5 h-5" />
                      <div>
                        <p className="font-bold font-display">Calculated Cost</p>
                        <p className="text-[10px] text-slate-400 leading-none">
                          Hourly Rate: ${room.hourlyRate}/hr
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black font-display">${getLiveCost()}</p>
                      <p className="text-[10px] text-slate-400 leading-none">
                        Duration: {parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0])} hrs
                      </p>
                    </div>
                  </div>
                )}

                {/* Submitting button */}
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="w-full mt-6 py-4 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 font-bold text-sm transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {bookingSubmitting ? (
                    <span>Validating times...</span>
                  ) : (
                    <>
                      <CalendarCheck className="w-4.5 h-4.5" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomDetails;
