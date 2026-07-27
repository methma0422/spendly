import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@spendly:users';
const CURRENT_USER_KEY = '@spendly:current_user';

export const storage = {
  // --- AUTH SERVICES ---
  
  /**
   * Register a new user
   */
  registerUser: async (name, email, password) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const userExists = users.some(u => u.email === lowerEmail);
      if (userExists) {
        throw new Error('An account with this email already exists.');
      }
      
      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: lowerEmail,
        password: password, // In a real app, hash this
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Auto-login after registration
      const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  },

  /**
   * Login user
   */
  loginUser: async (email, password) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const user = users.find(u => u.email === lowerEmail && u.password === password);
      if (!user) {
        throw new Error('Invalid email or password.');
      }
      
      const sessionUser = { id: user.id, name: user.name, email: user.email };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  },

  /**
   * Get active user session
   */
  getCurrentUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Logout user
   */
  logoutUser: async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Update Profile info (Name and/or Email)
   */
  updateProfile: async (currentEmail, name, newEmail) => {
    try {
      const currentLower = currentEmail.toLowerCase().trim();
      const newLower = newEmail.toLowerCase().trim();
      
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const userIndex = users.findIndex(u => u.email === currentLower);
      if (userIndex === -1) {
        throw new Error('User account not found.');
      }

      // Check if email changed and if the new email is already taken
      if (currentLower !== newLower) {
        const emailExists = users.some(u => u.email === newLower);
        if (emailExists) {
          throw new Error('Email is already taken by another account.');
        }
      }
      
      // Update details
      users[userIndex].name = name.trim();
      const oldEmail = users[userIndex].email;
      users[userIndex].email = newLower;
      
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update session storage
      const updatedSession = {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email
      };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedSession));
      
      // If email changed, migrate expenses data
      if (oldEmail !== newLower) {
        const oldExpensesKey = `@spendly:expenses_${oldEmail}`;
        const newExpensesKey = `@spendly:expenses_${newLower}`;
        const expensesJson = await AsyncStorage.getItem(oldExpensesKey);
        if (expensesJson) {
          await AsyncStorage.setItem(newExpensesKey, expensesJson);
          await AsyncStorage.removeItem(oldExpensesKey);
        }
      }
      
      return updatedSession;
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    }
  },

  /**
   * Change Password
   */
  changePassword: async (email, oldPassword, newPassword) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      const userIndex = users.findIndex(u => u.email === lowerEmail);
      if (userIndex === -1) {
        throw new Error('User not found.');
      }
      
      if (users[userIndex].password !== oldPassword) {
        throw new Error('Current password is incorrect.');
      }
      
      users[userIndex].password = newPassword;
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      throw new Error(error.message || 'Password change failed');
    }
  },

  // --- EXPENSE CRUD SERVICES (Isolated per email) ---

  /**
   * Retrieve all expenses for a user
   */
  getExpenses: async (email) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      const key = `@spendly:expenses_${lowerEmail}`;
      const expensesJson = await AsyncStorage.getItem(key);
      return expensesJson ? JSON.parse(expensesJson) : [];
    } catch (error) {
      return [];
    }
  },

  /**
   * Add a new expense
   */
  addExpense: async (email, title, amount, category, date, description) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      const key = `@spendly:expenses_${lowerEmail}`;
      
      const expenses = await storage.getExpenses(lowerEmail);
      
      const newExpense = {
        id: Date.now().toString(),
        title: title.trim(),
        amount: parseFloat(amount),
        category: category,
        date: date, // ISO string or YYYY-MM-DD
        description: description ? description.trim() : '',
        createdAt: new Date().toISOString()
      };
      
      expenses.push(newExpense);
      
      // Sort expenses by date descending by default (newest first)
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      await AsyncStorage.setItem(key, JSON.stringify(expenses));
      return newExpense;
    } catch (error) {
      throw new Error('Failed to add expense');
    }
  },

  /**
   * Update an existing expense
   */
  updateExpense: async (email, id, updatedData) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      const key = `@spendly:expenses_${lowerEmail}`;
      
      const expenses = await storage.getExpenses(lowerEmail);
      const index = expenses.findIndex(e => e.id === id);
      
      if (index === -1) {
        throw new Error('Expense not found');
      }
      
      expenses[index] = {
        ...expenses[index],
        title: updatedData.title.trim(),
        amount: parseFloat(updatedData.amount),
        category: updatedData.category,
        date: updatedData.date,
        description: updatedData.description ? updatedData.description.trim() : '',
        updatedAt: new Date().toISOString()
      };
      
      // Sort expenses by date descending
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      await AsyncStorage.setItem(key, JSON.stringify(expenses));
      return expenses[index];
    } catch (error) {
      throw new Error('Failed to update expense');
    }
  },

  /**
   * Delete an expense
   */
  deleteExpense: async (email, id) => {
    try {
      const lowerEmail = email.toLowerCase().trim();
      const key = `@spendly:expenses_${lowerEmail}`;
      
      const expenses = await storage.getExpenses(lowerEmail);
      const filteredExpenses = expenses.filter(e => e.id !== id);
      
      await AsyncStorage.setItem(key, JSON.stringify(filteredExpenses));
      return true;
    } catch (error) {
      throw new Error('Failed to delete expense');
    }
  }
};
