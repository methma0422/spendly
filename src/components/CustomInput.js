import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  iconName,
  style,
  inputStyle,
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View 
        style={[
          styles.inputContainer,
          { 
            borderColor: error 
              ? theme.colors.error 
              : isFocused 
                ? theme.colors.primaryLight 
                : theme.colors.border,
            backgroundColor: isFocused 
              ? theme.colors.surfaceLight 
              : theme.colors.surface
          }
        ]}
      >
        {iconName && (
          <Ionicons 
            name={iconName} 
            size={20} 
            color={error ? theme.colors.error : isFocused ? theme.colors.primaryLight : theme.colors.textMuted} 
            style={styles.leftIcon} 
          />
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={shouldSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[styles.input, { color: theme.colors.text }, inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        
        {secureTextEntry && (
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            <Ionicons 
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={theme.colors.textMuted} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    marginLeft: 2,
  },
  inputContainer: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: theme.typography.md,
    paddingVertical: 0,
  },
  rightIcon: {
    padding: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.xs,
    marginTop: theme.spacing.xs,
    marginLeft: 4,
    fontWeight: '500',
  },
});
