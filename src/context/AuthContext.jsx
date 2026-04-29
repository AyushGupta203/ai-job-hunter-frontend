import { createContext, useContext, useState } from "react";

// Context banao — global state hai ye
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  // localStorage se token lo — 
  // page refresh pe bhi logged in rahe
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );
  
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Login ke baad ye call hoga
  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  // Logout pe sab clear karo
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — easy use ke liye
export const useAuth = () => useContext(AuthContext);