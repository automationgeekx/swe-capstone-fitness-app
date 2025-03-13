import React, { createContext, useState, useContext, useEffect } from 'react';
import { signIn, signOut, getCurrentUser } from '../services/auth';
import { Alert } from 'react-native';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forceSignOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // No current user
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { isSignedIn, nextStep } = await signIn(email, password);
      
      if (isSignedIn) {
        setUser({ email });
        setIsAuthenticated(true);
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        throw { name: 'UserNotConfirmedException', message: 'User needs to confirm signup' };
      } else {
        throw new Error(`Authentication requires additional steps: ${nextStep?.signInStep}`);
      }
    } catch (error) {
      if (error.name === 'UserAlreadyAuthenticatedException') {
        // Return the error to be handled by the LoginScreen
        throw error;
      }
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forceSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Force sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      user, 
      login, 
      logout,
      forceSignOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
