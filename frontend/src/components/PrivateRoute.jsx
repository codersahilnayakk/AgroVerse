import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from './Spinner';

/**
 * Component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show a loading spinner while checking authentication status
  if (loading) {
    return <Spinner text="Checking authentication..." />;
  }

  // If user is authenticated, render the protected route
  // Otherwise, redirect to login page and preserve the intended destination
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

export default PrivateRoute; 