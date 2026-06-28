import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilePrescription, FaPlus, FaTimes, FaSearch, FaPrint, FaDownload, FaEye } from "react-icons/fa";
import { toast } from "react-hot-toast";

const initialPrescriptions = [
  {
    id: 1,
    patientName: "John Doe",
    date: "2026-10-15",
    diagnosis: "Hypertension",
    status: "Active"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    date: "2026-10-10",
    diagnosis: "Type 2 Diabetes",
    status: "Completed"
  }
];

const PrescriptionManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    patientName: "",
    date: new Date().toISOString().split('T')[0],
    diagnosis: "",
    medication: "",
    dosage: "",
    instructions: ""
  });

  // Check for incoming appointment data
  useEffect(() => {
    if (location.state && location.state.appointmentData) {
      const { patientName, issue, date } = location.state.appointmentData;

      setFormData(prev => ({
        ...prev,
        patientName: patientName || "",
        diagnosis: issue || "",
        date: date || new Date().toISOString().split('T')[0]
      }));

      setIsModalOpen(true);

      // Clear the state so it doesn't trigger again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRx = {
      id: prescriptions.length + 1,
      patientName: formData.patientName,
      date: formData.date,
      diagnosis: formData.diagnosis,
      status: "Active"
    };

    setPrescriptions([newRx, ...prescriptions]);
    setIsModalOpen(false);

    toast.success("Prescription created successfully!", {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      }
    });

    setFormData({
      patientName: "",
      date: new Date().toISOString().split('T')[0],
      diagnosis: "",
      medication: "",
      dosage: "",
      instructions: ""
    });
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
            onClick={() => setIsModalOpen(true)}
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
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Patient Name</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Diagnosis</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-center">Actions</th>
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
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-4 font-bold text-gray-900">{rx.patientName}</td>
                      <td className="p-4 font-medium">{rx.date}</td>
                      <td className="p-4">{rx.diagnosis}</td>
                      <td className="p-4">
                        <span className={`inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold ${rx.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                          {rx.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
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
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
                    <FaFilePrescription />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Create Prescription</h2>
                    <p className="text-xs font-semibold text-gray-500">Issue a new digital Rx</p>
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
                    <input
                      type="text"
                      required
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-gray-900"
                      placeholder="e.g. Alice Smith"
                    />
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
                    <FaPlus /> Generate Prescription
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

export default PrescriptionManagement;
