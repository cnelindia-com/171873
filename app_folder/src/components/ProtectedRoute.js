import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedTypes = [] }) {
  const isLoggedIn = localStorage.getItem('pflegeLoggedIn');
  // const userType = localStorage.getItem('pflegeUserType');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes.length > 0 ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;