import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// Create the AuthContext
const AuthContext = createContext({});

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your app and provide authentication context
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      const storage = user.rememberMe ? localStorage : sessionStorage;
      const otherStorage = user.rememberMe ? sessionStorage : localStorage;

      storage.setItem("user", JSON.stringify(user));
      otherStorage.removeItem("user");
    } else {
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    }
  }, [user]);

  const login = useCallback((token, id, email, rememberMe) => {
    const userData = { token, id, email, rememberMe };
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
