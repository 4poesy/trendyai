import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('trendyai_user');
    const savedToken = localStorage.getItem('trendyai_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = async (email, password) => {
    if (email && password) {
      const mockUser = { email, name: 'Admin User', id: 'admin-001' };
      const mockToken = 'fake-jwt-token';
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('trendyai_user', JSON.stringify(mockUser));
      localStorage.setItem('trendyai_token', mockToken);
      return { user: mockUser, token: mockToken };
    }
    throw new Error('Invalid credentials');
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('trendyai_user');
    localStorage.removeItem('trendyai_token');
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