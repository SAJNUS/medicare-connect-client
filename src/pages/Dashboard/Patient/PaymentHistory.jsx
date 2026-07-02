import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import axiosInstance from "../../../api/axiosInstance";
import { formatToDDMMYYYY } from "../../../utils/dateUtils";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFileInvoiceDollar, FaCheckCircle, FaClock, FaTimesCircle, FaDownload, FaCreditCard, FaCcVisa, FaCcMastercard, FaVideo, FaMapMarkerAlt } from "react-icons/fa";

const PaymentHistory = () => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.email) return;
      console.log('[PaymentHistory] Fetching for email:', user.email);
      try {
        setLoading(true);
        const apiUrl = `/payments?patientEmail=${user.email}`;
        console.log('[PaymentHistory] API URL:', apiUrl);
        
        const response = await axiosInstance.get(apiUrl);
        console.log('[PaymentHistory] Raw API response:', response.data);
        console.log('[PaymentHistory] Documents returned by query:', response.data?.data?.length ?? 'N/A');

        if (response.data.success) {
          const mappedTxns = response.data.data.map(txn => {
            return {
              id: String(txn.displayTransactionId || txn.friendlyTxnId || (txn.transactionId?.startsWith('pi_') ? `TXN-2026-${txn.transactionId.slice(-4).toUpperCase()}` : txn.transactionId) || txn._id),
              realId: txn.transactionId || txn._id,
              doctorName: String(txn.doctorName || "Doctor"),
              date: formatToDDMMYYYY(txn.paymentDate || txn.date),
              time: String(txn.time || new Date(txn.paymentDate || txn.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })),
              amount: Number(txn.amount || 0),
              method: "Stripe",
              cardType: "stripe",
              status: txn.paymentStatus === 'refunded' ? 'Failed' : 'Completed',
              type: String(txn.type || "Consultation"),
              original: txn
            };
          });
          console.log('[PaymentHistory] Mapped transactions count:', mappedTxns.length);
          setTransactions(mappedTxns);
        } else {
          console.warn('[PaymentHistory] API returned success=false:', response.data.message);
        }
      } catch (error) {
        console.error('[PaymentHistory] FETCH ERROR (this is why transactions are empty):', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user]);

  const handleDownload = (txn) => {
    // Ensure the VITE_API_URL handles trailing slashes correctly, or fallback for dev
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    window.open(`${baseUrl}/payments/${txn.id}/receipt`, '_blank');
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesFilter = filter === "All" || txn.status === filter;
    const searchLower = String(searchQuery || "").toLowerCase();
    const matchesSearch =
      String(txn.doctorName || "").toLowerCase().includes(searchLower) ||
      String(txn.id || "").toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });
  console.log('[PaymentHistory] Final filteredTransactions length before render:', filteredTransactions.length, '| filter:', filter, '| search:', searchQuery);


  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <span className="inline-flex items-center justify-center w-28 gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100"><FaCheckCircle /> Completed</span>;
      case "Pending":
        return <span className="inline-flex items-center justify-center w-28 gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100"><FaClock /> Pending</span>;
      case "Failed":
        return <span className="inline-flex items-center justify-center w-28 gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100"><FaTimesCircle /> Failed</span>;
      default:
        return null;
    }
  };

  const getCardIcon = (type) => {
    switch (type) {
      case "visa": return <FaCcVisa className="text-blue-600 text-xl" />;
      case "mastercard": return <FaCcMastercard className="text-orange-600 text-xl" />;
      default: return <FaCreditCard className="text-gray-500 text-xl" />;
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Payment History</h1>
          <p className="text-sm font-medium text-gray-500">Track and manage your consultation payments.</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Doctor or TXN ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </motion.div>

      {/* Filter Pills */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex overflow-x-auto pb-2 sm:pb-0 hide-scrollbar gap-2"
      >
        {["All", "Completed", "Pending", "Failed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${filter === f
              ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm"
              }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Transactions Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >

        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID & Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount & Method</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <FaFileInvoiceDollar className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900">No transactions found</p>
                    <p className="text-sm">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              )}
              {filteredTransactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{txn.id}</div>
                    <div className="text-xs font-semibold text-gray-500">{txn.date} at {txn.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{txn.doctorName}</div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      {txn.type === 'Video Consult' ? <FaVideo className="text-blue-500" /> : <FaMapMarkerAlt className="text-red-500" />}
                      {txn.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-sm mb-1">BDT {txn.amount.toFixed(2)}</div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                      {getCardIcon(txn.cardType)}
                      {txn.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(txn.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {txn.status === "Completed" ? (
                      <button
                        onClick={() => handleDownload(txn)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                        title="Download Receipt"
                      >
                        <FaDownload />
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs font-semibold">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (Hidden on desktop) */}
        <div className="md:hidden divide-y divide-gray-100">
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileInvoiceDollar className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Transactions Found</h3>
                <p className="text-gray-500 text-sm">
                  {searchQuery || filter !== "All"
                    ? "Try adjusting your filters or search query"
                    : "You haven't made any payments yet"}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredTransactions.map((txn, index) => (
                  <motion.div
                    key={txn.id}
                    className="p-5 space-y-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="font-bold text-gray-900 text-sm mb-0.5">{txn.id}</div>
                        <div className="text-xs font-semibold text-gray-500">{txn.date} • {txn.time}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-gray-900 text-base mb-1">BDT {txn.amount.toFixed(2)}</div>
                        {getStatusBadge(txn.status)}
                      </div>
                    </div>

                    <div className="flex justify-between items-end gap-4 pt-2 border-t border-gray-50">
                      <div>
                        <div className="font-bold text-gray-800 text-sm mb-0.5">{txn.doctorName}</div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                          {txn.type === 'Video Consult' ? <FaVideo className="text-blue-500" /> : <FaMapMarkerAlt className="text-red-500" />}
                          {txn.type}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                          {getCardIcon(txn.cardType)}
                          {txn.method}
                        </div>
                      </div>

                      {txn.status === "Completed" && (
                        <button
                          onClick={() => handleDownload(txn)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-primary hover:text-white transition-colors text-xs font-bold border border-gray-200"
                        >
                          <FaDownload /> Receipt
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default PaymentHistory;
