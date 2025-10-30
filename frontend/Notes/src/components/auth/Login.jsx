import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  function goRegister(){
    navigate('/register');
  }

  const isFormValid = email.trim() && password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/auth/user/login`, {
        email,
        password,
      });

      console.log("Login succeeded:", res.data);

      if (res.data.token) {
        localStorage.setItem("sid", res.data.token); // Save token
        navigate("/home"); // Redirect to home
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError("Network error");
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
