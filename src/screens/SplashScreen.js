import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

import { useAuth } from '../context/AuthContext';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const { hasSeenOnboarding, setHasShownSplash } = useAuth();

  useEffect(() => {
    // Elegant entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Onboarding or Login after 2.5 seconds
    const timer = setTimeout(() => {
      setHasShownSplash(true);
      navigation.replace(hasSeenOnboarding ? 'Login' : 'Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [hasSeenOnboarding]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoCircle}>
          <Ionicons name="wallet-outline" size={48} color={theme.colors.primaryLight} />
        </View>
        <Text style={styles.title}>spendly</Text>
        <Text style={styles.subtitle}>Smart Expense Tracker</Text>
      </Animated.View>
      
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Text style={styles.footerText}>Secure • Simple • Smart</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 163, 154, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 163, 154, 0.25)',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.huge,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: theme.typography.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
