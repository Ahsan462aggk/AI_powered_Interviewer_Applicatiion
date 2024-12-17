import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Use Link for navigation
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState(''); // Changed from email to username
  const [password, setPassword] = useState('');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Start loading

    try {
      // Create URL-encoded data
      const params = new URLSearchParams();
      params.append('grant_type', 'password'); // Added based on backend requirements
      params.append('username', username); // Changed from email to username
      params.append('password', password);
      params.append('scope', ''); // Set according to backend requirements
      params.append('client_id', ''); // Set according to backend requirements
      params.append('client_secret', ''); // Set according to backend requirements

      // Make the POST request with Axios
      const response = await axios.post(
        'http://localhost:8089/users/login', // Backend API endpoint
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          withCredentials: true,
        }
      );

      // Handle the response as needed
      console.log('Login successful:', response.data);

      // Show success toast
      toast.success('Login successful!');

      // Navigate to home page after a short delay to allow the toast to show
      setTimeout(() => {
        navigate('/categories');
      }, 1500);
    } catch (error) {
      // Handle errors (e.g., invalid credentials)
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      console.error('Login error:', error);
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="font-sans min-h-screen relative p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-3xl animate-blob -top-48 -right-48"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-red-600/30 blur-3xl animate-blob animation-delay-2000 top-1/2 right-1/3"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/30 blur-3xl animate-blob animation-delay-4000 -bottom-48 -left-48"></div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto relative z-10 md:h-[calc(100vh-2rem)] flex items-center">
        <div className="w-full grid md:grid-cols-3 items-center backdrop-blur-xl bg-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden border border-white/20">
          {/* Left Panel */}
          <div className="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-gradient-to-br from-purple-900/90 to-red-600/90 lg:px-8 px-4 py-12 relative overflow-hidden">
            {/* Animated accent circles */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-red-500/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>

            <div className="relative">
              <h4 className="text-white text-xl font-semibold">Welcome Back!</h4>
              <p className="text-gray-200 mt-3 leading-relaxed">
                Continue your journey to mastering job interviews with our AI-powered coach.
              </p>
            </div>
            <div className="relative">
              <h4 className="text-white text-xl font-semibold">Seamless Login Experience</h4>
              <p className="text-gray-200 mt-3 leading-relaxed">
                Secure login with instant access to personalized interview preparation.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form
            className="md:col-span-2 w-full py-8 px-6 sm:px-16"
            onSubmit={handleLogin}
          >
            <div className="mb-8">
              <h3 className="text-white text-3xl font-bold">Login to Your Account</h3>
            </div>

            <div className="space-y-6">
              {/* Username Field */}
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <label className="text-gray-200 text-sm mb-2 block">Username</label>
                <div className="relative flex items-center group">
                  <input
                    name="username" // Changed name
                    type="text" // Changed type to text if username is not an email
                    required
                    value={username} // Changed value
                    onChange={(e) => setUsername(e.target.value)} // Changed setter
                    className="text-white bg-white/10 border border-gray-400/20 w-full text-sm px-4 py-3 rounded-lg outline-none transition-all duration-300 focus:border-red-400 focus:bg-white/20 backdrop-blur-xl"
                    placeholder="Enter username" // Changed placeholder
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#fff"
                    stroke="#fff"
                    className="w-4 h-4 absolute right-4 opacity-50 group-hover:opacity-100 transition-opacity"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7l-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" />
                  </svg>
                </div>
              </div>

              {/* Password Field */}
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <label className="text-gray-200 text-sm mb-2 block">Password</label>
                <div className="relative flex items-center group">
                  <input
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-white bg-white/10 border border-gray-400/20 w-full text-sm px-4 py-3 rounded-lg outline-none transition-all duration-300 focus:border-red-400 focus:bg-white/20 backdrop-blur-xl"
                    placeholder="Enter password"
                  />
                  <svg
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#fff"
                    stroke="#fff"
                    className="w-4 h-4 absolute right-4 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer"
                    viewBox="0 0 24 24"
                  >
                    {isPasswordVisible ? (
                      <path d="M12 19c-5 0-9-5-9-7s4-7 9-7 9 5 9 7-4 7-9 7zm0-14c-4.4 0-8 4-8 7s3.6 7 8 7 8-4 8-7-3.6-7-8-7zm0 10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
                    ) : (
                      <path d="M12 19c-5 0-9-5-9-7s4-7 9-7 9 5 9 7-4 7-9 7zm0-14c-4.4 0-8 4-8 7s3.6 7 8 7 8-4 8-7-3.6-7-8-7zm0 10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
                    )}
                  </svg>
                </div>
              </div>
            </div>

            <div className="!mt-12">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            <p className="text-gray-300 text-sm mt-6 text-center">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors duration-300 ml-1"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
