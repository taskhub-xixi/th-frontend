export const handleApiError = (error, defaultMessage = "Terjadi kesalahan") => {
  const status = error.response?.status;
  const message = error.response?.data?.message || defaultMessage;

  if (status === 401) {
    return { message: "Email atau password salah", toastMessage: "Email atau password salah" };
  } else if (status === 400) {
    return { message, toastMessage: message };
  } else if (status === 429) {
    return { message: "Terlalu banyak percobaan login. Coba lagi nanti.", toastMessage: "Rate limit exceeded" };
  } else if (status >= 500) {
    return { message: "Server error, coba lagi nanti", toastMessage: "Server error" };
  } else if (error.response) {
    return { message, toastMessage: message };
  } else {
    return { message: "Tidak dapat terhubung ke server", toastMessage: "Periksa koneksi internet Anda" };
  }
};