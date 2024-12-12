import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import "../../styles/signup/auth.css"; // Ensure you have the correct path to your app.css file
import api from "../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    toast.promise(
      api.post("/users/login", { email, password }).then((res) => {
        const d = res.data;
        login(d.token, {
          id: d.userId,
          email: d.email,
        });
        navigate("/showtimes");
      }),
      {
        loading: "Logging in...",
        success: "Login successful!",
        error: (d) => {
          return d.response.data.error ?? "Login failed!";
        },
      }
    );
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleLogin}>
        <h2 className="form-title">Login</h2>
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
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <VisibilityOff className="icon" />
            ) : (
              <Visibility className="icon" />
            )}
          </span>
        </div>
        <button className="btn btn-primary" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
