// frontend/Notes/src/components/auth/Logincheck.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosConfig"; // adjust path if needed

const Logincheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem("sid");
        if (!token) {
          navigate("/chooseRegister");
          return;
        }

        const response = await axiosInstance.post(
          "/api/auth/user/checkUser",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            // withCredentials: true, // enable only if your backend uses cookies/sessions
          }
        );

        if (response?.status === 200) navigate("/home");
        else navigate("/chooseRegister");
      } catch (error) {
        console.error("Login check failed:", error);
        navigate("/chooseRegister");
      }
    };

    checkLoginStatus();
  }, [navigate]);

  return <div>Checking login status...</div>;
};

export default Logincheck;
