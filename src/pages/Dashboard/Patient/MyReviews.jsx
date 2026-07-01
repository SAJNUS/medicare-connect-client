import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaStar, FaPencilAlt, FaTrash, FaPlus, FaTimes, FaUserMd, FaHeartbeat, FaBrain, FaBaby, FaBone, FaVenus, FaTooth, FaHeadSideVirus } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";

const getSpecialtyIcon = (specialty) => {
  if (!specialty) return <FaUserMd />;
  const s = specialty.toLowerCase();
  if (s.includes("cardiology")) return <FaHeartbeat />;
  if (s.includes("neurology")) return <FaBrain />;
  if (s.includes("pediatric")) return <FaBaby />;
  if (s.includes("orthopedics")) return <FaBone />;
  if (s.includes("dermatology")) return <FaUserMd />;
  if (s.includes("gynecology")) return <FaVenus />;
  if (s.includes("dentistry")) return <FaTooth />;
  if (s.includes("psychiatry")) return <FaHeadSideVirus />;
  return <FaUserMd />;
};

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [eligibleDoctors, setEligibleDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  // Form State
  const [formData, setFormData] = useState({ doctorEmail: "", rating: 5, text: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        const [aptRes, docRes, revRes] = await Promise.all([
          axiosInstance.get(`/appointments?patientEmail=${user.email}`),
          axiosInstance.get('/doctors'),
          axiosInstance.get(`/reviews?patientEmail=${user.email}`)
        ]);

        const fetchedDocs = docRes.data?.data || [];
        setAllDoctors(fetchedDocs);

        const fetchedRevs = revRes.data?.data || [];
        setReviews(fetchedRevs);

        const fetchedApts = aptRes.data?.data || [];
        // Eligible doctors: doctor has a completed appointment, and patient hasn't reviewed them yet.
        const completedApts = fetchedApts.filter(apt => apt.appointmentStatus === "completed");
        const uniqueDoctorEmails = [...new Set(completedApts.map(apt => apt.doctorEmail))];
        const reviewedDoctorEmails = new Set(fetchedRevs.map(rev => rev.doctorEmail));

        const unreviewedDoctors = uniqueDoctorEmails
          .filter(email => !reviewedDoctorEmails.has(email))
          .map(email => fetchedDocs.find(d => d.email === email))
          .filter(Boolean);
        
        setEligibleDoctors(unreviewedDoctors);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Filtering
  const filteredReviews = reviews.filter(rev => {
    const matchesFilter = filter === "All" || rev.rating.toString() === filter;
    const doc = allDoctors.find(d => d.email === rev.doctorEmail) || {};
    const dName = doc.name || "Doctor";
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = dName.toLowerCase().includes(searchLower) || rev.comment.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  // CRUD Operations
  const handleDelete = (id) => {
    setReviewToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (reviewToDelete) {
      try {
        await axiosInstance.delete(`/reviews/${reviewToDelete}`);
        const deletedRev = reviews.find(r => r._id === reviewToDelete);
        setReviews(reviews.filter(r => r._id !== reviewToDelete));
        
        // Return doctor to eligible list if they still have a completed appointment
        if (deletedRev) {
          const doc = allDoctors.find(d => d.email === deletedRev.doctorEmail);
          if (doc) setEligibleDoctors(prev => [...prev, doc]);
        }
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleEdit = (review) => {
    setFormData({ doctorEmail: review.doctorEmail, rating: review.rating, text: review.comment });
    setEditingId(review._id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    if (eligibleDoctors.length > 0) {
      setFormData({ doctorEmail: eligibleDoctors[0].email, rating: 5, text: "" });
    } else {
      setFormData({ doctorEmail: "", rating: 5, text: "" });
    }
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing
        const res = await axiosInstance.patch(`/reviews/${editingId}`, {
          rating: formData.rating,
          comment: formData.text
        });
        if (res.data.success) {
          setReviews(reviews.map(r => r._id === editingId ? { ...r, rating: formData.rating, comment: formData.text } : r));
        }
      } else {
        // Add new
        const payload = {
          patientEmail: user.email,
          patientName: user.displayName || "Patient",
          doctorEmail: formData.doctorEmail,
          rating: formData.rating,
          comment: formData.text
        };
        const res = await axiosInstance.post('/reviews', payload);
        if (res.data.success) {
          const newRev = { ...payload, _id: res.data.data.insertedId, createdAt: new Date().toISOString() };
          setReviews([newRev, ...reviews]);
          setEligibleDoctors(prev => prev.filter(d => d.email !== formData.doctorEmail));
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Helper for rendering stars
  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-lg transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : ''} ${star <= rating ? 'text-orange-400' : 'text-gray-200'}`}
            onClick={interactive ? () => setFormData({ ...formData, rating: star }) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Header & Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Reviews</h1>
          <p className="text-sm font-medium text-gray-500">Manage feedback you've left for your doctors.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-auto">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
          </div>

          <button
            onClick={handleAddNew}
            disabled={eligibleDoctors.length === 0}
            title={eligibleDoctors.length === 0 ? "You have reviewed all your visited doctors." : ""}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm shadow-primary/20 hover:bg-[#0b6e66] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus /> Write Review
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
        {["All", "5", "4", "3", "2", "1"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              filter === f
                ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm"
            }`}
          >
            {f !== "All" && <FaStar className={filter === f ? "text-orange-400" : "text-gray-400"} />}
            {f === "All" ? "All Ratings" : `${f} Stars`}
          </button>
        ))}
      </motion.div>

      {/* Reviews Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]"
        >
          {filteredReviews.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                <FaStar />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Reviews Found</h3>
              <p className="text-gray-500">You haven't left any reviews matching this criteria.</p>
            </motion.div>
          ) : (
            filteredReviews.map((rev, index) => {
              const doc = allDoctors.find(d => d.email === rev.doctorEmail) || {};
              const docImage = doc.photoURL || doc.image || doc.avatar || doc.photoUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80";
              const docName = doc.name || "Doctor";
              const exp = parseInt(doc.experience) || 5;
              let designation = "Consultant";
              if (exp >= 15) designation = "Professor";
              else if (exp >= 10) designation = "Associate Professor";
              const docSpecialty = doc.specialization || doc.specialty || "General";
              
              const dateObj = rev.createdAt ? new Date(rev.createdAt) : new Date();
              const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;

              return (
              <motion.div
                key={rev._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
              >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={docImage} alt={docName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{docName}</h3>
                    <p className="text-[#0b6e66] text-[10px] font-bold mb-0.5">{designation}</p>
                    <p className="text-xs font-semibold text-primary flex items-center gap-1">
                      {getSpecialtyIcon(docSpecialty)} {docSpecialty}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(rev)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-teal-50 transition-colors">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDelete(rev._id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                {renderStars(rev.rating)}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed flex-grow">"{rev.comment}"</p>

              <div className="mt-4 pt-4 border-t border-gray-50 text-xs font-semibold text-gray-400 flex justify-between items-center">
                <span>Posted on {formattedDate}</span>
                <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md">Published</span>
              </div>
              </motion.div>
            )})
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add / Edit Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingId ? "Edit Review" : "Write a Review"}
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Doctor</label>
                  <div className="relative">
                    <FaUserMd className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={formData.doctorEmail}
                      onChange={(e) => setFormData({ ...formData, doctorEmail: e.target.value })}
                      disabled={!!editingId} // Cannot change doctor when editing
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                    >
                      {editingId ? (
                        <option value={formData.doctorEmail}>
                          {allDoctors.find(d => d.email === formData.doctorEmail)?.name || "Doctor"}
                        </option>
                      ) : (
                        eligibleDoctors.map(doc => (
                          <option key={doc.email} value={doc.email}>{doc.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Overall Rating</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex justify-center">
                    {renderStars(formData.rating, true)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Feedback</label>
                  <textarea
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    required
                    placeholder="Share your experience..."
                    rows={4}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none font-medium"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-[#0b6e66] transition-colors shadow-sm shadow-primary/20"
                  >
                    {editingId ? "Save Changes" : "Submit Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm relative z-10 overflow-hidden p-6 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl">
                <FaTimes />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Review?</h3>
              <p className="text-gray-500 text-sm mb-6 font-medium">Are you sure you want to delete this review? This action cannot be undone.</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-500 text-white font-bold text-sm rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyReviews;
