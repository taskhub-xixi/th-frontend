"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paymentsApi } from "@/lib/api/payments";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AddFundsDialog({ open, onOpenChange, onAddFundsSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddFunds = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const response = await paymentsApi.addFunds({
        amount: parseFloat(amount),
        payment_method: "default", // This would typically come from selected payment method
      });

      if (response.success) {
        toast.success(`$${amount} added to your wallet successfully!`);
        onOpenChange(false);
        setAmount(""); // Reset the amount field

        // Call the success callback to refresh data
        if (onAddFundsSuccess) {
          onAddFundsSuccess();
        }
      } else {
        throw new Error(response.message || "Failed to add funds");
      }
    } catch (error) {
      console.error("Add funds error:", error);
      toast.error(error.message || "Failed to add funds to wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogDescription>
            Enter the amount you want to add to your wallet
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                className="mt-1"
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Minimum deposit amount: $1.00</p>
              <p className="mt-1">Your funds will be available immediately after processing.</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddFunds}
            disabled={loading || !amount}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Add $${amount || '0.00'}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}