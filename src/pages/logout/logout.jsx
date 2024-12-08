import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../../api/api";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call the backend logout route
        await apiClient.post(
          "/users/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        // Clear user session
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");

        // Display success message
        toast.success("Logged out successfully!");

        // Redirect to login page
        navigate("/login");
      } catch (error) {
        console.error("Error during logout:", error);
        toast.error("An error occurred during logout. Please try again.");
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div>
      <h2>Logging you out...</h2>
    </div>
  );
};

export default Logout;
