"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { paymentsApi } from "@/lib/api/payments";
import { toast } from "sonner";
import { useState } from "react";

export default function PaymentConfirmationDialog({
  isOpen,
  onClose,
  paymentDetails,
  onSuccess
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      // Call the onSuccess function which handles the actual job completion
      await onSuccess();
      toast.success("Payment processed successfully!");
      // The onSuccess function should handle navigation after job completion
      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Please review your payment details before proceeding.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Job:</span>
            <span className="font-medium">{paymentDetails?.jobTitle || "N/A"}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">
              ${paymentDetails?.amount ? parseFloat(paymentDetails.amount).toFixed(2) : "0.00"}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service Fee:</span>
            <span className="font-medium">
              ${paymentDetails?.serviceFee ? parseFloat(paymentDetails.serviceFee).toFixed(2) : "0.00"}
            </span>
          </div>
          
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total:</span>
            <span>
              ${paymentDetails?.total ? parseFloat(paymentDetails.total).toFixed(2) : "0.00"}
            </span>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmPayment}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="mr-2">Processing...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </>
            ) : (
              "Confirm Payment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}