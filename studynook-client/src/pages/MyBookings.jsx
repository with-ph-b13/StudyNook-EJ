import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkCheck, Calendar, Clock, DollarSign, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

// Helper to convert "HH:MM" to total minutes
const toMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation States
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/bookings/mine');
      if (response.data?.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      toast.error('Could not load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'StudyNook – My Bookings';
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelTrigger = (bookingId) => {
    setSelectedBookingId(bookingId);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBookingId) return;
    try {
      const response = await api.patch(`/bookings/${selectedBookingId}/cancel`);
      if (response.data?.success) {
        toast.success('Booking cancelled successfully');
        // Update booking status in local state
        setBookings((prev) =>
          prev.map((b) => (b._id === selectedBookingId ? { ...b, status: 'cancelled' } : b))
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setSelectedBookingId(null);
    }
  };

  // Check if a booking is in the future and can be cancelled
  const canCancel = (booking) => {
    if (booking.status !== 'confirmed') return false;

    const todayStr = new Date().toISOString().split('T')[0];
    if (booking.date > todayStr) return true;

    if (booking.date === todayStr) {
      const nowMins = toMinutes(new Date().toTimeString().slice(0, 5));
      const startMins = toMinutes(booking.startTime);
      return startMins > nowMins; // Can cancel if slot hasn't started yet
    }

    return false; // Past date
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans pb-24">
      {/* Header Banner */}
      <section className="bg-slate-100 dark:bg-slate-950 py-12 border-b border-slate-200/40 dark:border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-2">
          <h1 className="text-3xl font-extrabold font-display text-slate-800 dark:text-white flex items-center justify-center sm:justify-start space-x-2">
            <BookmarkCheck className="w-8 h-8 text-indigo-500" />
            <span>My Bookings</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor reservation history, check schedules, or cancel upcoming study slots.
          </p>
        </div>
      </section>

      {/* Bookings List/Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 text-slate-800 dark:text-slate-100">
            <p className="text-slate-500 dark:text-slate-400">You have no bookings yet.</p>
            <Link
              to="/rooms"
              className="mt-4 inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-bold"
            >
              <span>Explore quiet rooms</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="glass-panel overflow-hidden rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-100">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 dark:bg-slate-950/40 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4.5">Room</th>
                    <th className="px-6 py-4.5">Floor</th>
                    <th className="px-6 py-4.5">Schedule</th>
                    <th className="px-6 py-4.5">Total Cost</th>
                    <th className="px-6 py-4.5">Status</th>
                    <th className="px-6 py-4.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm font-medium">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 flex items-center space-x-3.5">
                        <img
                          src={booking.roomId?.imageUrl}
                          alt={booking.roomId?.name}
                          className="w-12 h-10 rounded-lg object-cover"
                        />
                        <Link
                          to={`/rooms/${booking.roomId?._id}`}
                          className="font-bold hover:text-indigo-600 transition-colors line-clamp-1"
                        >
                          {booking.roomId?.name || 'Deleted Room'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {booking.roomId?.floor || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{booking.date}</span>
                          </span>
                          <span className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-500" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-350">
                        ${booking.totalCost}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450'
                              : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-455'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {canCancel(booking) ? (
                          <button
                            onClick={() => handleCancelTrigger(booking._id)}
                            className="px-4 py-1.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 hover:bg-rose-100/70 font-bold text-xs transition-all hover:scale-105 active:scale-95"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-normal">No actions</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.map((booking) => (
                <div key={booking._id} className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={booking.roomId?.imageUrl}
                      alt={booking.roomId?.name}
                      className="w-16 h-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/rooms/${booking.roomId?._id}`}
                        className="font-bold text-slate-800 dark:text-white hover:text-indigo-600 transition-colors block truncate"
                      >
                        {booking.roomId?.name || 'Deleted Room'}
                      </Link>
                      <span className="text-xs text-slate-400">{booking.roomId?.floor}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Date & Time</p>
                      <p className="text-slate-700 dark:text-slate-350">{booking.date}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Pricing</p>
                      <p className="text-slate-700 dark:text-slate-350 font-bold">${booking.totalCost}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-850">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                      }`}
                    >
                      {booking.status}
                    </span>

                    {canCancel(booking) && (
                      <button
                        onClick={() => handleCancelTrigger(booking._id)}
                        className="px-4 py-1.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 hover:bg-rose-100/70 font-bold text-xs transition-all"
                      >
                        Cancel Slot
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Study Booking?"
        message="Are you sure you want to cancel this booking slot? This action will free up the study room for other students."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelModalOpen(false)}
        isDangerous={true}
      />
    </div>
  );
};

export default MyBookings;
