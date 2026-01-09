"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const checkSession = () => {
      try {
        const storedSession = sessionStorage.getItem('isLoggedIn');
        if (storedSession === 'true') {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Could not access session storage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    // Mock login logic
    console.log("Logging in with", email);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoggedIn(true);
    try {
      sessionStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error("Could not access session storage:", error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    try {
      sessionStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error("Could not access session storage:", error);
    }
  };

  const signup = async (email: string, pass: string) => {
    // Mock signup logic
    console.log("Signing up with", email);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoggedIn(true);
    try {
      sessionStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error("Could not access session storage:", error);
    }
  };

  const value = { isLoggedIn, isLoading, login, logout, signup };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
