import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CategoryIcon from '../components/CategoryIcon';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Other'];

export default function EditExpenseScreen({ route, navigation }) {
  const { expenseId } = route.params;
  const { expenses, updateExpenseItem, showDialog } = useAuth();
  
  const expense = expenses.find(e => e.id === expenseId);

  // If expense is not found, redirect back
  useEffect(() => {
    if (!expense) {
      showDialog({
        title: 'Error',
        message: 'Transaction not found.',
        type: 'error',
      });
      navigation.goBack();
    }
  }, [expense]);

  if (!expense) return null;

  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date);
  const [description, setDescription] = useState(expense.description || '');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate form fields
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Expense title is required.';
      valid = false;
    }

    // Amount validation
    if (!amount) {
      newErrors.amount = 'Amount is required.';
      valid = false;
    } else {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        newErrors.amount = 'Please enter a valid amount greater than 0.';
        valid = false;
      }
    }

    // Category validation
    if (!category) {
      newErrors.category = 'Please select a category.';
      valid = false;
    }

    // Date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date) {
      newErrors.date = 'Transaction date is required.';
      valid = false;
    } else if (!dateRegex.test(date)) {
      newErrors.date = 'Date must be in YYYY-MM-DD format.';
      valid = false;
    } else {
      const timestamp = Date.parse(date);
      if (isNaN(timestamp)) {
        newErrors.date = 'Please enter a valid calendar date.';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await updateExpenseItem(expenseId, {
        title,
        amount,
        category,
        date,
        description
      });
      
      showDialog({
        title: 'Success',
        message: 'Expense updated successfully!',
        type: 'success',
        buttons: [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      });
    } catch (e) {
      showDialog({
        title: 'Error',
        message: 'Failed to update expense. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={88}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        {/* Form Fields */}
        <CustomInput
          label="Expense Title"
          placeholder="e.g. Grocery shopping..."
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (errors.title) setErrors(prev => ({ ...prev, title: null }));
          }}
          error={errors.title}
          iconName="text-outline"
          autoCapitalize="sentences"
        />

        <CustomInput
          label="Amount (Rs.)"
          placeholder="0.00"
          value={amount}
          onChangeText={(text) => {
            const sanitized = text.replace(/[^0-9.]/g, '');
            setAmount(sanitized);
            if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
          }}
          error={errors.amount}
          iconName="cash-outline"
          keyboardType="numeric"
        />

        <CustomInput
          label="Date (YYYY-MM-DD)"
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={(text) => {
            setDate(text);
            if (errors.date) setErrors(prev => ({ ...prev, date: null }));
          }}
          error={errors.date}
          iconName="calendar-outline"
        />

        {/* Category Picker Grid */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryLabel}>Select Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    isSelected && styles.categoryButtonActive
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    if (errors.category) setErrors(prev => ({ ...prev, category: null }));
                  }}
                  activeOpacity={0.7}
                >
                  <CategoryIcon category={cat} size={36} iconSize={18} style={styles.catIcon} />
                  <Text style={[
                    styles.categoryBtnText,
                    isSelected && styles.categoryBtnTextActive
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        <CustomInput
          label="Description (Optional)"
          placeholder="Add short transaction notes here..."
          value={description}
          onChangeText={setDescription}
          iconName="document-text-outline"
          multiline={true}
          numberOfLines={3}
          inputStyle={styles.multilineInput}
          style={styles.descriptionInput}
        />

        {/* Save Button */}
        <CustomButton
          title="Save Changes"
          onPress={handleUpdate}
          loading={loading}
          style={styles.saveButton}
        />
        
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  categorySection: {
    marginBottom: theme.spacing.md,
  },
  categoryLabel: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    marginLeft: 2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryButton: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginVertical: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(0, 163, 154, 0.1)',
    borderColor: theme.colors.primaryLight,
  },
  catIcon: {
    marginBottom: 4,
  },
  categoryBtnText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  categoryBtnTextActive: {
    color: theme.colors.primaryLight,
    fontWeight: '700',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.xs,
    marginTop: theme.spacing.xs,
    marginLeft: 4,
    fontWeight: '500',
  },
  multilineInput: {
    height: 70,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  descriptionInput: {
    marginTop: theme.spacing.sm,
  },
  saveButton: {
    marginTop: theme.spacing.lg,
  },
});
