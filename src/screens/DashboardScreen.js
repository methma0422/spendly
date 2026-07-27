import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';
import ExpenseCard from '../components/ExpenseCard';
import SummaryChart from '../components/SummaryChart';

export default function DashboardScreen({ navigation }) {
  const { user, expenses } = useAuth();

  // Helper: Format Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  // Calculations
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  const monthlyExpenses = expenses.reduce((sum, item) => {
    try {
      const expenseDate = new Date(item.date);
      const currentDate = new Date();
      if (
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear()
      ) {
        return sum + item.amount;
      }
    } catch (e) {
      // ignore parsing error
    }
    return sum;
  }, 0);

  // Get recent 5 transactions
  const recentTransactions = expenses.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileBadge}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person" size={20} color={theme.colors.primaryLight} />
          </TouchableOpacity>
        </View>

        {/* Balance Card / Summary Widgets */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Total Spending</Text>
            <View style={styles.chip}>
              <Text style={styles.chipText}>LKR</Text>
            </View>
          </View>
          <Text style={styles.totalValue}>{formatCurrency(totalExpenses)}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.cardFooter}>
            <View style={styles.footerCol}>
              <Text style={styles.footerLabel}>This Month</Text>
              <Text style={styles.footerValue}>{formatCurrency(monthlyExpenses)}</Text>
            </View>
            <View style={styles.footerCol}>
              <Text style={styles.footerLabel}>Transactions</Text>
              <Text style={styles.footerValue}>{expenses.length}</Text>
            </View>
          </View>
        </View>

        {/* Spending Category Breakdown */}
        <View style={styles.sectionContainer}>
          <SummaryChart expenses={expenses} />
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {expenses.length > 5 && (
              <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                <Text style={styles.seeAllLink}>See All</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={40} color={theme.colors.textMuted} />
              <Text style={styles.emptyText}>No recent transactions.</Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => navigation.navigate('AddExpense')}
              >
                <Text style={styles.emptyButtonText}>Add Your First Expense</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentTransactions.map((item) => (
              <ExpenseCard 
                key={item.id} 
                expense={item} 
                onPress={() => navigation.navigate('ExpenseDetails', { expenseId: item.id })}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button for Add Expense */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddExpense')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={theme.colors.text} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100, // Extra padding to scroll past FAB
    paddingTop: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: theme.typography.xl,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 2,
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 163, 154, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 163, 154, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardHeaderTitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  chip: {
    backgroundColor: 'rgba(0, 163, 154, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 10,
    color: theme.colors.primaryLight,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: theme.typography.huge,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: theme.spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xs,
  },
  footerCol: {
    flex: 1,
  },
  footerLabel: {
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: theme.typography.md,
    color: theme.colors.text,
    fontWeight: '700',
  },
  sectionContainer: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.md,
    fontWeight: '700',
    color: theme.colors.text,
  },
  seeAllLink: {
    fontSize: theme.typography.sm,
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
  emptyContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sm,
    marginTop: theme.spacing.sm,
    fontWeight: '500',
  },
  emptyButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
  },
  emptyButtonText: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: theme.typography.sm,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
});
