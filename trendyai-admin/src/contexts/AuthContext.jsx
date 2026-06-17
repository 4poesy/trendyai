import React, { createContext, useContext, useState } from 'react';
import { puterAuth } from '../utils/puterApi';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    const res = await puterAuth.login(email, password);
    setUser(res.user);
    setToken(res.token);
  };

  const logout = async () => {
    await puterAuth.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 