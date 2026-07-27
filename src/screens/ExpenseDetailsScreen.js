import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';
import CategoryIcon from '../components/CategoryIcon';
import CustomButton from '../components/CustomButton';

export default function ExpenseDetailsScreen({ route, navigation }) {
  const { expenseId } = route.params;
  const { expenses, deleteExpenseItem, showDialog } = useAuth();
  
  const expense = expenses.find(e => e.id === expenseId);

  if (!expense) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Expense not found or has been deleted.</Text>
        <CustomButton 
          title="Back to List" 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </SafeAreaView>
    );
  }

  const { title, amount, category, date, description } = expense;

  // Format date representation
  const formatDate = (dateString) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };

  // Format currency representation
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(num);
  };

  const handleDelete = () => {
    showDialog({
      title: 'Delete Expense',
      message: 'Are you sure you want to permanently delete this expense transaction?',
      type: 'error',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpenseItem(expenseId);
              navigation.goBack();
            } catch (e) {
              showDialog({
                title: 'Error',
                message: 'Failed to delete expense.',
                type: 'error',
              });
            }
          }
        }
      ]
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.detailsCard}>
          {/* Category Icon Badge */}
          <CategoryIcon category={category} size={64} iconSize={32} style={styles.categoryBadge} />
          
          <Text style={styles.amount}>-{formatCurrency(amount)}</Text>
          <Text style={styles.title}>{title}</Text>
          
          <View style={styles.divider} />
          
          {/* Metadata Grid */}
          <View style={styles.row}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Transaction Date</Text>
            <Text style={styles.value}>{formatDate(date)}</Text>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
            <Text style={styles.label}>Description</Text>
            <Text style={[styles.value, styles.descriptionText]}>
              {description ? description : 'No description provided for this transaction.'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomButton 
            title="Edit Transaction" 
            onPress={() => navigation.navigate('EditExpense', { expenseId })}
            style={styles.editBtn}
            iconName="create-outline"
          />
          <CustomButton 
            title="Delete Transaction" 
            onPress={handleDelete}
            variant="danger"
            outline={true}
            style={styles.deleteBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    padding: theme.spacing.lg,
  },
  detailsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.md,
    marginBottom: theme.spacing.lg,
  },
  categoryBadge: {
    marginBottom: theme.spacing.md,
  },
  amount: {
    fontSize: theme.typography.huge,
    fontWeight: '800',
    color: theme.colors.error,
    marginBottom: 8,
  },
  title: {
    fontSize: theme.typography.xl,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    width: '100%',
    marginVertical: theme.spacing.md,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: theme.typography.sm,
    color: theme.colors.text,
    fontWeight: '600',
  },
  categoryTag: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    color: theme.colors.primaryLight,
    fontSize: theme.typography.xs,
    fontWeight: '700',
  },
  descriptionSection: {
    width: '100%',
    marginTop: theme.spacing.md,
    alignItems: 'flex-start',
  },
  descriptionText: {
    marginTop: theme.spacing.xs,
    fontWeight: '400',
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: theme.spacing.md,
  },
  editBtn: {
    marginBottom: theme.spacing.sm,
  },
  deleteBtn: {
    borderColor: theme.colors.error,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.md,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    width: 200,
  },
});
