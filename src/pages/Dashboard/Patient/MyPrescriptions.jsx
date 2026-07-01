import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilePrescription, FaTimes, FaDownload, FaPills, FaStethoscope } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";

const MyPrescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user?.email) return;
      try {
        setLoading(true);
        // Fetch all appointments for the patient to get doctor details and check completion
        const aptRes = await axiosInstance.get(`/appointments?patientEmail=${user.email}`);
        const appointments = aptRes.data?.data || [];
        
        // Fetch all prescriptions
        const presRes = await axiosInstance.get(`/prescriptions?patientEmail=${user.email}`);
        const fetchedPrescriptions = presRes.data?.data || [];

        // Map doctor names from appointments to prescriptions
        const mappedPrescriptions = fetchedPrescriptions.map(pres => {
          const relatedApt = appointments.find(apt => apt._id === pres.appointmentId);
          return {
            ...pres,
            doctorName: relatedApt ? relatedApt.doctorName : "Doctor",
            doctorEmail: relatedApt ? relatedApt.doctorEmail : "N/A"
          };
        });

        setPrescriptions(mappedPrescriptions);
      } catch (error) {
        console.error("Failed to fetch prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [user]);

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold font-poppins text-gray-900">My Prescriptions</h1>
        <p className="text-gray-500 mt-2 font-inter">View all your medical prescriptions and doctor's notes.</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <FaFilePrescription className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Prescriptions Yet</h3>
          <p className="text-gray-500">You don't have any prescriptions from completed appointments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {prescriptions.map((pres) => (
              <motion.div
                key={pres._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
                onClick={() => setSelectedPrescription(pres)}
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary transform origin-left"></div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl">
                    <FaFilePrescription />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 font-poppins">{pres.doctorName}</h3>
                    <p className="text-sm text-gray-500 font-inter">{new Date(pres.createdAt || pres.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm">
                    <FaStethoscope className="text-gray-400 mt-1" />
                    <span className="text-gray-700 font-medium line-clamp-1">{pres.diagnosis || "No diagnosis provided"}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <FaPills className="text-gray-400 mt-1" />
                    <span className="text-gray-600 line-clamp-2">
                      {pres.medications?.length} Medication(s) Prescribed
                    </span>
                  </div>
                </div>
                <button
                  className="w-full py-2.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-colors"
                >
                  View Full Prescription
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Prescription Modal */}
      <AnimatePresence>
        {selectedPrescription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaFilePrescription className="text-primary" />
                  Prescription Details
                </h3>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-poppins">{selectedPrescription.doctorName}</h2>
                    <p className="text-gray-500 text-sm mt-1">Prescribed on {new Date(selectedPrescription.createdAt || selectedPrescription.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Diagnosis */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FaStethoscope className="text-primary" /> Diagnosis
                    </h4>
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                      <p className="text-gray-700">{selectedPrescription.diagnosis}</p>
                    </div>
                  </div>

                  {/* Medications */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FaPills className="text-primary" /> Medications
                    </h4>
                    <div className="space-y-3">
                      {selectedPrescription.medications?.map((med, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{med.name}</p>
                            <p className="text-gray-500 text-sm">{med.type} • {med.dosage}</p>
                          </div>
                          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 text-center sm:text-right shadow-sm">
                            <p className="text-sm font-bold text-primary">{med.frequency}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{med.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advice / Notes */}
                  {selectedPrescription.advice && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Advice & Notes</h4>
                      <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                        <p className="text-gray-700 whitespace-pre-line">{selectedPrescription.advice}</p>
                      </div>
                    </div>
                  )}

                  {/* Next Visit */}
                  {selectedPrescription.nextVisit && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Follow-up Visit</h4>
                      <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 inline-block">
                        <p className="text-gray-700 font-medium">{new Date(selectedPrescription.nextVisit).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  onClick={() => {
                    toast.success("Downloading prescription feature coming soon!");
                  }}
                  className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-sm shadow-primary/30"
                >
                  <FaDownload /> Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyPrescriptions;
