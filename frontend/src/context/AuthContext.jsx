import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const loadStoredUser = () => {
  const token = localStorage.getItem('mindmate_token');
  const savedUser = localStorage.getItem('mindmate_user');
  if (!token || !savedUser) return null;
  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem('mindmate_token');
    localStorage.removeItem('mindmate_user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);

  const loginUser = (userData, token) => {
    localStorage.setItem('mindmate_token', token);
    localStorage.setItem('mindmate_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('mindmate_token');
    localStorage.removeItem('mindmate_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
