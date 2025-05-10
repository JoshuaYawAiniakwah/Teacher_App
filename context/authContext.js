// context/authContext.js
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Default state is null (no user logged in)

  const login = (userData) => setUser(userData); // Example login handler
  const logout = () => setUser(null); // Example logout handler

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} 
    </AuthContext.Provider>
  );
};

export default AuthContext;
