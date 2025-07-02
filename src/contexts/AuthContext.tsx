import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { apiService, User } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, userType?: 'farmer' | 'executive') => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updateData: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();
  const isLoggingOutRef = useRef(false);

  // Update ref when state changes
  useEffect(() => {
    isLoggingOutRef.current = isLoggingOut;
  }, [isLoggingOut]);

  // Stable logout function using useCallback
  const handleLogout = useCallback(async () => {
    // Prevent multiple simultaneous logout calls
    if (isLoggingOutRef.current) {
      return;
    }

    setIsLoggingOut(true);
    isLoggingOutRef.current = true;

    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user state regardless of API call success
      setUser(null);
      apiService.setToken(null);
      localStorage.removeItem('currentUser');
      setIsLoggingOut(false);
      isLoggingOutRef.current = false;

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    }
  }, [toast]);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Token expiration handler - using ref to avoid stale closures
  useEffect(() => {
    const handleTokenExpired = () => {
      // Only handle if not already logging out
      if (!isLoggingOutRef.current) {
        handleLogout();
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('auth:tokenExpired', handleTokenExpired);

    return () => {
      window.removeEventListener('auth:tokenExpired', handleTokenExpired);
    };
  }, [handleLogout, toast]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      // Check if token exists
      if (!apiService.isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const response = await apiService.verifyToken();
      if (response.success) {
        setUser(response.data.user);
      } else {
        // Token is invalid, clear it silently without triggering logout
        console.log('Token verification failed, clearing auth state');
        setUser(null);
        apiService.setToken(null);
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only clear auth if it's a real authentication error, not a network error
      if (error.message && (error.message.includes('Invalid') || error.message.includes('expired'))) {
        console.log('Authentication error, clearing auth state');
        setUser(null);
        apiService.setToken(null);
        localStorage.removeItem('currentUser');
      } else {
        console.log('Network or other error during auth check, keeping current state');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string, userType?: 'farmer' | 'executive') => {
    try {
      const response = await apiService.login({ email, password, userType });
      
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        toast({
          title: "Login Successful",
          description: response.message,
        });
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        toast({
          title: "Registration Successful",
          description: response.message,
        });
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error; // Re-throw to let the component handle the error
    }
  };



  const handleUpdateProfile = async (updateData: Partial<User>) => {
    try {
      const response = await apiService.updateProfile(updateData);
      
      if (response.success) {
        setUser(response.data.user);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        
        toast({
          title: "Profile Updated",
          description: response.message,
        });
      }
    } catch (error: any) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const handleRefreshToken = async () => {
    try {
      await apiService.refreshToken();
      // Token is automatically updated in apiService
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      handleLogout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    refreshToken: handleRefreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'farmer' | 'executive'
) => {
  return (props: P) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      );
    }

    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600">
              You don't have permission to access this page.
              Required role: {requiredRole}
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export default AuthContext;
