import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = async (email, password) => {
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const savedUser = await authService.register(data);
      setUser(savedUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(savedUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = async (data) => {
    try {
      const updatedUser = await authService.updateProfile(user.id, data);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user,setUser, isAuthenticated, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
