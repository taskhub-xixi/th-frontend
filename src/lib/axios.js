import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const date = config.date;
    return config;
  },
  (erorr) => {
    console.log(error);
    return erorr;
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response.status;

    console.log(status);

    if (status === 401) {
      // handle untuk authorized
      window.location.href = "/login";
    } else if (status === 403) {
      console.log("acces denied ");
    } else if (status === 400) {
      console.log("acces denied ");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
