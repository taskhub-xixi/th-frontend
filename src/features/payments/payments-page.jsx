"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  Wallet,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddPaymentDialog } from "@/components/payments/AddPaymentDialog";
import AddFundsDialog from "@/components/payments/AddFundsDialog";
import WithdrawFundsDialog from "@/components/payments/WithdrawFundsDialog";
import { paymentsApi } from "@/lib/api/payments";
import { paymentMethodsApi } from "@/lib/api/paymentMethods";
import { useAuth } from "@/context/AuthContext";

export default function PaymentsPage() {
  const { user } = useAuth();
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [withdrawFundsOpen, setWithdrawFundsOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [payments, setPayments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    thisMonth: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState({
    wallet: true,
    payments: true,
    paymentMethods: true,
  });
  const [error, setError] = useState(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      minimumFractionDigits: 0,
      style: "currency",
    }).format(amount || 0);
  };

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      const response = await paymentsApi.getWallet();
      setWallet(response.wallet || response);
    } catch (error) {
      console.error("Failed to load wallet data:", error);
    } finally {
      setLoading((prev) => ({ ...prev, wallet: false }));
    }
  };

  const fetchPayments = async () => {
    try {
      const paymentsResponse = await paymentsApi.getPayments();

      if (paymentsResponse && paymentsResponse.success) {
        const paymentsData = paymentsResponse.payments || [];
        setPayments(paymentsData);

        const totalSpent = paymentsData.reduce((sum, p) => sum + Number(p.amount || 0), 0);

        const now = new Date();
        const thisMonthSpent = paymentsData
          .filter((p) => {
            const date = new Date(p.created_at);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          })
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        setStats({
          activeJobs: paymentsData.filter((p) => p.status === "pending" || p.status === "completed")
            .length,
          thisMonth: thisMonthSpent,
          totalSpent,
        });
      } else {
        console.error("Payments response:", paymentsResponse);
        setError(paymentsResponse?.message || "Failed to fetch payments");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching payments");
    } finally {
      setLoading((prev) => ({ ...prev, payments: false }));
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const paymentMethodsResponse = await paymentMethodsApi.getAllPaymentMethods();

      if (paymentMethodsResponse && paymentMethodsResponse.success) {
        // Backend returns 'methods' key, not 'paymentMethods'
        setPaymentMethods(paymentMethodsResponse.methods || []);
      } else if (paymentMethodsResponse && Array.isArray(paymentMethodsResponse)) {
        setPaymentMethods(paymentMethodsResponse);
      } else {
        console.error("Payment methods response:", paymentMethodsResponse);
        setPaymentMethods([]);
      }
    } catch (err) {
      console.error("Failed to fetch payment methods:", err);
      setPaymentMethods([]);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    setLoading({
      wallet: true,
      payments: true,
      paymentMethods: true,
    });

    try {
      await Promise.all([
        fetchWalletData(),
        fetchPayments(),
        fetchPaymentMethods()
      ]);

      toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    }
  };

  // Listen for wallet update events
  useEffect(() => {
    const handleWalletUpdate = () => {
      fetchWalletData();
    };

    window.addEventListener("wallet-updated", handleWalletUpdate);
    return () => window.removeEventListener("wallet-updated", handleWalletUpdate);
  }, []);

  useEffect(() => {
    if (user) {
      fetchWalletData();
      fetchPayments();
      fetchPaymentMethods();
    }
  }, [user]);

  const getCardBrand = (firstDigit) => {
    if (!firstDigit) return "Unknown";
    if (firstDigit === "4") return "Visa";
    if (firstDigit === "5") return "Mastercard";
    if (firstDigit === "3") return "American Express";
    if (firstDigit === "2") return "Mastercard";
    if (firstDigit === "6") return "Discover";
    return "Unknown";
  };

  const formatCardForDisplay = (method) => {
    return {
      ...method,
      brand: getCardBrand(method.card_first_digit),
      last4: method.card_last_four ? method.card_last_four.slice(-4) : "****",
    };
  };

  const handleSetDefault = async (id) => {
    try {
      await paymentMethodsApi.updatePaymentMethod(id, { is_default: true });
      // Re-fetch to get latest data from server
      await fetchPaymentMethods();
      toast.success("Default payment method updated");
    } catch (error) {
      console.error("Error setting default payment method:", error);
      toast.error("Failed to set default payment method");
    }
  };

  const handleDelete = async (id) => {
    if (paymentMethods.length <= 1) {
      toast.error("You must have at least one payment method");
      return;
    }

    try {
      await paymentMethodsApi.deletePaymentMethod(id);
      const updatedMethods = paymentMethods.filter((m) => m.id !== id);
      setPaymentMethods(updatedMethods);
      toast.success("Payment method deleted");
      await fetchPaymentMethods();
    } catch {
      toast.error("Failed to delete payment method");
    }
  };

  const handleAddPaymentMethod = async () => {
    // Re-fetch payment methods after successful add
    await fetchPaymentMethods();
  };

  // Handle add funds
  const handleAddFunds = () => {
    setAddFundsOpen(true);
  };

  // Handle withdraw funds
  const handleWithdrawFunds = () => {
    setWithdrawFundsOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading.wallet || loading.payments) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Payments & Wallet</h1>
        <p className="text-muted-foreground">Manage your payments, wallet, and billing history</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <p className="text-red-600">{error}</p>
            </div>
            <Button
              onClick={refreshData}
              size="sm"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(wallet?.balance || 0)}
                </p>
              </div>
            </div>
            <Button
              className="w-full mt-2"
              onClick={handleWithdrawFunds}
              size="sm"
              variant="outline"
            >
              Withdraw Funds
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <ArrowDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total spent on job postings and fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <ArrowUp className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeJobs}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Jobs currently in progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Payment Methods & Transactions</h2>
          <p className="text-muted-foreground">Manage your payment methods and billing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            disabled={loading.wallet || loading.payments}
            onClick={refreshData}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading.wallet ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleAddFunds}>
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </div>
            <Button onClick={() => setAddPaymentOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No payment methods yet</p>
              <p className="text-sm">Add a payment method to get started</p>
            </div>
          ) : (
            paymentMethods.map((method) => {
              const displayMethod = formatCardForDisplay(method);
              return (
                <div
                  className="flex items-center justify-between p-4 border rounded-lg"
                  key={displayMethod.id}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                      {displayMethod.brand}
                    </div>
                    <div>
                      <p className="font-medium">
                        {displayMethod.brand} ending in {displayMethod.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {displayMethod.expiry_month}/{displayMethod.expiry_year}
                      </p>
                    </div>
                  </div>
                  {displayMethod.is_default && (
                    <Badge className="gap-1" variant="secondary">
                      <Check className="h-3 w-3" />
                      Default
                    </Badge>
                  )}
                  <div className="flex items-center gap-2">
                    {!displayMethod.is_default && (
                      <Button
                        onClick={() => handleSetDefault(displayMethod.id)}
                        size="sm"
                        variant="outline"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      disabled={displayMethod.is_default && paymentMethods.length === 1}
                      onClick={() => handleDelete(displayMethod.id)}
                      size="icon"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your recent payments and billing history</CardDescription>
            </div>
            <Button
              onClick={() => {
                fetchPayments();
              }}
              size="sm"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions yet</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  className="flex items-center justify-between p-3 border rounded-lg"
                  key={payment.id}
                >
                  <div className="flex-1">
                    <p className="font-medium">{payment.job_title || `Payment #${payment.id}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(payment.amount).toFixed(2)}</p>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddPaymentDialog
        open={addPaymentOpen}
        onOpenChange={setAddPaymentOpen}
        onSuccess={handleAddPaymentMethod}
        paymentMethodsCount={paymentMethods.length}
      />

      {/* Add Funds Dialog */}
      <AddFundsDialog
        open={addFundsOpen}
        onOpenChange={setAddFundsOpen}
        onAddFundsSuccess={refreshData}
      />

      {/* Withdraw Funds Dialog */}
      <WithdrawFundsDialog
        open={withdrawFundsOpen}
        onOpenChange={setWithdrawFundsOpen}
        currentBalance={wallet?.balance || 0}
        onWithdrawFundsSuccess={refreshData}
      />
    </div>
  );
}
