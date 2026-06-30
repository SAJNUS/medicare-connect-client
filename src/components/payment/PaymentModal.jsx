import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import axiosInstance from "../../api/axiosInstance";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ isOpen, onClose, appointment, onPaymentSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && appointment?.fee) {
      setLoading(true);
      // Force local backend URL to ensure we hit the newly added route
      axiosInstance.post("/create-payment-intent", { 
        amount: appointment.fee, 
        appointmentId: appointment.id || appointment._id 
      })
        .then(res => {
          setClientSecret(res.data.clientSecret);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch payment intent:", err);
          setLoading(false);
        });
    }
  }, [isOpen, appointment]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-teal-50 px-6 py-4 flex items-center justify-between border-b border-teal-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Payment Checkout</h3>
              <p className="text-xs text-gray-500 mt-1">Complete your appointment booking</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 font-medium">Consultation with</p>
                <p className="text-sm font-bold text-gray-900">{appointment.doctorName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">Amount Due</p>
                <p className="text-xl font-bold text-primary">৳{appointment.fee}</p>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-sm text-gray-500 font-medium">Initializing secure gateway...</p>
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  appointment={appointment} 
                  clientSecret={clientSecret} 
                  onPaymentSuccess={onPaymentSuccess} 
                />
              </Elements>
            ) : (
              <div className="text-center text-red-500 py-4 font-medium text-sm">
                Failed to initialize payment gateway. Please try again later.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
