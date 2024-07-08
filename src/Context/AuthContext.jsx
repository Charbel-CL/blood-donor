import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = () => {
    setAuthenticated(true);
    setIsAdmin(false); // Ensure normal login sets isAdmin to false
  };

  const adminLogin = () => {
    setAuthenticated(true);
    setIsAdmin(true); // Admin login sets isAdmin to true
  };

  const logout = () => {
    setAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, isAdmin, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
