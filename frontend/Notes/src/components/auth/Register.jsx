// src/components/auth/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig"; // adjust path if needed

const Register = () => {
  const [username, setUsername] = useState(""); // change to `name` if backend expects `name`
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isFormValid = username.trim() && email.trim() && password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axiosInstance.post("/api/auth/user/register", {
        username,
        email,
        password,
      });

      console.log("Registration succeeded:", res.data);

      const token = res?.data?.token;
      if (token) {
        localStorage.setItem("sid", token);
        navigate("/home");
      } else {
        setError("Registration succeeded but no token returned.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response?.data?.message) setError(err.response.data.message);
      else if (err.message) setError("Network error");
      else setError("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 bg-white shadow-md rounded"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
            isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          } text-white py-2 rounded`}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
