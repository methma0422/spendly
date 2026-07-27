import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../utils/theme';
import { getCategoryIconInfo } from './CategoryIcon';

// Reusable Animated Progress Bar Component
function AnimatedProgressBar({ percentage, color }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: percentage,
      friction: 8,
      tension: 30,
      useNativeDriver: false, // layout/width changes are not supported on native driver but run smoothly on modern phones
    }).start();
  }, [percentage]);

  const widthPercent = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View 
        style={[
          styles.progressFill, 
          { 
            backgroundColor: color, 
            width: widthPercent 
          }
        ]} 
      />
    </View>
  );
}

export default function SummaryChart({ expenses }) {
  // If there are no expenses, render a clean empty state
  if (!expenses || expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No transactions recorded this month.</Text>
      </View>
    );
  }

  // Calculate totals and group by category
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  
  const categoryTotals = expenses.reduce((acc, item) => {
    const cat = item.category || 'Other';
    acc[cat] = (acc[cat] || 0) + item.amount;
    return acc;
  }, {});

  // Convert to sorted array (highest spending first)
  const chartData = Object.keys(categoryTotals).map(category => {
    const amount = categoryTotals[category];
    const percentage = total > 0 ? (amount / total) * 100 : 0;
    return {
      category,
      amount,
      percentage,
      iconInfo: getCategoryIconInfo(category)
    };
  }).sort((a, b) => b.amount - a.amount);

  // Format Currency
  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Category Breakdown</Text>
      
      {chartData.map((item, index) => (
        <View key={item.category} style={styles.rowContainer}>
          <View style={styles.headerRow}>
            <View style={styles.categoryInfo}>
              <View style={[styles.colorDot, { backgroundColor: item.iconInfo.color }]} />
              <Text style={styles.categoryName}>{item.category}</Text>
            </View>
            <View style={styles.valueInfo}>
              <Text style={styles.categoryValue}>{formatAmount(item.amount)}</Text>
              <Text style={styles.categoryPercent}>{item.percentage.toFixed(0)}%</Text>
            </View>
          </View>
          
          {/* Progress Bar (Animated) */}
          <AnimatedProgressBar percentage={item.percentage} color={item.iconInfo.color} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.md,
  },
  chartTitle: {
    fontSize: theme.typography.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  rowContainer: {
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: theme.spacing.sm,
  },
  categoryName: {
    fontSize: theme.typography.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  valueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryValue: {
    fontSize: theme.typography.sm,
    fontWeight: '700',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  categoryPercent: {
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    width: 32,
    textAlign: 'right',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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
    textAlign: 'center',
  },
});
