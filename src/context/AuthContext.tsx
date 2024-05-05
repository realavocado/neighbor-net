import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { baseURL, getCsrfToken } from '@/api/Request';

export type User = {
  userId: number;
  full_name: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoading: boolean;
  logout:()=>void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const checkLoginStatus = () => {
    axios.get(baseURL + 'users/is_logged_in/', {
      withCredentials: true
    }).then(response => {
      if (response.status === 200 && response.data.is_logged_in) {
        setUser(response.data.user as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    }).catch(error => {
      console.error("Check login error:", error);
      setUser(null);
      setLoading(false);
    });
  };

  const logout = async () => {
    try {
      const response = await axios.post(baseURL + "users/logout/", {}, {
        headers: {
            "x-csrftoken": getCsrfToken(),
        },
        withCredentials: true
      });
      if (response.status === 200) {
        setUser(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

