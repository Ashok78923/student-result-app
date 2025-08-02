// frontend/src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from "react-router-dom";
import { isTokenValid } from '../utils/auth';

const PrivateRoute = ({ children }) => {
  // This call now works correctly because isTokenValid() gets the token itself.
  return isTokenValid() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;