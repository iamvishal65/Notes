import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logincheck = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem("sid");
        if (!token) {
          navigate("/chooseRegister");
          return;
        }

        const response = await axios.post(
          `${API_URL}/api/auth/user/checkUser`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.status === 200) navigate("/home");
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

export default Logincheck; // ✅ Make sure you have default export
