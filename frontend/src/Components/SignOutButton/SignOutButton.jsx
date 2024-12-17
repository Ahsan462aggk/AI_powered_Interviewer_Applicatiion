import React from 'react';
import { LogOut } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignOutButton = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Make the sign-out request to the API
      const response = await axios.post('http://localhost:8089/users/logout');

      if (response.status === 200) {
        // Show success toast
        toast.success('Signed out successfully!');
        // Clear any stored tokens if needed (e.g., localStorage)
        localStorage.removeItem('userToken');
        // Navigate to the login page
        navigate('/login');
      }
    } catch (error) {
      // Show error toast if the sign-out fails
      toast.error('Failed to sign out. Please try again.');
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="fixed bottom-14 left-3 z-20">
      <button 
        onClick={handleSignOut}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg backdrop-blur-md transition-all duration-300 text-white shadow-lg group"
      >
        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default SignOutButton;
