import React, { useState } from 'react';
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

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate form fields
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

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
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await login(email, password);
      // AuthState automatically shifts stack, but just in case:
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to manage your daily expenses</Text>
        </View>

        <View style={styles.formContainer}>
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
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors(prev => ({ ...prev, password: null }));
            }}
            error={errors.password}
            iconName="lock-closed-outline"
            secureTextEntry={true}
          />

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Register</Text>
          </TouchableOpacity>
        </View>
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
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  headerContainer: {
    marginBottom: theme.spacing.xxl,
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
});
