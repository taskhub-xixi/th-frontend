import { useState } from "react";
import { useRouter } from "next/navigation";
import { paymentsApi } from "@/lib/api/payments";
import { toast } from "sonner";

export function usePaymentFlow() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const initiatePayment = (details) => {
    setPaymentDetails(details);
    setIsConfirmationOpen(true);
  };

  const processPayment = async () => {
    if (!paymentDetails) return;

    try {
      // Process the payment using the payment details
      const response = await paymentsApi.createPayment(paymentDetails);
      
      if (response.success) {
        toast.success("Payment processed successfully!");
        // Redirect to success page with payment ID
        router.push(`/dashboard/payments/success/${response.paymentId || '123'}`);
        return response;
      } else {
        throw new Error(response.message || "Failed to process payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
      throw error;
    }
  };

  const closeConfirmation = () => {
    setIsConfirmationOpen(false);
    setPaymentDetails(null);
  };

  return {
    isConfirmationOpen,
    paymentDetails,
    initiatePayment,
    processPayment,
    closeConfirmation
  };
}