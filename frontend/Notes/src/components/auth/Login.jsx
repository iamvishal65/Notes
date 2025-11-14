// src/components/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig"; // <-- adjust path if needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  function goRegister() {
    navigate("/register");
  }

  const isFormValid = email.trim() && password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // axiosInstance already has baseURL set from REACT_APP_API_URL
      const res = await axiosInstance.post("/api/auth/user/login", {
        email,
        password,
      });

      console.log("Login succeeded:", res.data);

      const token = res?.data?.token;
      if (token) {
        localStorage.setItem("sid", token); // Save token
        navigate("/home"); // Redirect to home
      } else {
        setError("Login failed: no token returned");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Prefer backend message if available
      if (err.response?.data?.message) setError(err.response.data.message);
      else if (err.message) setError("Network error");
      else setError("Login failed");
    }
  };

  return (
    <div>
      <button onClick={goRegister} className="bg-blue-500">Register</button>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-6 bg-white shadow-md rounded"
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>

          {error && <p className="text-red-500">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={!isFormValid}
            className={`${
              isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            } text-white py-2 rounded`}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
