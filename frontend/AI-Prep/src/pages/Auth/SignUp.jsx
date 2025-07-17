import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper"; // Import the email validation function
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [initials, setInitials] = useState("AI"); // Default to "AI"

  const{ updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  // Generate initials from full name
  useEffect(() => {
    if (fullName.trim()) {
      const names = fullName.split(' ');
      let newInitials = '';
      if (names.length > 0) newInitials += names[0][0].toUpperCase();
      if (names.length > 1) newInitials += names[names.length - 1][0].toUpperCase();
      setInitials(newInitials || 'AI');
    } else {
      setInitials('AI');
    }
  }, [fullName]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    if(!fullName){
      setError("Full name cannot be empty.");
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address.");
      return;
    }

    if(!password){
      setError("Password cannot be empty.");
      return;
    }
    setError("");
    //signup API call
    
    try {
      //upload image if present
      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token } = response.data;

      if(token){
        localStorage.setItem ("token",token);
        updateUser(response.data);
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
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us to unlock personalized interview preparation with AI.
      </p>

      <form onSubmit={handleSignUp}>
        {/* Dynamic Initials Logo */}
        <div className="mb-4 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-300">
            <div className="text-2xl font-bold text-orange-500">{initials}</div>
          </div>
        </div>

        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label="Full Name"
          placeholder="John Doe"
          type="text"
        />

        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="email"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 w-full"
        >
          SIGN UP
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already have an account?{" "}
          <button
            className="font-medium text-orange-500 hover:text-orange-600 underline cursor-pointer"
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;