import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity,
  Alert,
  Animated,
  Easing 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const { register, showDialog } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Dynamic Password Requirements check
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  // Background Orb Breathing Animation
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.15,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1.0,
          duration: 5000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Validate form fields
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
      valid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email address is required.';
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address.';
        valid = false;
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required.';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
      valid = false;
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character.';
      valid = false;
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await register(name, email, password);
      showDialog({
        title: 'Success',
        message: 'Account created successfully!',
        type: 'success',
      });
    } catch (error) {
      showDialog({
        title: 'Registration Failed',
        message: error.message || 'Something went wrong.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Pulsing Neon Orbs */}
      <Animated.View style={[
        styles.glowOrb1, 
        { 
          transform: [{ scale: glowAnim }] 
        }
      ]} />
      <Animated.View style={[
        styles.glowOrb2, 
        { 
          transform: [{ scale: glowAnim }] 
        }
      ]} />

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start tracking your daily expenses</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            label="Full Name"
            placeholder="Saman Perera"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: null }));
            }}
            error={errors.name}
            iconName="person-outline"
            autoCapitalize="words"
          />

          <CustomInput
            label="Email Address"
            placeholder="example@mail.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors(prev => ({ ...prev, email: null }));
            }}
            error={errors.email}
            iconName="mail-outline"
            keyboardType="email-address"
          />

          <CustomInput
            label="Password"
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: null }));
            }}
            error={errors.password}
            iconName="lock-closed-outline"
            secureTextEntry={true}
          />

          {/* Dynamic Password Strength Indicators */}
          <View style={styles.requirementsContainer}>
            <View style={styles.requirementRow}>
              <Ionicons 
                name={hasMinLength ? "checkmark-circle" : "ellipse-outline"} 
                size={14} 
                color={hasMinLength ? theme.colors.success : theme.colors.textMuted} 
              />
              <Text style={[styles.requirementText, hasMinLength && styles.requirementTextActive]}>
                At least 6 characters
              </Text>
            </View>
            <View style={styles.requirementRow}>
              <Ionicons 
                name={hasUppercase ? "checkmark-circle" : "ellipse-outline"} 
                size={14} 
                color={hasUppercase ? theme.colors.success : theme.colors.textMuted} 
              />
              <Text style={[styles.requirementText, hasUppercase && styles.requirementTextActive]}>
                At least one uppercase letter
              </Text>
            </View>
            <View style={styles.requirementRow}>
              <Ionicons 
                name={hasSpecialChar ? "checkmark-circle" : "ellipse-outline"} 
                size={14} 
                color={hasSpecialChar ? theme.colors.success : theme.colors.textMuted} 
              />
              <Text style={[styles.requirementText, hasSpecialChar && styles.requirementTextActive]}>
                At least one special character
              </Text>
            </View>
          </View>

          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: null }));
            }}
            error={errors.confirmPassword}
            iconName="lock-closed-outline"
            secureTextEntry={true}
          />

          <CustomButton
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  keyboardView: {
    flex: 1,
  },
  glowOrb1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(0, 255, 241, 0.08)',
    zIndex: -1,
  },
  glowOrb2: {
    position: 'absolute',
    bottom: -100,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0, 163, 154, 0.06)',
    zIndex: -1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  headerContainer: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.xxl,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  submitBtn: {
    marginTop: theme.spacing.md,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  footerText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sm,
    fontWeight: '500',
  },
  footerLink: {
    color: theme.colors.primaryLight,
    fontSize: theme.typography.sm,
    fontWeight: '700',
  },
  requirementsContainer: {
    paddingHorizontal: 4,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  requirementText: {
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    marginLeft: 8,
    fontWeight: '500',
  },
  requirementTextActive: {
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
});
