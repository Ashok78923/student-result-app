// frontend/src/utils/auth.js
import { jwtDecode } from 'jwt-decode';

export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

// FIX: This function now gets the token itself and is self-contained.
export const isTokenValid = () => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    // Check if the token's expiry time is in the future
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    // If token is malformed, it's not valid.
    console.error("Error decoding token:", error);
    return false;
  }
};

// This function now works correctly with the updated isTokenValid.
export const checkAuthAndLogoutIfExpired = (navigate) => {
  if (!isTokenValid()) {
    removeToken();
    navigate('/login');
  }
};