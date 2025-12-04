import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Component to protect routes requiring authentication
export default function ProtectedRoute({ children }) {
  // Check the Redux state for the token
  const token = useSelector((state) => state.auth.token);
  
  // If no token is found, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the token is present, render the child component (e.g., <VendorPage />)
  return children;
}