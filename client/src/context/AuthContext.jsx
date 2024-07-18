import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
  const [token, setToken] = useState(localStorage.getItem('dieToken') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('dieToken', token);
    } else {
      localStorage.removeItem('dieToken');
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  }

  const logout = () => {
    setToken('');
    localStorage.removeItem('dieToken');
    localStorage.removeItem('userData');
  }

  return (
    <AuthContext.Provider value={{token, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
}