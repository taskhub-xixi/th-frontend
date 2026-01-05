/**
 * Utility functions for payments feature
 */

/**
 * Format payment status to display-friendly text
 */
export function formatPaymentStatus(status) {
  const statusMap = {
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    refunded: "Refunded",
  };

  return statusMap[status] || status;
}

/**
 * Get color class for payment status badge
 */
export function getPaymentStatusColor(status) {
  const colorMap = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  return colorMap[status] || "bg-gray-100 text-gray-800";
}

/**
 * Format transaction type
 */
export function formatTransactionType(type) {
  const typeMap = {
    credit: "Credit",
    debit: "Debit",
    payment: "Payment",
    refund: "Refund",
    withdrawal: "Withdrawal",
    deposit: "Deposit",
  };

  return typeMap[type] || type;
}

/**
 * Format transaction description
 */
export function formatTransactionDescription(transaction) {
  if (transaction.description) return transaction.description;

  if (transaction.reference_type) {
    const typeDescriptions = {
      job_payment: `Payment for ${transaction.job_title || "job"}`,
      refund: `Refund for ${transaction.job_title || "job"}`,
      add_funds: "Wallet top-up",
      withdraw_funds: "Withdrawal",
    };

    return typeDescriptions[transaction.reference_type] || "Transaction";
  }

  return "Transaction";
}

/**
 * Calculate total spent in current month
 */
export function calculateMonthSpent(transactions) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions
    .filter((t) => {
      const date = new Date(t.created_at);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        (t.type === "debit" || t.type === "payment" || t.reference_type === "job_payment")
      );
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Calculate total earned in current month (for taskers)
 */
export function calculateMonthEarned(transactions) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions
    .filter((t) => {
      const date = new Date(t.created_at);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        (t.type === "credit" || t.reference_type === "job_payment")
      );
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

/**
 * Get active jobs count (jobs with ongoing payments)
 */
export function getActiveJobsCount(payments) {
  return payments.filter((p) => p.status === "completed" || p.status === "in_progress").length;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount) || 0);
}

/**
 * Check if user can withdraw funds
 */
export function canWithdrawFunds(wallet, amount) {
  if (!wallet) return { canWithdraw: false, reason: "Wallet not loaded" };
  const balance = Number(wallet.balance || 0);
  const withdrawalAmount = Number(amount || 0);

  if (withdrawalAmount <= 0) {
    return { canWithdraw: false, reason: "Amount must be greater than 0" };
  }

  if (withdrawalAmount > balance) {
    return { canWithdraw: false, reason: "Insufficient balance" };
  }

  return { canWithdraw: true, reason: null };
}

/**
 * Calculate available balance after withdrawal
 */
export function calculateAvailableBalance(wallet, amount) {
  if (!wallet) return 0;
  const balance = Number(wallet.balance || 0);
  const withdrawalAmount = Number(amount || 0);
  return Math.max(0, balance - withdrawalAmount);
}

/**
 * Get transaction icon based on type
 */
export function getTransactionIcon(type) {
  const iconMap = {
    credit: "plus",
    debit: "minus",
    payment: "credit-card",
    refund: "rotate-ccw",
    withdrawal: "download",
    deposit: "upload",
  };

  return iconMap[type] || "circle";
}

/**
 * Sort transactions by date
 */
export function sortTransactionsByDate(transactions, order = "desc") {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);

    if (order === "asc") {
      return dateA - dateB;
    }

    return dateB - dateA;
  });
}

/**
 * Get payment statistics
 */
export function getPaymentStatistics(payments) {
  const stats = {
    total: payments.length,
    completed: 0,
    pending: 0,
    failed: 0,
    refunded: 0,
    totalAmount: 0,
  };

  payments.forEach((p) => {
    if (stats[p.status] !== undefined) {
      stats[p.status]++;
    }

    if (p.status === "completed" || p.status === "pending") {
      stats.totalAmount += Number(p.amount || 0);
    }
  });

  return stats;
}
