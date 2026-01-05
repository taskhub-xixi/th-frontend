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

export default function WithdrawFundsDialog({ open, onOpenChange, currentBalance, onWithdrawFundsSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdrawFunds = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount > currentBalance) {
      toast.error("Insufficient funds. Please enter an amount less than your current balance.");
      return;
    }

    setLoading(true);
    try {
      const response = await paymentsApi.withdrawFunds({
        amount: withdrawalAmount,
        method: "bank_transfer", // This would typically come from selected withdrawal method
      });

      if (response.success) {
        toast.success(`$${amount} withdrawn from your wallet successfully!`);
        onOpenChange(false);
        setAmount(""); // Reset the amount field

        // Call the success callback to refresh data
        if (onWithdrawFundsSuccess) {
          onWithdrawFundsSuccess();
        }
      } else {
        throw new Error(response.message || "Failed to withdraw funds");
      }
    } catch (error) {
      console.error("Withdraw funds error:", error);
      toast.error(error.message || "Failed to withdraw funds from wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Funds from Wallet</DialogTitle>
          <DialogDescription>
            Enter the amount you want to withdraw from your wallet
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
              <p>Current balance: <span className="font-semibold">${typeof currentBalance === 'number' ? currentBalance.toFixed(2) : '0.00'}</span></p>
              <p className="mt-2">Minimum withdrawal amount: $10.00</p>
              <p className="mt-1">Withdrawal processing time: 3-5 business days.</p>
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
            onClick={handleWithdrawFunds}
            disabled={loading || !amount}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Withdraw $${amount || '0.00'}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}