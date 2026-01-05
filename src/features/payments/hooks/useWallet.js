/**
 * Custom hooks for payments feature
 */

import { useState, useEffect, useCallback } from "react";
import { paymentsApi } from "@/lib/api/payments";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook to fetch and manage wallet
 */
export function useWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user, fetchWallet]);

  // Listen for wallet update events (e.g., after job completion)
  useEffect(() => {
    const handleWalletUpdate = () => {
      if (user) {
        fetchWallet();
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
  }, [user, fetchWallet]);

  return { wallet, loading, error, refetch: fetchWallet };
}

/**
 * Hook to fetch and manage transactions
 */
export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user, fetchTransactions]);

  // Listen for wallet update events to refresh transactions
  useEffect(() => {
    const handleWalletUpdate = () => {
      if (user) {
        fetchTransactions();
      }
    };

    window.addEventListener("wallet-updated", handleWalletUpdate);

    return () => {
      window.removeEventListener("wallet-updated", handleWalletUpdate);
    };
  }, [user, fetchTransactions]);

  return { transactions, loading, error, refetch: fetchTransactions };
}

/**
 * Hook to fetch and manage payment methods
 */
export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);

  const addPaymentMethod = useCallback((newMethod) => {
    setPaymentMethods((methods) => [...methods, newMethod]);
  }, []);

  const setDefaultPaymentMethod = useCallback((methodId) => {
    setPaymentMethods((methods) => methods.map((m) => ({ ...m, isDefault: m.id === methodId })));
  }, []);

  const removePaymentMethod = useCallback((methodId) => {
    setPaymentMethods((methods) => methods.filter((m) => m.id !== methodId));
  }, []);

  return {
    paymentMethods,
    addPaymentMethod,
    setDefaultPaymentMethod,
    removePaymentMethod,
  };
}

/**
 * Hook to fetch payments history
 */
export function usePayments() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentsApi.getPayments();

      if (response.success) {
        setPayments(response.payments || []);
      } else {
        setError(response.message || "Failed to fetch payments");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user, fetchPayments]);

  return { payments, loading, error, refetch: fetchPayments };
}
