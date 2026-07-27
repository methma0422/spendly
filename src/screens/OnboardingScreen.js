import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Animated, 
  StatusBar,
  Image,
  Platform 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';
import CustomButton from '../components/CustomButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatAnim = useRef(new Animated.Value(0)).current; // gentle floating translation

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 30,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating idle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* Visual Illustration Container */}
      <View style={styles.illustrationContainer}>
        <Animated.View style={[
          styles.imageWrapper, 
          { 
            opacity: fadeAnim, 
            transform: [{ translateY: floatAnim }] 
          }
        ]}>
          <Image 
            source={require('../../assets/onboarding.jpg')} 
            style={styles.onboardingImage}
            resizeMode="cover"
          />
        </Animated.View>
      </View>

      {/* Info Content Sheet */}
      <Animated.View style={[
        styles.sheetContainer,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          paddingBottom: Math.max(insets.bottom, 20) + 20, // dynamically padded
        }
      ]}>
        <Text style={styles.title}>Manage your daily life expenses</Text>
        
        <Text style={styles.description}>
          Expense Tracker is a simple and efficient personal finance management app that allows you to track your daily expenses and income.
        </Text>

        <CustomButton
          title="Get Started"
          onPress={completeOnboarding}
          style={styles.btnGetStarted}
          textStyle={styles.btnText}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 241, 0.25)', // glowing border outline
    padding: 3,
    backgroundColor: '#071f2e', // blends seamlessly with the graphic's own background
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#00FFF1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  onboardingImage: {
    width: '100%',
    height: '100%',
    borderRadius: 122,
  },
  sheetContainer: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
    ...theme.shadows.lg,
  },
  title: {
    fontSize: theme.typography.xl,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 32,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xxl,
    paddingHorizontal: 12,
  },
  btnGetStarted: {
    backgroundColor: theme.colors.primary, // Sphiria Teal
    height: 54,
    borderRadius: theme.borderRadius.lg,
    elevation: 3,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  btnText: {
    color: theme.colors.text,
    fontSize: theme.typography.md,
    fontWeight: '700',
  },
});
