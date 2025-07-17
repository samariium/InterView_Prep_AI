import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-5">
            {label && (
                <label className="block text-[15px] font-medium text-slate-800 mb-2">{label}</label>
            )}
            <div className="relative">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    className="w-full bg-[#f7fafc] border border-[#e2e8f0] rounded-lg py-3 px-4 pr-12 text-[15px] outline-none placeholder:text-slate-400 transition focus:border-primary"
                    value={value}
                    onChange={onChange}
                />
                {type === "password" && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? (
                            <FaRegEye
                                size={22}
                                className="text-primary"
                                onClick={toggleShowPassword}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={22}
                                className="text-slate-400"
                                onClick={toggleShowPassword}
                            />
                        )}
                    </span>
                )}
            </div>
        </div>
    );
};

export default Input;