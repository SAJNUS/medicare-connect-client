import { useState, useEffect, useMemo } from "react";
import { formatToDDMMYYYY } from "../../../utils/dateUtils";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaBan, FaUserMd, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../../../api/axiosInstance";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalActionType, setModalActionType] = useState(null);
  const [isActioning, setIsActioning] = useState(false);

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        // Fetch all pages; admin needs full visibility
        const res = await axiosInstance.get('/admin/doctors');
        if (res.data.success) {
          const mapped = res.data.data.map(doc => ({
            id: doc._id,
            email: doc.email,
            name: doc.name,
            designation: doc.designation,
            specialty: doc.specialty,
            qualifications: doc.qualifications,
            experience: doc.experience,
            fee: doc.consultationFee,
            applyDate: doc.createdAt,
            status: doc.verificationStatus === 'verified' ? 'Verified'
                  : doc.verificationStatus === 'rejected' ? 'Rejected'
                  : doc.verificationStatus === 'removed' ? 'Removed'
                  : 'Pending',
            avatar: doc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=0b6e66&color=fff`,
            rawStatus: doc.verificationStatus || 'pending'
          }));
          setDoctors(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        toast.error("Failed to load doctor list.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [doctors, searchQuery]);

  const handleActionClick = (doctor, actionType) => {
    setSelectedDoctor(doctor);
    setModalActionType(actionType);
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    let newStatus = "";
    let toastMsg = "";
    let apiStatus = "";

    if (modalActionType === "verify") {
      newStatus = "Verified"; apiStatus = "verified";
      toastMsg = `Successfully verified ${selectedDoctor.name}.`;
    } else if (modalActionType === "reject") {
      newStatus = "Rejected"; apiStatus = "rejected";
      toastMsg = `Rejected verification for ${selectedDoctor.name}.`;
    } else if (modalActionType === "cancel") {
      newStatus = "Removed"; apiStatus = "removed";
      toastMsg = `Removed verification for ${selectedDoctor.name}.`;
    } else if (modalActionType === "reinstate") {
      newStatus = "Pending"; apiStatus = "pending";
      toastMsg = `Reinstated ${selectedDoctor.name} to pending review.`;
    }

    setIsActioning(true);
    try {
      await axiosInstance.patch(`/admin/doctors/${selectedDoctor.email}/verification`, { status: apiStatus });
      setDoctors(doctors.map(doc => 
        doc.id === selectedDoctor.id ? { ...doc, status: newStatus, rawStatus: apiStatus } : doc
      ));
      toast.success(toastMsg);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${modalActionType} doctor.`);
    } finally {
      setIsActioning(false);
      setIsModalOpen(false);
      setSelectedDoctor(null);
      setModalActionType(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Verified":
        return <span className="inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700">Verified</span>;
      case "Pending":
        return <span className="inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-700">Pending</span>;
      case "Rejected":
        return <span className="inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700">Rejected</span>;
      case "Removed":
        return <span className="inline-flex justify-center items-center w-24 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-700">Removed</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return formatToDDMMYYYY(dateString);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-8">
      {/* Header & Search */}
      <motion.div
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-600 text-sm">Doctor</th>
                <th className="p-4 font-bold text-gray-600 text-sm">Details</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Registration Date</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Status</th>
                <th className="p-4 font-bold text-gray-600 text-sm text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <span className="loading loading-spinner loading-md text-primary"></span>
                    <p className="mt-2 font-medium">Loading doctors...</p>
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <FaUserMd className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900">No doctors found</p>
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
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
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-bold w-max">
                        {doc.specialty}
                      </span>
                      <p className="text-xs text-gray-600 font-medium">{doc.designation} • {doc.experience} Years Exp.</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{doc.qualifications || "No qualifications added"}</p>
                      <p className="text-xs text-green-600 font-bold">Fee: {doc.fee ? `${doc.fee} BDT` : "N/A"}</p>
                    </div>
                  </td>
                  <td className="p-4 text-center font-medium text-gray-600 text-sm">{formatDate(doc.applyDate)}</td>
                  <td className="p-4 text-center">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <button 
                        onClick={() => handleActionClick(doc, "verify")} 
                        disabled={doc.status === "Verified"}
                        className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${doc.status === "Verified" ? "text-gray-300 cursor-not-allowed" : "text-green-600 hover:bg-green-50"}`} 
                        title="Verify"
                      >
                        <FaCheckCircle />
                      </button>
                      <button 
                        onClick={() => handleActionClick(doc, "reject")} 
                        disabled={doc.status === "Rejected"}
                        className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${doc.status === "Rejected" ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:bg-red-50"}`} 
                        title="Reject"
                      >
                        <FaTimesCircle />
                      </button>
                      <button 
                        onClick={() => handleActionClick(doc, "cancel")} 
                        disabled={doc.status !== "Verified"}
                        className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${doc.status !== "Verified" ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100"}`} 
                        title="Remove Verification"
                      >
                        <FaBan />
                      </button>
                      <button 
                        onClick={() => handleActionClick(doc, "reinstate")} 
                        disabled={doc.status === "Pending" || doc.status === "Verified"}
                        className={`w-7 h-7 flex items-center justify-center rounded-md transition-colors ${doc.status === "Pending" || doc.status === "Verified" ? "text-gray-300 cursor-not-allowed" : "text-orange-500 hover:bg-orange-50"}`} 
                        title="Reinstate to Pending"
                      >
                        <FaCheckCircle className="text-orange-500"/>
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <span className="loading loading-spinner loading-md text-primary"></span>
              <p className="mt-2 font-medium">Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaUserMd className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">No doctors found</p>
            </div>
          ) : (
            filteredDoctors.map((doc) => (
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

                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Details</span>
                      <p className="text-gray-700 font-medium text-xs">{doc.designation} • {doc.experience} Yr Exp.</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{doc.qualifications || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Reg. Date</span>
                      <span className="font-medium text-gray-700 text-xs">{formatDate(doc.applyDate)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-1">Fee</span>
                      <span className="font-bold text-green-600 text-xs">{doc.fee ? `${doc.fee} BDT` : "N/A"}</span>
                    </div>
                  </div>

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <button 
                  onClick={() => handleActionClick(doc, "verify")} 
                  disabled={doc.status === "Verified"}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${doc.status === "Verified" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                >
                  <FaCheckCircle /> Verify
                </button>
                <button 
                  onClick={() => handleActionClick(doc, "reject")} 
                  disabled={doc.status === "Rejected"}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${doc.status === "Rejected" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                >
                  <FaTimesCircle /> Reject
                </button>
                <button 
                  onClick={() => handleActionClick(doc, "cancel")} 
                  disabled={doc.status !== "Verified"}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${doc.status !== "Verified" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  <FaBan /> Remove
                </button>
                <button 
                  onClick={() => handleActionClick(doc, "reinstate")} 
                  disabled={doc.status === "Pending" || doc.status === "Verified"}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${doc.status === "Pending" || doc.status === "Verified" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}
                >
                  <FaCheckCircle /> Reinstate
                </button>
              </div>
            </div>
          )))}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
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
