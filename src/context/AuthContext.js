import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../utils/storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [hasShownSplash, setHasShownSplash] = useState(false);
  const [dialogConfig, setDialogConfig] = useState(null);

  // Check for active session and onboarding flag on app mount
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const seen = await storage.getHasSeenOnboarding();
        setHasSeenOnboarding(seen);

        const currentUser = await storage.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadUserExpenses(currentUser.email);
        }
      } catch (e) {
        console.error('Failed to restore session or onboarding', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // --- EXPENSE ACTIONS ---

  const loadUserExpenses = async (email) => {
    try {
      const userExpenses = await storage.getExpenses(email);
      setExpenses(userExpenses);
    } catch (e) {
      console.error('Failed to load expenses', e);
    }
  };

  const addExpenseItem = async (title, amount, category, date, description) => {
    if (!user) throw new Error('User session not active');
    try {
      const newExpense = await storage.addExpense(
        user.email,
        title,
        amount,
        category,
        date,
        description
      );
      // Update local state directly to cause immediate reactive UI update
      setExpenses(prev => {
        const next = [newExpense, ...prev];
        return next.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
      return newExpense;
    } catch (error) {
      throw error;
    }
  };

  const updateExpenseItem = async (id, updatedData) => {
    if (!user) throw new Error('User session not active');
    try {
      const updatedExpense = await storage.updateExpense(user.email, id, updatedData);
      setExpenses(prev => {
        const next = prev.map(e => (e.id === id ? updatedExpense : e));
        return next.sort((a, b) => new Date(b.date) - new Date(a.date));
      });
      return updatedExpense;
    } catch (error) {
      throw error;
    }
  };

  const deleteExpenseItem = async (id) => {
    if (!user) throw new Error('User session not active');
    try {
      await storage.deleteExpense(user.email, id);
      setExpenses(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (error) {
      throw error;
    }
  };

  // --- AUTH ACTIONS ---

  const login = async (email, password) => {
    try {
      const sessionUser = await storage.loginUser(email, password);
      setUser(sessionUser);
      await loadUserExpenses(sessionUser.email);
      return sessionUser;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const sessionUser = await storage.registerUser(name, email, password);
      setUser(sessionUser);
      setExpenses([]); // Clear expenses since it's a new user
      return sessionUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.logoutUser();
      setUser(null);
      setExpenses([]);
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateProfile = async (name, newEmail) => {
    if (!user) throw new Error('User session not active');
    try {
      const updatedUser = await storage.updateProfile(user.email, name, newEmail);
      setUser(updatedUser);
      // Reload expenses from new key
      await loadUserExpenses(updatedUser.email);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!user) throw new Error('User session not active');
    try {
      await storage.changePassword(user.email, oldPassword, newPassword);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      await storage.setHasSeenOnboarding(true);
      setHasSeenOnboarding(true);
    } catch (e) {
      console.error('Failed to complete onboarding', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        hasSeenOnboarding,
        completeOnboarding,
        hasShownSplash,
        setHasShownSplash,
        expenses,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        addExpenseItem,
        updateExpenseItem,
        deleteExpenseItem,
        dialogConfig,
        showDialog: (config) => setDialogConfig(config),
        hideDialog: () => setDialogConfig(null),
        refreshExpenses: () => user && loadUserExpenses(user.email)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
