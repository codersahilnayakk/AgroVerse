import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Mock user data
const mockUsers = [
  {
    _id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'password123',
    token: 'mock-token-1'
  },
  {
    _id: '2',
    name: 'Sunita Sharma',
    email: 'sunita@example.com',
    password: 'password123',
    token: 'mock-token-2'
  },
  {
    _id: '3',
    name: 'Ramesh Patel',
    email: 'ramesh@example.com',
    password: 'password123',
    token: 'mock-token-3'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      setLoading(true);
      if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'));
        setUser(user);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if email already exists
      const existingUser = mockUsers.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        _id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        token: `mock-token-${Date.now()}`
      };
      
      // Add to mock users
      mockUsers.push(newUser);
      
      // Return user without password
      const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: newUser.token
      };
      
      localStorage.setItem('user', JSON.stringify(userResponse));
      setUser(userResponse);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error registering:', error.message);
      throw error;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user
      const user = mockUsers.find(
        user => user.email === userData.email && user.password === userData.password
      );
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Return user without password
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: user.token
      };
      
      localStorage.setItem('user', JSON.stringify(userResponse));
      setUser(userResponse);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find and update user
      const userIndex = mockUsers.findIndex(u => u._id === user._id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        name: userData.name || mockUsers[userIndex].name,
        email: userData.email || mockUsers[userIndex].email,
        password: userData.password || mockUsers[userIndex].password
      };
      
      // Return updated user without password
      const updatedUser = {
        _id: mockUsers[userIndex]._id,
        name: mockUsers[userIndex].name,
        email: mockUsers[userIndex].email,
        token: mockUsers[userIndex].token
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 