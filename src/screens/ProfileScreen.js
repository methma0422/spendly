import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

export default function ProfileScreen() {
  const { user, expenses, logout, updateProfile, changePassword } = useAuth();
  
  // Section toggle states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Edit Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // Change Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);

  // Helper: Format Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Handle Profile Update
  const handleUpdateProfile = async () => {
    let valid = true;
    let errs = {};

    if (!name.trim()) {
      errs.name = 'Name is required.';
      valid = false;
    }

    if (!email.trim()) {
      errs.email = 'Email is required.';
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errs.email = 'Please enter a valid email.';
        valid = false;
      }
    }

    setEditErrors(errs);
    if (!valid) return;

    setEditLoading(true);
    try {
      await updateProfile(name, email);
      Alert.alert('Success', 'Profile updated successfully!');
      setShowEditProfile(false);
    } catch (e) {
      Alert.alert('Update Failed', e.message || 'Something went wrong.');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async () => {
    let valid = true;
    let errs = {};

    if (!currentPassword) {
      errs.currentPassword = 'Current password is required.';
      valid = false;
    }

    if (!newPassword) {
      errs.newPassword = 'New password is required.';
      valid = false;
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters.';
      valid = false;
    } else if (!/[A-Z]/.test(newPassword)) {
      errs.newPassword = 'Password must contain at least one uppercase letter.';
      valid = false;
    } else if (!/[^A-Za-z0-9]/.test(newPassword)) {
      errs.newPassword = 'Password must contain at least one special character.';
      valid = false;
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password.';
      valid = false;
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    setPwErrors(errs);
    if (!valid) return;

    setPwLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    } catch (e) {
      Alert.alert('Change Failed', e.message || 'Something went wrong.');
    } finally {
      setPwLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to log out of spendly?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  // Generate avatar initials
  const getInitials = (userName) => {
    if (!userName) return 'S';
    return userName
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Profile Card Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </View>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>

          {/* Quick Statistics Grid */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Saved</Text>
              <Text style={styles.statValue}>{expenses.length} txs</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Outflow</Text>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
          </View>

          {/* Profile Update Section */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cardHeader} 
              onPress={() => setShowEditProfile(!showEditProfile)}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>Edit Profile Info</Text>
              <Text style={styles.cardToggleText}>{showEditProfile ? 'Close' : 'Edit'}</Text>
            </TouchableOpacity>

            {showEditProfile && (
              <View style={styles.cardBody}>
                <CustomInput
                  label="Display Name"
                  value={name}
                  onChangeText={setName}
                  error={editErrors.name}
                  iconName="person-outline"
                />
                <CustomInput
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  error={editErrors.email}
                  iconName="mail-outline"
                  keyboardType="email-address"
                />
                <CustomButton
                  title="Save Profile"
                  onPress={handleUpdateProfile}
                  loading={editLoading}
                  style={styles.actionBtn}
                />
              </View>
            )}
          </View>

          {/* Change Password Section */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.cardHeader} 
              onPress={() => setShowChangePassword(!showChangePassword)}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>Security & Password</Text>
              <Text style={styles.cardToggleText}>{showChangePassword ? 'Close' : 'Update'}</Text>
            </TouchableOpacity>

            {showChangePassword && (
              <View style={styles.cardBody}>
                <CustomInput
                  label="Current Password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  error={pwErrors.currentPassword}
                  iconName="lock-closed-outline"
                  secureTextEntry={true}
                />
                <CustomInput
                  label="New Password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  error={pwErrors.newPassword}
                  iconName="lock-open-outline"
                  secureTextEntry={true}
                />
                <CustomInput
                  label="Confirm New Password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={pwErrors.confirmPassword}
                  iconName="shield-checkmark-outline"
                  secureTextEntry={true}
                />
                <CustomButton
                  title="Change Password"
                  onPress={handlePasswordChange}
                  loading={pwLoading}
                  style={styles.actionBtn}
                />
              </View>
            )}
          </View>

          {/* Logout Section */}
          <CustomButton 
            title="Sign Out" 
            onPress={handleLogout}
            variant="secondary"
            style={styles.logoutBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: theme.spacing.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  avatarText: {
    fontSize: theme.typography.xxl,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 1,
  },
  profileName: {
    fontSize: theme.typography.xl,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statBox: {
    backgroundColor: theme.colors.surface,
    width: '48%',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.sm,
  },
  statLabel: {
    fontSize: theme.typography.xs,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    fontSize: theme.typography.md,
    fontWeight: '800',
    color: theme.colors.text,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.sm,
    fontWeight: '700',
    color: theme.colors.text,
  },
  cardToggleText: {
    fontSize: theme.typography.xs,
    color: theme.colors.primaryLight,
    fontWeight: '700',
  },
  cardBody: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionBtn: {
    height: 44,
    marginTop: theme.spacing.sm,
  },
  logoutBtn: {
    borderColor: theme.colors.error,
    borderWidth: 1,
    marginTop: theme.spacing.lg,
  },
});
