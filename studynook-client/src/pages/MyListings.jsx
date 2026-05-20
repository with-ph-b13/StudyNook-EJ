import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Spinner from '../components/Spinner';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, LayoutGrid, Users, PlusCircle, ArrowRight } from 'lucide-react';

const MyListings = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deletion States
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchMyRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/rooms');
      if (response.data?.success) {
        // Filter rooms listed by this user
        const filtered = response.data.rooms.filter(
          (room) => room.owner?._id === user?._id || room.owner === user?._id
        );
        setRooms(filtered);
      }
    } catch (error) {
      toast.error('Could not load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'StudyNook – My Listings';
    if (user) {
      fetchMyRooms();
    }
  }, [user]);

  const handleDeleteTrigger = (roomId) => {
    setSelectedRoomId(roomId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRoomId) return;
    try {
      const response = await api.delete(`/rooms/${selectedRoomId}`);
      if (response.data?.success) {
        toast.success('Room deleted successfully');
        setRooms((prev) => prev.filter((r) => r._id !== selectedRoomId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    } finally {
      setSelectedRoomId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold font-display text-slate-800 dark:text-white flex items-center justify-center sm:justify-start space-x-2">
              <LayoutGrid className="w-8 h-8 text-indigo-500" />
              <span>My Listings</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage study rooms you control, edit specifications, or add new nooks.
            </p>
          </div>
          <Link
            to="/add-room"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm self-center sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List a New Room</span>
          </Link>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {rooms.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-950 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-8 text-slate-800 dark:text-slate-100">
            <p className="text-slate-500 dark:text-slate-400">You haven't listed any study rooms yet.</p>
            <Link
              to="/add-room"
              className="mt-4 inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-bold"
            >
              <span>Add your first room</span>
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
            <AnimatePresence>
              {rooms.map((room) => (
                <motion.div
                  key={room._id}
                  variants={cardVariants}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col h-full text-slate-800 dark:text-slate-100"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={room.imageUrl} alt={room.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold shadow-lg">
                      {room.floor}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-display line-clamp-1">{room.name}</h3>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                        <span className="flex items-center space-x-1">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Capacity: {room.capacity}</span>
                        </span>
                        <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                          ${room.hourlyRate}/hr
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                      <span>Total Bookings: <span className="font-bold text-slate-700 dark:text-slate-350">{room.bookingCount}</span></span>
                      <Link
                        to={`/rooms/${room._id}`}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold"
                      >
                        View Details →
                      </Link>
                    </div>

                    {/* Owner Management Buttons */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2">
                      <Link
                        to={`/edit-room/${room._id}`}
                        className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Edit Nook</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteTrigger(room._id)}
                        className="flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 hover:bg-rose-100/70 font-bold text-xs transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Nook</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete study nook?"
        message="Are you sure you want to permanently delete this study room? This action will cancel all future bookings referencing this study nook."
        confirmText="Yes, Delete Room"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteModalOpen(false)}
        isDangerous={true}
      />
    </div>
  );
};

export default MyListings;
