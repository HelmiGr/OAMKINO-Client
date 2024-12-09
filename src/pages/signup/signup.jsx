import React, { useState } from "react";
import "../../styles/signup/auth.css";
import apiClient from "../../api/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const signup = async (email, password) => {
    await apiClient.post("/users/registration", {
      email,
      password,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    toast.promise(signup(email, password), {
      loading: "Signing up...",
      success: () => {
        navigate("/login");
        return "Sign up successful!";
      },
      error: (d) => {
        return d.response?.data?.error || "An error occurred.";
      },
    });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSignup} className="form">
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        <button type="submit">Sign Up</button>
        <i>
          **Password must contain at least one capital letter and one number
        </i>
      </form>
    </div>
  );
};

export default Signup;
