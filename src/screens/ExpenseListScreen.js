import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';
import ExpenseCard from '../components/ExpenseCard';

const CATEGORIES = ['All', 'Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Entertainment', 'Other'];

const SORT_OPTIONS = [
  { id: 'date_desc', label: 'Date: Newest', icon: 'calendar', value: 'date_desc' },
  { id: 'date_asc', label: 'Date: Oldest', icon: 'calendar-outline', value: 'date_asc' },
  { id: 'amount_desc', label: 'Amount: High', icon: 'trending-down', value: 'amount_desc' },
  { id: 'amount_asc', label: 'Amount: Low', icon: 'trending-up', value: 'amount_asc' }
];

export default function ExpenseListScreen({ navigation }) {
  const { expenses } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('date_desc');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter & Sort expenses dynamically
  const filteredSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // 1. Apply Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(e => 
        e.title.toLowerCase().includes(query) || 
        (e.description && e.description.toLowerCase().includes(query))
      );
    }

    // 2. Apply Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(e => e.category === selectedCategory);
    }

    // 3. Apply Sorting
    switch (selectedSort) {
      case 'date_asc':
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'amount_desc':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount_asc':
        result.sort((a, b) => a.amount - b.amount);
        break;
      case 'date_desc':
      default:
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return result;
  }, [expenses, searchQuery, selectedCategory, selectedSort]);

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === selectedSort)?.label || 'Sort';

  return (
    <SafeAreaView style={styles.container}>
      {/* Search and Sort Row */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search expenses by title..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearch}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity 
          style={[styles.sortButton, showSortDropdown && styles.sortButtonActive]}
          onPress={() => setShowSortDropdown(!showSortDropdown)}
        >
          <Ionicons name="funnel-outline" size={18} color={theme.colors.text} />
          <Text style={styles.sortButtonText}>{activeSortLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown Overlay (Simple interactive drawer/dropdown) */}
      {showSortDropdown && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.dropdownItem,
                selectedSort === option.value && styles.dropdownItemActive
              ]}
              onPress={() => {
                setSelectedSort(option.value);
                setShowSortDropdown(false);
              }}
            >
              <Ionicons 
                name={option.icon} 
                size={18} 
                color={selectedSort === option.value ? theme.colors.primaryLight : theme.colors.textSecondary} 
              />
              <Text 
                style={[
                  styles.dropdownText,
                  selectedSort === option.value && styles.dropdownTextActive
                ]}
              >
                {option.label}
              </Text>
              {selectedSort === option.value && (
                <Ionicons name="checkmark" size={18} color={theme.colors.primaryLight} style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Horizontal Category Scroll */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text 
                  style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Expenses List */}
      <FlatList
        data={filteredSortedExpenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onPress={() => navigation.navigate('ExpenseDetails', { expenseId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyTitle}>No Expenses Found</Text>
            <Text style={styles.emptySubtitle}>
              {expenses.length === 0 
                ? "You haven't recorded any expenses yet." 
                : "No expenses match your search or filter options."}
            </Text>
            {expenses.length === 0 && (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddExpense')}
              >
                <Text style={styles.addButtonText}>Add New Expense</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    alignItems: 'center',
    zIndex: 10,
  },
  searchBarContainer: {
    flex: 1,
    height: 44,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  searchIcon: {
    marginRight: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.sm,
    height: '100%',
    paddingVertical: 0,
  },
  clearSearch: {
    padding: 4,
  },
  sortButton: {
    height: 44,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  sortButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 163, 154, 0.1)',
  },
  sortButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.xs,
    fontWeight: '600',
    marginLeft: 6,
  },
  sortDropdown: {
    position: 'absolute',
    top: 58,
    right: theme.spacing.lg,
    width: 180,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 6,
    zIndex: 100,
    ...theme.shadows.lg,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: 6,
  },
  dropdownItemActive: {
    backgroundColor: 'rgba(0, 163, 154, 0.08)',
  },
  dropdownText: {
    fontSize: theme.typography.xs,
    color: theme.colors.textSecondary,
    marginLeft: 8,
    fontWeight: '500',
  },
  dropdownTextActive: {
    color: theme.colors.primaryLight,
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  categoryContainer: {
    paddingVertical: theme.spacing.sm,
  },
  categoryScroll: {
    paddingHorizontal: theme.spacing.lg,
    height: 40,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontSize: theme.typography.xs,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: theme.colors.text,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptySubtitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  addButton: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.md,
  },
  addButtonText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: theme.typography.sm,
  },
});
