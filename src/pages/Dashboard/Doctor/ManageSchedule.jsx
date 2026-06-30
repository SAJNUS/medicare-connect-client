import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt, FaPlus, FaTimes, FaPencilAlt, FaTrash, FaCheckCircle, FaBan, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";

const ManageSchedule = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ date: "", startTime: "", endTime: "", type: "Video Consult" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch slots from backend
  useEffect(() => {
    const fetchSlots = async () => {
      if (!user?.email) return;
      try {
        setIsLoadingSlots(true);
        const res = await axiosInstance.get(`/schedules?doctorEmail=${user.email}`);
        if (res.data.success) {
          const mapped = res.data.data.map(slot => ({
            id: slot._id,
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            type: slot.type,
            status: slot.status === 'available' ? 'Available'
                  : slot.status === 'booked' ? 'Booked' : 'Unavailable'
          }));
          setSlots(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch schedule slots:", err);
        toast.error("Failed to load your schedule.");
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [user]);

  // Filtering
  const filteredSlots = slots.filter(slot => {
    const matchesDate = !dateFilter || slot.date === dateFilter;
    const matchesStatus = statusFilter === "All" || slot.status === statusFilter;
    return matchesDate && matchesStatus;
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  // CRUD Operations
  const handleToggleStatus = async (id) => {
    const slot = slots.find(s => s.id === id);
    if (!slot) return;
    if (slot.status === "Booked") {
      toast.error("Cannot toggle a booked slot. Cancel the appointment first.");
      return;
    }
    const newStatus = slot.status === "Available" ? "unavailable" : "available";
    try {
      await axiosInstance.patch(`/schedules/${id}`, { status: newStatus });
      setSlots(slots.map(s => s.id === id ? { ...s, status: newStatus === 'available' ? 'Available' : 'Unavailable' } : s));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update slot status.");
    }
  };

  const handleDelete = async (id) => {
    const slot = slots.find(s => s.id === id);
    if (slot?.status === "Booked") {
      toast.error("Cannot delete a booked slot. Cancel the appointment first.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        await axiosInstance.delete(`/schedules/${id}`);
        setSlots(slots.filter(s => s.id !== id));
        toast.success("Slot deleted successfully.");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete slot.");
      }
    }
  };

  const handleEdit = (slot) => {
    if (slot.status === "Booked") {
      toast.error("Cannot edit a booked slot. Cancel the appointment first.");
      return;
    }
    setFormData({ date: slot.date, startTime: slot.startTime, endTime: slot.endTime, type: slot.type });
    setEditingId(slot.id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({ date: "", startTime: "", endTime: "", type: "Video Consult" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast.error("Date, start time, and end time are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await axiosInstance.patch(`/schedules/${editingId}`, formData);
        setSlots(slots.map(s => s.id === editingId ? { ...s, ...formData } : s));
        toast.success("Slot updated successfully.");
      } else {
        const res = await axiosInstance.post('/schedules', { ...formData, doctorEmail: user.email });
        const newSlot = {
          id: res.data.data.insertedId,
          ...formData,
          status: "Available"
        };
        setSlots([...slots, newSlot]);
        toast.success("Slot added successfully.");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return <span className="inline-flex items-center justify-center w-28 gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100"><FaCheckCircle /> Available</span>;
      case "Booked":
        return <span className="inline-flex items-center justify-center w-28 gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100"><FaCalendarAlt /> Booked</span>;
      case "Unavailable":
        return <span className="inline-flex items-center justify-center w-28 gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100"><FaBan /> Unavailable</span>;
      default:
        return null;
    }
  };

  // Helper to format time strings (e.g. "09:00" -> "09:00 AM")
  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minute} ${ampm}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">

      {/* Header & Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Schedule</h1>
          <p className="text-sm font-medium text-gray-500">Create and manage your availability slots.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Date Picker Filter */}
          <div className="relative w-full sm:w-auto">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-700"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                title="Clear date filter"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <button
            onClick={handleAddNew}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm shadow-primary/20 hover:bg-primary-focus transition-colors"
          >
            <FaPlus /> Add Slot
          </button>
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2"
      >
        {["All", "Available", "Booked", "Unavailable"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${statusFilter === f
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm"
              }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Schedule Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredSlots.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <FaCalendarAlt />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Slots Found</h3>
            <p className="text-gray-500">You don't have any slots matching this criteria.</p>
          </div>
        ) : (
          filteredSlots.map((slot) => (
            <div
              key={slot.id}
              className={`border rounded-2xl p-6 transition-shadow flex flex-col h-full bg-white hover:shadow-md ${slot.status === 'Booked' ? 'border-blue-100 shadow-blue-50/50' : 'border-gray-100 shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-4">
                {getStatusBadge(slot.status)}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(slot.id)}
                    disabled={slot.status === "Booked"}
                    title={slot.status === "Available" ? "Mark Unavailable" : "Mark Available"}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${slot.status === "Booked" ? 'text-gray-300 cursor-not-allowed' : slot.status === 'Available' ? 'text-green-500 hover:bg-green-50' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    {slot.status === 'Available' ? <FaToggleOn className="text-xl" /> : <FaToggleOff className="text-xl" />}
                  </button>
                  <button
                    onClick={() => handleEdit(slot)}
                    disabled={slot.status === "Booked"}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${slot.status === "Booked" ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-primary hover:bg-teal-50'}`}
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    disabled={slot.status === "Booked"}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${slot.status === "Booked" ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-primary flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Date</p>
                    <p className="text-sm font-bold">{slot.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Time</p>
                    <p className="text-sm font-bold">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-50">
                <div className={`flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-xl ${slot.type === 'Video Consult' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
                  {slot.type === 'Video Consult' ? <FaVideo /> : <FaMapMarkerAlt />}
                  {slot.type}
                </div>
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* Add / Edit Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md relative z-10 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Slot" : "Add New Slot"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Consultation Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium appearance-none"
                >
                  <option value="Video Consult">Video Consult</option>
                  <option value="In-Person Consult">In-Person Consult</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-focus transition-colors shadow-sm shadow-primary/20"
                >
                  {editingId ? "Save Changes" : "Create Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageSchedule;
