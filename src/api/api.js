import axios from "axios";

// Shift this variable to an environment file in production
export const BASE_API_URL = 'oamkino-backend-etczdxgkbth0gvfg.northeurope-01.azurewebsites.net';

export const apiClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("authToken");

    // If token exists, attach it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config; // Return the modified config
  },
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default apiClient;
