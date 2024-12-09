import React, { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/api";
import toast from "react-hot-toast";

const Delete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDeleteAccount = useCallback(async () => {
    try {
      const response = await apiClient.delete(`/users/delete/${id}`);

      if (response.status === 200) {
        toast.success("Your account has been deleted successfully.");
        localStorage.removeItem("authToken");
        navigate("/signup");
      } else {
        toast.error(response.data?.message || "Unable to delete account.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while deleting your account. Please try again."
      );
    }
  }, [id, navigate]);

  useEffect(() => {
    const handleDeleteWithConfirmation = async () => {
      const confirmed = window.confirm(
        "Are you sure you want to delete your account?"
      );

      if (confirmed) {
        await handleDeleteAccount();
      } else {
        toast.info("Account deletion cancelled.");
        navigate(-1);
      }
    };

    handleDeleteWithConfirmation();
  }, [handleDeleteAccount, navigate]);

  return (
    <div>
      <h2>Processing account deletion...</h2>
    </div>
  );
};

export default Delete;
