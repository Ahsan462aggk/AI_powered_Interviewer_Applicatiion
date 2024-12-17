import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8089/users/register", formData);
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="font-[sans-serif] min-h-screen relative p-4">
      {/* Main content */}
      <div className="max-w-4xl mx-auto relative z-10 md:h-[calc(100vh-2rem)] flex items-center">
        <div className="w-full grid md:grid-cols-3 items-center backdrop-blur-xl bg-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden border border-white/20">
          {/* Left Panel */}
          <div className="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-gradient-to-br from-purple-900/90 to-red-600/90 lg:px-8 px-4 py-12 relative overflow-hidden">
            <div className="relative">
              <h4 className="text-white text-xl font-semibold">Join Our AI-Powered Interview Coach</h4>
              <p className="text-gray-200 mt-3 leading-relaxed">Unlock your potential and master your interviews with real-time coaching powered by AI.</p>
            </div>
          </div>

          {/* Form Section */}
          <form className="md:col-span-2 w-full py-8 px-6 sm:px-16" onSubmit={handleSubmit}>
            <div className="mb-8">
              <h3 className="text-white text-3xl font-bold">Create Your Account</h3>
            </div>

            <div className="space-y-6">
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <label className="text-gray-200 text-sm mb-2 block">Username</label>
                <div className="relative flex items-center group">
                  <input
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="text-white bg-white/10 border border-gray-400/20 w-full text-sm px-4 py-3 rounded-lg outline-none transition-all duration-300 focus:border-teal-400 focus:bg-white/20 backdrop-blur-xl"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <label className="text-gray-200 text-sm mb-2 block">Email Address</label>
                <div className="relative flex items-center group">
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="text-white bg-white/10 border border-gray-400/20 w-full text-sm px-4 py-3 rounded-lg outline-none transition-all duration-300 focus:border-teal-400 focus:bg-white/20 backdrop-blur-xl"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <label className="text-gray-200 text-sm mb-2 block">Create a Password</label>
                <div className="relative flex items-center group">
                  <input
                    name="password"
                    type={isPasswordVisible ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="text-white bg-white/10 border border-gray-400/20 w-full text-sm px-4 py-3 rounded-lg outline-none transition-all duration-300 focus:border-teal-400 focus:bg-white/20 backdrop-blur-xl"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
className="w-full py-3 px-4 text-sm mt-4 font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
