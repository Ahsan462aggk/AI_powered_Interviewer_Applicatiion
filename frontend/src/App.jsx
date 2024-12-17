import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Register from "./Components/auth/Signup";
import Login from "./Components/auth/Login";
import Session from "./Pages/Session";
import CategoriesList from "./Components/CategoriesList/CategoriesList";
import FinalFeedbackPage from "./Pages/FinalFeedbackPage";
import SignOutButton from "./Components/SignOutButton/SignOutButton";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./Components/Protected/ProtectedRoute";
import ThankYouPage from "./Pages/Thankyou";

// Protected Route Component

const App = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/thanks';

  return (
    <div className="relative min-h-screen">
      {!isAuthRoute && <SignOutButton />}

      <Routes>
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Change default redirect to /thanks */}
        <Route path="/" element={<Navigate to="/thanks" replace />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/session" element={<Session />} />
        <Route path="/thanks" element={<ThankYouPage />} />
        
        <Route
          path="/final-feedback"
          element={
            <ProtectedRoute>
              <FinalFeedbackPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

// Wrap the App component in the Router
const WrappedApp = () => (
  <Router>
    <App />
    <ToastContainer autoClose={2000} position="top-right" />
  </Router>
);

export default WrappedApp;
