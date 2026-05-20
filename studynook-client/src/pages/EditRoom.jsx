import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Edit3, CheckSquare, Square, Image, DollarSign, Users, Layers, FileText, LayoutGrid } from 'lucide-react';

const AMENITIES_OPTIONS = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [floor, setFloor] = useState('Floor 1');
  const [capacity, setCapacity] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  useEffect(() => {
    document.title = 'StudyNook – Edit Room';
    
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/rooms/${id}`);
        if (response.data?.success) {
          const room = response.data.room;
          
          // Verify ownership before showing form
          const ownerId = room.owner?._id || room.owner;
          if (user && ownerId !== user._id) {
            toast.error('You are not authorized to edit this study room');
            navigate('/rooms');
            return;
          }
          
          setName(room.name);
          setDescription(room.description);
          setImageUrl(room.imageUrl);
          setFloor(room.floor);
          setCapacity(room.capacity);
          setHourlyRate(room.hourlyRate);
          setSelectedAmenities(room.amenities || []);
        }
      } catch (error) {
        toast.error('Could not load room details for editing');
        navigate('/my-listings');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchRoom();
    }
  }, [id, user, navigate]);

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !imageUrl || !floor || !capacity || !hourlyRate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (description.length < 20) {
      toast.error('Description must be at least 20 characters long');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.put(`/rooms/${id}`, {
        name,
        description,
        imageUrl,
        floor,
        capacity: Number(capacity),
        hourlyRate: Number(hourlyRate),
        amenities: selectedAmenities,
      });

      if (response.data?.success) {
        toast.success('Room updated successfully!');
        navigate('/my-listings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update study room');
    } finally {
      setSubmitting(false);
    }
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
        <div className="max-w-4xl mx-auto px-4 text-center sm:text-left space-y-2">
          <h1 className="text-3xl font-extrabold font-display text-slate-800 dark:text-white flex items-center justify-center sm:justify-start space-x-2">
            <Edit3 className="w-8 h-8 text-indigo-500" />
            <span>Edit Room Listing</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Make adjustments to pricing, seating limits, equipped components, and photos.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room name */}
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Room Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g., Silent Cabin A - 3rd Floor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                  />
                  <LayoutGrid className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</label>
                <div className="relative">
                  <textarea
                    required
                    rows="4"
                    placeholder="Detailed description of the room layout, table configurations, seating comfort, screen access, quiet status..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none dark:text-white"
                  />
                  <FileText className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[10px] text-slate-400">Minimum 20 characters.</p>
              </div>

              {/* Image URL */}
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Image URL</label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/... or other internet graphics URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                  />
                  <Image className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Floor Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Library Floor</label>
                <div className="relative">
                  <select
                    required
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                  >
                    <option value="Floor 1">Floor 1</option>
                    <option value="Floor 2">Floor 2</option>
                    <option value="Floor 3">Floor 3</option>
                    <option value="Floor 4">Floor 4</option>
                    <option value="Floor 5">Floor 5</option>
                  </select>
                  <Layers className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Capacity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Seat Capacity</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g., 4"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                  />
                  <Users className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Hourly rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hourly Rate ($)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g., 10"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white"
                  />
                  <DollarSign className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Equipped Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES_OPTIONS.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      type="button"
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`flex items-center space-x-2.5 p-3 rounded-xl border text-left text-sm font-semibold transition-all ${
                        isChecked
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4.5 h-4.5 text-indigo-500" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-slate-400" />
                      )}
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/10 font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Save Adjustments'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditRoom;
