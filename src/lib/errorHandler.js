import { toast } from "sonner";

export const handleApiError = (error, defaultMessage = "Terjadi kesalahan") => {
  const status = error.response?.status;
  const message = error.response?.data?.message || defaultMessage;

  if (status === 401) {
    return {
      message: "Email atau password salah",
      toastMessage: "Email atau password salah",
    };
  }
  if (status === 400) {
    return { message, toastMessage: message };
  }
  if (status === 429) {
    return {
      message: "Terlalu banyak percobaan login. Coba lagi nanti.",
      toastMessage: "Rate limit exceeded",
    };
  }
  if (status >= 500) {
    return {
      message: "Server error, coba lagi nanti",
      toastMessage: "Server error",
    };
  }
  if (error.response) {
    return { message, toastMessage: message };
  }
  return {
    message: "Tidak dapat terhubung ke server",
    toastMessage: "Periksa koneksi internet Anda",
  };
};

// Enhanced error handler with toast notification
// Simple version with Sonner's built-in description
export const showErrorToast = (error, defaultMessage = "An error occurred") => {
  const errorInfo = handleApiError(error, defaultMessage);

  toast.error("Error", {
    action: {
      label: "Tutup",
      onClick: () => {},
    },
    description: errorInfo.toastMessage,
    duration: 5000,
  });

  return errorInfo;
};
