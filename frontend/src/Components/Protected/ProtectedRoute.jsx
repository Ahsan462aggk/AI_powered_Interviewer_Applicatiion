import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isSessionComplete = localStorage.getItem('completedSession'); // Check completion status

  if (!isSessionComplete) {
    return <Navigate to="/session" />; // Redirect to session if not completed
  }

  return children;
};

export default ProtectedRoute;
