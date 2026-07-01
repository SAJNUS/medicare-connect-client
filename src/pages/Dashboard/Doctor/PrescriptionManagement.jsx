import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilePrescription, FaPlus, FaTimes, FaSearch, FaPrint, FaDownload, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";

const PrescriptionManagement = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    appointmentId: "",
    date: new Date().toISOString().split('T')[0],
    diagnosis: "",
    medication: "",
    dosage: "",
    instructions: ""
  });

  // Fetch real prescriptions and completed appointments
  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user?.email) return;
      try {
        setIsLoading(true);
        const [rxRes, aptRes] = await Promise.all([
          axiosInstance.get(`/prescriptions?doctorEmail=${user.email}`),
          axiosInstance.get(`/appointments?doctorEmail=${user.email}`)
        ]);
        
        if (rxRes.data.success) {
          const mapped = rxRes.data.data.map(rx => ({
            id: rx._id,
            patientName: rx.patientName || "Unknown Patient",
            patientId: rx.patientId || "",
            appointmentId: rx.appointmentId || "",
            date: rx.date || rx.createdAt?.substring(0, 10),
            diagnosis: rx.diagnosis || "",
            medication: rx.medication || "",
            dosage: rx.dosage || "",
            instructions: rx.instructions || "",
            status: rx.status || "Active"
          }));
          setPrescriptions(mapped);
        }

        if (aptRes.data.success) {
          const completed = aptRes.data.data.filter(a => a.appointmentStatus === 'completed');
          setCompletedAppointments(completed);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading]);

  // Check for incoming appointment data
  useEffect(() => {
    if (location.state && location.state.appointmentData) {
      const apt = location.state.appointmentData;
      setFormData({
        patientName: apt.patientName || "",
        patientId: apt.patientId || "",
        appointmentId: apt.id || apt._id || "",
        diagnosis: apt.issue || apt.symptoms?.[0] || "",
        date: apt.date || new Date().toISOString().split('T')[0],
        medication: "",
        dosage: "",
        instructions: ""
      });
      setEditingId(null);
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientName || !formData.diagnosis) {
      toast.error("Patient name and diagnosis are required.");
      return;
    }

    try {
      const payload = {
        ...formData,
        doctorEmail: user?.email,
        status: "Active"
      };

      if (editingId) {
        const response = await axiosInstance.patch(`/prescriptions/${editingId}`, payload);
        if (response.data.success) {
          setPrescriptions(prescriptions.map(rx => rx.id === editingId ? { ...rx, ...payload } : rx));
          toast.success("Prescription updated successfully!");
        }
      } else {
        const response = await axiosInstance.post('/prescriptions', payload);
        if (response.data.success) {
          const newRx = { id: response.data.data.insertedId, ...payload };
          setPrescriptions([newRx, ...prescriptions]);
          toast.success("Prescription created successfully!");
        }
      }

      // Automatically mark the linked appointment as completed
      if (formData.appointmentId) {
        try {
          await axiosInstance.patch(`/appointments/${formData.appointmentId}/status`, { status: 'completed' });
          // Optionally, show a second toast or integrate into one
          toast.success("Appointment marked as completed!", {
            style: { borderRadius: '10px', background: '#333', color: '#fff' }
          });
        } catch (aptErr) {
          console.error("Failed to mark appointment as completed:", aptErr);
        }
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save prescription:", err);
      toast.error("Failed to save prescription.");
    }
  };

  const handleEdit = (rx) => {
    setFormData({
      patientName: rx.patientName,
      patientId: rx.patientId || "",
      appointmentId: rx.appointmentId || "",
      date: rx.date,
      diagnosis: rx.diagnosis,
      medication: rx.medication,
      dosage: rx.dosage,
      instructions: rx.instructions
    });
    setEditingId(rx.id);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      patientId: "",
      appointmentId: "",
      date: new Date().toISOString().split('T')[0],
      diagnosis: "",
      medication: "",
      dosage: "",
      instructions: ""
    });
    setEditingId(null);
  };

  const filteredPrescriptions = prescriptions.filter(rx =>
    rx.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Rx Management</h1>
          <p className="text-sm font-medium text-gray-500">Create and manage digital prescriptions.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-auto">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-700"
            />
          </div>

          <button
            onClick={openNewModal}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-bold shadow-sm shadow-teal-500/20 hover:bg-teal-600 transition-colors"
          >
            <FaPlus /> New Prescription
          </button>
        </div>
      </motion.div>

      {/* Prescriptions List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">
                <th className="p-4 font-bold min-w-[150px]">Patient Name</th>
                <th className="p-4 font-bold text-center min-w-[120px]">Date</th>
                <th className="p-4 font-bold text-center min-w-[140px]">Diagnosis</th>
                <th className="p-4 font-bold text-center min-w-[120px]">Status</th>
                <th className="p-4 font-bold text-center min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredPrescriptions.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No prescriptions found.
                    </td>
                  </motion.tr>
                ) : (
                  filteredPrescriptions.map((rx) => (
                    <motion.tr
                      key={rx.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 transition-colors whitespace-nowrap"
                    >
                      <td className="p-4 font-bold text-gray-900">{rx.patientName}</td>
                      <td className="p-4 font-medium text-center">{rx.date}</td>
                      <td className="p-4 text-center">{rx.diagnosis}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold ${rx.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {rx.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => handleEdit(rx)} className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                            <FaEye />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <FaPrint />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                            <FaDownload />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* New Prescription Modal */}
      {createPortal(
        <AnimatePresence>
          {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-y-auto max-h-[85vh] md:max-h-none md:overflow-hidden pb-8 sm:pb-0"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
                    <FaFilePrescription />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{editingId ? "Edit Prescription" : "Create Prescription"}</h2>
                    <p className="text-xs font-semibold text-gray-500">{editingId ? "Update existing Rx" : "Issue a new digital Rx"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Patient Name</label>
                    <select
                      required
                      value={formData.appointmentId}
                      onChange={(e) => {
                        const apt = completedAppointments.find(a => a._id === e.target.value);
                        if (apt) {
                          setFormData({
                            ...formData,
                            appointmentId: apt._id,
                            patientId: apt.patientId || "",
                            patientName: apt.patientName || "",
                            diagnosis: apt.issue || apt.symptoms?.[0] || formData.diagnosis,
                            date: apt.date || formData.date
                          });
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-gray-900 appearance-none"
                    >
                      <option value="" disabled>Select a completed appointment</option>
                      {completedAppointments.map(apt => (
                        <option key={apt._id} value={apt._id}>
                          {apt.patientName} - {apt.date}
                        </option>
                      ))}
                      {editingId && formData.appointmentId && !completedAppointments.some(a => a._id === formData.appointmentId) && (
                        <option value={formData.appointmentId}>{formData.patientName}</option>
                      )}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 mb-6">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Diagnosis / Issue</label>
                  <input
                    type="text"
                    required
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-gray-900"
                    placeholder="e.g. Blood Pressure, Viral Fever"
                  />
                </div>

                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 mb-6 space-y-4">
                  <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2">Medication Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600">Medicine Name</label>
                      <input
                        type="text"
                        required
                        value={formData.medication}
                        onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition-all"
                        placeholder="e.g. Amoxicillin"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600">Dosage</label>
                      <input
                        type="text"
                        required
                        value={formData.dosage}
                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition-all"
                        placeholder="e.g. 500mg, Twice a day"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-600">Special Instructions</label>
                    <input
                      type="text"
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 transition-all"
                      placeholder="e.g. Take after meals"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold bg-teal-500 text-white hover:bg-teal-600 shadow-sm shadow-teal-500/20 transition-colors flex items-center gap-2"
                  >
                    {editingId ? <FaEye /> : <FaPlus />} {editingId ? "Update Prescription" : "Generate Prescription"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default PrescriptionManagement;
