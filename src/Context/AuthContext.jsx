import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = () => {
    setAuthenticated(true);
    setIsAdmin(false);
  };

  const adminLogin = () => {
    setAuthenticated(true);
    setIsAdmin(true);
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
