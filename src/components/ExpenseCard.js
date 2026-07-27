import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { theme } from '../utils/theme';
import CategoryIcon, { getCategoryIconInfo } from './CategoryIcon';

export default function ExpenseCard({ expense, onPress }) {
  const { title, amount, category, date } = expense;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  // Format Date (e.g., "Oct 12, 2026")
  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateString;
    }
  };

  // Format Currency
  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(num);
  };

  const iconInfo = getCategoryIconInfo(category);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity 
        style={[
          styles.card,
          { 
            borderLeftColor: iconInfo.color,
            borderColor: `${iconInfo.color}15`, // subtle tinted border
            shadowColor: iconInfo.color,
          }
        ]} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.85}
      >
        <View style={styles.leftContainer}>
          <CategoryIcon category={category} size={44} iconSize={22} style={styles.iconBadge} />
          
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.subTextContainer}>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.date}>{formatDate(date)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.rightContainer}>
          <Text style={styles.amount}>
            -{formatAmount(amount)}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderLeftWidth: 4.5, // Colored edge strip
    elevation: 2, // dynamic shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  iconBadge: {
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  dot: {
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    marginHorizontal: 6,
  },
  date: {
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: theme.typography.md,
    fontWeight: '700',
    color: theme.colors.error, // Expenses are red by default
  },
});
