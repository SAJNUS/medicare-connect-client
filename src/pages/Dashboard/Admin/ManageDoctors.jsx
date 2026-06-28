import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaBan, FaUserMd, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

const initialDoctors = [
  {
    id: 1,
    name: "Dr. James Wilson",
    email: "j.wilson@example.com",
    specialty: "Cardiology",
    license: "MED-2026-8921",
    applyDate: "Oct 10, 2026",
    status: "Verified",
    avatar: "https://i.pravatar.cc/150?u=drjames"
  },
  {
    id: 2,
    name: "Dr. Sarah Jenkins",
    email: "sarah.j@example.com",
    specialty: "Pediatrics",
    license: "MED-2026-9041",
    applyDate: "Oct 15, 2026",
    status: "Pending",
    avatar: "https://i.pravatar.cc/150?u=drsarah"
  },
  {
    id: 3,
    name: "Dr. Michael Chen",
    email: "m.chen@example.com",
    specialty: "Neurology",
    license: "MED-2026-7732",
    applyDate: "Oct 18, 2026",
    status: "Pending",
    avatar: "https://i.pravatar.cc/150?u=drmichael"
  },
  {
    id: 4,
    name: "Dr. Emily Wong",
    email: "ewong@example.com",
    specialty: "Dermatology",
    license: "MED-2026-6621",
    applyDate: "Sep 22, 2026",
    status: "Rejected",
    avatar: "https://i.pravatar.cc/150?u=dremily"
  },
  {
    id: 5,
    name: "Dr. Robert Smith",
    email: "robert.s@example.com",
    specialty: "Orthopedics",
    license: "MED-2026-5511",
    applyDate: "Sep 10, 2026",
    status: "Verified",
    avatar: "https://i.pravatar.cc/150?u=drrobert"
  }
];

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalActionType, setModalActionType] = useState(null);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionClick = (doctor, actionType) => {
    setSelectedDoctor(doctor);
    setModalActionType(actionType);
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    let newStatus = "";
    let toastMsg = "";

    if (modalActionType === "verify") {
      newStatus = "Verified";
      toastMsg = `Successfully verified ${selectedDoctor.name}.`;
    } else if (modalActionType === "reject") {
      newStatus = "Rejected";
      toastMsg = `Rejected verification for ${selectedDoctor.name}.`;
    } else if (modalActionType === "cancel") {
      newStatus = "Pending";
      toastMsg = `Cancelled verification for ${selectedDoctor.name}.`;
    }

    setDoctors(doctors.map(doc => 
      doc.id === selectedDoctor.id ? { ...doc, status: newStatus } : doc
    ));
    
    toast.success(toastMsg);
    setIsModalOpen(false);
    setSelectedDoctor(null);
    setModalActionType(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Verified":
        return <span className="inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700">Verified</span>;
      case "Pending":
        return <span className="inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700">Pending</span>;
      case "Rejected":
        return <span className="inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Header & Search */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Doctors</h1>
          <p className="text-sm font-medium text-gray-500">Approve new registrations and manage doctor profiles.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </motion.div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-600 text-sm">Doctor</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Specialty</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">License</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Date Applied</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Status</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDoctors.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <FaUserMd className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900">No doctors found</p>
                  </td>
                </tr>
              )}
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900">{doc.name}</p>
                        <p className="text-xs font-medium text-gray-500">{doc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold">
                      {doc.specialty}
                    </span>
                  </td>
                  <td className="p-4 text-center font-medium text-gray-600 text-sm">{doc.license}</td>
                  <td className="p-4 text-center font-medium text-gray-600 text-sm">{doc.applyDate}</td>
                  <td className="p-4 text-center">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleActionClick(doc, "verify")} 
                        disabled={doc.status === "Verified"}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${doc.status === "Verified" ? "text-gray-300 cursor-not-allowed" : "text-green-600 hover:bg-green-50"}`} 
                        title="Verify"
                      >
                        <FaCheckCircle className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleActionClick(doc, "reject")} 
                        disabled={doc.status === "Rejected"}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${doc.status === "Rejected" ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:bg-red-50"}`} 
                        title="Reject"
                      >
                        <FaTimesCircle className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleActionClick(doc, "cancel")} 
                        disabled={doc.status !== "Verified"}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${doc.status !== "Verified" ? "text-gray-300 cursor-not-allowed" : "text-orange-500 hover:bg-orange-50"}`} 
                        title="Cancel Verification"
                      >
                        <FaBan className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {filteredDoctors.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <FaUserMd className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">No doctors found</p>
            </div>
          )}
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="p-5 space-y-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{doc.name}</h3>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-1"><FaEnvelope className="text-gray-400"/> {doc.email}</p>
                  </div>
                </div>
                <div>{getStatusBadge(doc.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                <div>
                  <span className="block text-gray-500 mb-0.5 font-semibold">Specialty</span>
                  <span className="font-bold text-gray-900">{doc.specialty}</span>
                </div>
                <div>
                  <span className="block text-gray-500 mb-0.5 font-semibold">License</span>
                  <span className="font-bold text-gray-900">{doc.license}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-gray-500 mb-0.5 font-semibold">Date Applied</span>
                  <span className="font-bold text-gray-900">{doc.applyDate}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => handleActionClick(doc, "verify")} 
                  disabled={doc.status === "Verified"}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex-1 ${doc.status === "Verified" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                >
                  <FaCheckCircle /> Verify
                </button>
                <button 
                  onClick={() => handleActionClick(doc, "reject")} 
                  disabled={doc.status === "Rejected"}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex-1 ${doc.status === "Rejected" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                >
                  <FaTimesCircle /> Reject
                </button>
                <button 
                  onClick={() => handleActionClick(doc, "cancel")} 
                  disabled={doc.status !== "Verified"}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex-1 ${doc.status !== "Verified" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}
                >
                  <FaBan /> Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-2xl mb-4 ${
                  modalActionType === 'verify' ? 'bg-green-100 text-green-600' :
                  modalActionType === 'reject' ? 'bg-red-100 text-red-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {modalActionType === 'verify' ? <FaCheckCircle /> : 
                   modalActionType === 'reject' ? <FaTimesCircle /> : <FaBan />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {modalActionType === 'verify' ? 'Verify Doctor?' : 
                   modalActionType === 'reject' ? 'Reject Doctor?' : 'Cancel Verification?'}
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  {modalActionType === 'verify' ? (
                    <>Are you sure you want to approve verification for <span className="font-bold text-gray-900">{selectedDoctor.name}</span>?</>
                  ) : modalActionType === 'reject' ? (
                    <>Are you sure you want to reject the application for <span className="font-bold text-gray-900">{selectedDoctor.name}</span>?</>
                  ) : (
                    <>Are you sure you want to revoke the verified status for <span className="font-bold text-gray-900">{selectedDoctor.name}</span>?</>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 bg-gray-50 border-t border-gray-100 divide-x divide-gray-100">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`py-3 text-sm font-bold transition-colors ${
                    modalActionType === 'verify' ? 'text-green-600 hover:bg-green-50' :
                    modalActionType === 'reject' ? 'text-red-600 hover:bg-red-50' :
                    'text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageDoctors;
