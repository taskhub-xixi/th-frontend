import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paymentMethodsApi } from "@/lib/api/paymentMethods";

export function AddPaymentDialog({ open, onOpenChange, onSuccess, paymentMethodsCount }) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = () => {
    // Remove spaces from card number for validation
    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    // Validate card number (13-19 digits)
    if (!cleanCardNumber || cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      toast.error("Card number must be 13-19 digits");
      return false;
    }

    // Check if card number is all digits
    if (!/^\d+$/.test(cleanCardNumber)) {
      toast.error("Card number must contain only digits");
      return false;
    }

    // Validate card holder name
    if (!cardName || cardName.trim().length < 3) {
      toast.error("Cardholder name must be at least 3 characters");
      return false;
    }

    // Validate expiry date format
    if (!(expiryDate && expiryDate.includes("/"))) {
      toast.error("Expiry date must be in MM/YY format");
      return false;
    }

    const [month, year] = expiryDate.split("/");
    if (!(month && year) || month.length !== 2 || year.length !== 2) {
      toast.error("Expiry date must be in MM/YY format");
      return false;
    }

    const monthNum = Number.parseInt(month);
    if (monthNum < 1 || monthNum > 12) {
      toast.error("Month must be between 01 and 12");
      return false;
    }

    // Validate CVV (3-4 digits)
    if (!cvv || cvv.length < 3 || cvv.length > 4) {
      toast.error("CVV must be 3-4 digits");
      return false;
    }

    if (!/^\d+$/.test(cvv)) {
      toast.error("CVV must contain only digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const cardData = {
      card_holder: cardName,
      card_number: cardNumber.replace(/\s/g, ""),
      cvv,
      expiry_month: Number.parseInt(expiryDate.split("/")[0]),
      expiry_year: Number.parseInt(`20${expiryDate.split("/")[1]}`),
      is_default: paymentMethodsCount === 0,
      type: "card",
    };

    try {
      const response = await paymentMethodsApi.createPaymentMethod(cardData);

      if (response.success) {
        toast.success("Payment method added successfully", {
          description: "Your card has been saved successfully.",
        });

        setCardNumber("");
        setCardName("");
        setExpiryDate("");
        setCvv("");
        onOpenChange(false);

        // Re-fetch payment methods instead of using incomplete response
        if (onSuccess) {
          onSuccess(null);
        }
      } else {
        toast.error(response.message || "Failed to add payment method");
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add payment method. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>Add a new credit or debit card to your account</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              maxLength={19}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              required
              value={cardNumber}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              required
              value={cardName}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                maxLength={5}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                required
                value={expiryDate}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                maxLength={4}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                placeholder="123"
                required
                type="password"
                value={cvv}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Adding..." : "Add Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
