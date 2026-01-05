// src/features/payments/components/PaymentSuccess.jsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  User,
  Clock,
  ArrowLeft,
  Home,
  AlertCircle,
} from "lucide-react";
import { paymentsApi } from "@/lib/api/payments";

const PaymentSuccess = ({ paymentId }) => {
  const router = useRouter();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // If paymentId is a string "123" (default), we can't fetch real data
      // In a real implementation, we would fetch the actual payment
      if (paymentId === "123") {
        // Create mock payment data for demonstration
        setPayment({
          id: "123",
          job_title: "Sample Job Title",
          amount: 150.00,
          sender_name: "John Doe",
          sender_email: "john@example.com",
          receiver_name: "Jane Smith",
          receiver_email: "jane@example.com",
          status: "completed",
          created_at: new Date().toISOString(),
        });
        return;
      }

      const response = await paymentsApi.getPaymentById(paymentId);
      if (response.success) {
        setPayment(response.payment);
      } else {
        setError(response.message || "Failed to fetch payment details");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching payment details");
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    if (paymentId) {
      fetchPayment();
    }
  }, [paymentId, fetchPayment]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Card className="text-center">
          <CardContent className="py-12">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.back()}>Go Back</Button>
              <Button onClick={() => router.push("/dashboard")}>Go Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Your payment has been processed successfully</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-4">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Payment ID</p>
                <p className="text-gray-600 text-sm">{`#${payment?.id}`}</p>
              </div>
            </div>
            <Badge variant="secondary">
              {payment?.status?.charAt(0).toUpperCase() + payment?.status?.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Sender</h3>
              <div className="space-y-2">
                <p className="text-sm">{payment?.sender_name}</p>
                <p className="text-sm text-gray-600">{payment?.sender_email}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Receiver</h3>
              <div className="space-y-2">
                <p className="text-sm">{payment?.receiver_name}</p>
                <p className="text-sm text-gray-600">{payment?.receiver_email}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Job:</span>
              <span className="font-medium">{payment?.job_title}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="text-xl font-bold text-green-600">
                ${Number(payment?.amount)?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span>{payment?.created_at ? formatDate(payment.created_at) : "N/A"}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button className="flex-1" onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button className="flex-1" onClick={() => router.push("/dashboard")}>
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button className="flex-1" onClick={() => window.print()} variant="outline">
              Print Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
