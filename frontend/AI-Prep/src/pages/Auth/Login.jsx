import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper"; // Import the email validation function
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const{ updateUser } = useContext(UserContext)
  const navigate = useNavigate();

//handle logon form submission
  
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    setError(""); // Clear previous errors

    // login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data)
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 bg-white rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px]">
          Please enter your credentials to continue
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            placeholder="samar@example.com"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Min 8 characters"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
        >
          LOGIN
        </button>

        <p className="text-[13px] text-slate-800 text-center mt-3">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-medium text-orange-500 hover:text-orange-600 underline cursor-pointer"
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;