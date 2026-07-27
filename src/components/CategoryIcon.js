import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

export const getCategoryIconInfo = (category) => {
  switch (category) {
    case 'Food':
      return { name: 'fast-food', color: theme.colors.categories.Food, tint: theme.colors.categoryTints.Food };
    case 'Transport':
      return { name: 'car', color: theme.colors.categories.Transport, tint: theme.colors.categoryTints.Transport };
    case 'Shopping':
      return { name: 'cart', color: theme.colors.categories.Shopping, tint: theme.colors.categoryTints.Shopping };
    case 'Bills':
      return { name: 'receipt', color: theme.colors.categories.Bills, tint: theme.colors.categoryTints.Bills };
    case 'Health':
      return { name: 'heart', color: theme.colors.categories.Health, tint: theme.colors.categoryTints.Health };
    case 'Education':
      return { name: 'school', color: theme.colors.categories.Education, tint: theme.colors.categoryTints.Education };
    case 'Entertainment':
      return { name: 'game-controller', color: theme.colors.categories.Entertainment, tint: theme.colors.categoryTints.Entertainment };
    default:
      return { name: 'options', color: theme.colors.categories.Other, tint: theme.colors.categoryTints.Other };
  }
};

export default function CategoryIcon({ category, size = 40, iconSize = 20, style }) {
  const info = getCategoryIconInfo(category);
  
  return (
    <View 
      style={[
        styles.iconContainer, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2, 
          backgroundColor: info.tint 
        }, 
        style
      ]}
    >
      <Ionicons name={info.name} size={iconSize} color={info.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
