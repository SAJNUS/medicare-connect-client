import { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

const CheckoutForm = ({ appointment, clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    setProcessing(true);

    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message);
      setProcessing(false);
      return;
    } else {
      setError("");
    }

    // Confirm Payment
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          email: appointment.patientEmail,
          name: appointment.patientName,
        },
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      try {
        // Save to payments history
        const paymentPayload = {
          appointmentId: appointment.id || appointment._id,
          patientEmail: appointment.patientEmail,
          doctorEmail: appointment.doctorEmail,
          doctorName: appointment.doctorName,
          type: appointment.type || "Consultation",
          time: appointment.time,
          amount: appointment.fee,
          transactionId: paymentIntent.id,
          date: new Date().toISOString()
        };

        await axiosInstance.post("http://localhost:5001/payments", paymentPayload);

        // Update appointment status
        await axiosInstance.patch(`http://localhost:5001/appointments/${appointment.id || appointment._id}/payment`, {
          paymentStatus: "paid",
          transactionId: paymentIntent.id
        });

        toast.success("Payment completed successfully!");
        onPaymentSuccess(paymentIntent.id);
      } catch (dbError) {
        console.error("Database sync error after payment:", dbError);
        toast.error("Payment successful but database update failed. Please contact support.");
      }
    }
    
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="p-4 border border-gray-200 rounded-lg mb-4 bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full bg-primary hover:bg-[#0b6e66] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {processing ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : `Pay ৳${appointment.fee}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
