// src/features/payments/components/WalletManagement.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  PlusCircle,
  Download,
  History,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { paymentsApi } from "@/lib/api/payments";
import { useAuth } from "@/context/AuthContext";

const WalletManagement = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentsApi.getWallet();

      if (response.success) {
        setWallet(response.wallet);
      } else {
        setError(response.message || "Failed to fetch wallet");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching wallet");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      setError(null);

      const response = await paymentsApi.getTransactions();

      if (response.success) {
        setTransactions(response.transactions || []);
      } else {
        setError(response.message || "Failed to fetch transactions");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching transactions");
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchWallet();
      fetchTransactions();
    }
  }, [user, fetchWallet, fetchTransactions]);

  // Listen for wallet update events (e.g., after job completion)
  useEffect(() => {
    const handleWalletUpdate = () => {
      if (user) {
        fetchWallet();
        fetchTransactions();
      }
    };

    window.addEventListener("wallet-updated", handleWalletUpdate);

    // Also check for localStorage flag (backup method)
    const checkLocalStorage = setInterval(() => {
      const needsRefresh = localStorage.getItem("wallet_needs_refresh");
      if (needsRefresh) {
        localStorage.removeItem("wallet_needs_refresh");
        handleWalletUpdate();
      }
    }, 2000);

    return () => {
      window.removeEventListener("wallet-updated", handleWalletUpdate);
      clearInterval(checkLocalStorage);
    };
  }, [user, fetchWallet, fetchTransactions]);

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fundAmount = Number.parseFloat(amount);
      if (isNaN(fundAmount) || fundAmount <= 0) {
        setError("Please enter a valid amount");
        setLoading(false);
        return;
      }

      const response = await paymentsApi.addFunds({ amount: fundAmount });

      if (response.success) {
        setWallet(response.wallet);
        setAmount("");
        fetchTransactions();
      } else {
        setError(response.message || "Failed to add funds");
      }
    } catch (err) {
      setError(err.message || "An error occurred while adding funds");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawFunds = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const withdrawAmount = Number.parseFloat(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        setError("Please enter a valid amount");
        setLoading(false);
        return;
      }

      if (wallet && withdrawAmount > wallet.balance) {
        setError("Insufficient balance");
        setLoading(false);
        return;
      }

      const response = await paymentsApi.withdrawFunds({
        amount: withdrawAmount,
      });

      if (response.success) {
        setWallet(response.wallet);
        setAmount("");
        fetchTransactions();
      } else {
        setError(response.message || "Failed to withdraw funds");
      }
    } catch (err) {
      setError(err.message || "An error occurred while withdrawing funds");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      currency: "USD",
      style: "currency",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && !wallet) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card className="p-6" key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Wallet Management</h1>
        <p className="text-gray-600 mt-2">Manage your funds and view transaction history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Your current wallet balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Wallet className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-3xl font-bold text-green-600">
                  {wallet ? formatCurrency(wallet.balance) : "$0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Currency</span>
              <span>{wallet?.currency || "USD"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transactions</span>
              <span>{transactions.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="add-funds">Add Funds</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-6" value="overview">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Transaction History</CardTitle>
                <Button onClick={fetchTransactions} size="sm" variant="outline">
                  <History className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <CardDescription>Recent transactions in your wallet</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTransactions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <p className="text-red-600">{error}</p>
                  </div>
                  <Button className="mt-2" onClick={fetchTransactions} size="sm" variant="outline">
                    Retry
                  </Button>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Your transaction history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      key={transaction.id}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <PlusCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Download className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.description || transaction.reference_type}
                            {transaction.job_title && (
                              <div className="text-sm text-gray-500">
                                Job: {transaction.job_title}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-medium ${
                            transaction.type === "credit" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <Badge className="text-xs" variant="outline">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="mt-6" value="add-funds">
          <Card>
            <CardHeader>
              <CardTitle>Add Funds to Wallet</CardTitle>
              <CardDescription>
                Add money to your wallet using various payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleAddFunds}>
                {error && activeTab === "add-funds" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="add-amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      className="pl-8"
                      id="add-amount"
                      min="0.01"
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      step="0.01"
                      type="number"
                      value={amount}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <div className="flex items-center space-x-4 p-3 border rounded-md bg-gray-50">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    <span>Credit/Debit Card</span>
                  </div>
                </div>

                <Button className="w-full" disabled={loading} type="submit">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Funds
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="mt-6" value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>
                Withdraw money from your wallet to your bank account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleWithdrawFunds}>
                {error && activeTab === "withdraw" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      className="pl-8"
                      id="withdraw-amount"
                      max={wallet?.balance || 0}
                      min="0.01"
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      step="0.01"
                      type="number"
                      value={amount}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Available balance: {wallet ? formatCurrency(wallet.balance) : "$0.00"}
                </div>

                <Button className="w-full" disabled={loading} type="submit" variant="destructive">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Withdraw Funds
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WalletManagement;
