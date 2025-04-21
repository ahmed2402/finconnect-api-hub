
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      // In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, use mock data
      if (email === "user@example.com" && password === "password") {
        const mockUser: User = {
          id: "user-123",
          email: "user@example.com",
          name: "Demo User",
          role: "developer",
          createdAt: new Date().toISOString()
        };
        
        const mockToken = "mock-jwt-token-user";
        
        setUser(mockUser);
        setToken(mockToken);
        
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("token", mockToken);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${mockUser.name}!`,
        });
        
        navigate("/pricing");
        return;
      }
      
      if (email === "admin@example.com" && password === "password") {
        const mockAdmin: User = {
          id: "admin-123",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
          createdAt: new Date().toISOString()
        };
        
        const mockToken = "mock-jwt-token-admin";
        
        setUser(mockAdmin);
        setToken(mockToken);
        
        localStorage.setItem("user", JSON.stringify(mockAdmin));
        localStorage.setItem("token", mockToken);
        
        toast({
          title: "Admin Login Successful",
          description: `Welcome back, ${mockAdmin.name}!`,
        });
        
        navigate("/admin/dashboard");
        return;
      }
      
      throw new Error("Invalid email or password");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Something went wrong",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, use mock data
      const mockUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        role: "developer",
        createdAt: new Date().toISOString()
      };
      
      const mockToken = `mock-jwt-token-${Math.random().toString(36).substr(2, 9)}`;
      
      setUser(mockUser);
      setToken(mockToken);
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("token", mockToken);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });
      
      navigate("/pricing");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Something went wrong",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("subscription");
    navigate("/login");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
