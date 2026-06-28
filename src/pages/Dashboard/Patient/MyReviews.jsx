import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaStar, FaPencilAlt, FaTrash, FaPlus, FaTimes, FaUserMd } from "react-icons/fa";

const initialReviews = [
  {
    id: 1,
    doctorName: "Dr. Sarah Jenkins",
    specialty: "Cardiologist",
    rating: 5,
    date: "Oct 25, 2026",
    text: "Dr. Jenkins was extremely thorough and took the time to explain everything clearly. Highly recommend her!",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    doctorName: "Dr. Michael Chen",
    specialty: "Neurologist",
    rating: 4,
    date: "Sep 12, 2026",
    text: "Great consultation, but I had to wait a little bit past my appointment time. Otherwise, very professional.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
  }
];

const mockDoctorsList = [
  "Dr. Sarah Jenkins",
  "Dr. Michael Chen",
  "Dr. Emily Wong",
  "Dr. Robert Smith"
];

const MyReviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ doctorName: "", rating: 5, text: "" });

  // Filtering
  const filteredReviews = reviews.filter(rev => {
    const matchesFilter = filter === "All" || rev.rating.toString() === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = rev.doctorName.toLowerCase().includes(searchLower) || rev.text.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  // CRUD Operations
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleEdit = (review) => {
    setFormData({ doctorName: review.doctorName, rating: review.rating, text: review.text });
    setEditingId(review.id);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({ doctorName: mockDoctorsList[0], rating: 5, text: "" });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update existing
      setReviews(reviews.map(r => r.id === editingId ? { ...r, ...formData, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) } : r));
    } else {
      // Add new
      const newReview = {
        id: Date.now(),
        ...formData,
        specialty: "General Practitioner", // Mocking specialty
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: "https://images.unsplash.com/photo-1594824436998-d58df189038e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" // Mock image
      };
      setReviews([newReview, ...reviews]);
    }
    setIsModalOpen(false);
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
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm shadow-primary/20 hover:bg-primary-focus transition-colors"
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
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${filter === f
              ? "bg-gray-900 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm"
              }`}
          >
            {f !== "All" && <FaStar className={filter === f ? "text-orange-400" : "text-gray-400"} />}
            {f === "All" ? "All Ratings" : `${f} Stars`}
          </button>
        ))}
      </motion.div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100"
          >
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <FaStar />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-500">You haven't left any reviews matching this criteria.</p>
          </motion.div>
        ) : (
          filteredReviews.map((rev, index) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={rev.image} alt={rev.doctorName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{rev.doctorName}</h3>
                    <p className="text-xs font-semibold text-primary">{rev.specialty}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(rev)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:bg-teal-50 transition-colors">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleDelete(rev.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                {renderStars(rev.rating)}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed flex-grow">"{rev.text}"</p>

              <div className="mt-4 pt-4 border-t border-gray-50 text-xs font-semibold text-gray-400 flex justify-between items-center">
                <span>Posted on {rev.date}</span>
                <span className="bg-green-50 text-green-600 px-2 py-1 rounded-md">Published</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

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
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      disabled={!!editingId} // Cannot change doctor when editing
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none disabled:opacity-70 disabled:cursor-not-allowed font-medium"
                    >
                      {mockDoctorsList.map(doc => (
                        <option key={doc} value={doc}>{doc}</option>
                      ))}
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
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-focus transition-colors shadow-sm shadow-primary/20"
                  >
                    {editingId ? "Save Changes" : "Submit Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MyReviews;
