import React, { useRef } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Animated 
} from 'react-native';
import { theme } from '../utils/theme';

export default function CustomButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  outline = false, 
  loading = false, 
  disabled = false, 
  style, 
  textStyle 
}) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 7,
      tension: 50,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 7,
      tension: 50,
    }).start();
  };

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';
  
  const getButtonStyles = () => {
    if (disabled) return styles.disabledButton;
    
    let btnStyle = styles.primaryButton;
    if (isSecondary) btnStyle = styles.secondaryButton;
    if (isDanger) btnStyle = styles.dangerButton;
    
    if (outline) {
      return [
        btnStyle,
        styles.outlineBase,
        {
          borderColor: isSecondary 
            ? theme.colors.secondary 
            : isDanger 
              ? theme.colors.error 
              : theme.colors.primary,
          backgroundColor: 'transparent'
        }
      ];
    }
    
    return btnStyle;
  };
  
  const getTextColor = () => {
    if (disabled) return theme.colors.textMuted;
    if (outline) {
      if (isSecondary) return theme.colors.secondary;
      if (isDanger) return theme.colors.error;
      return theme.colors.primaryLight;
    }
    return theme.colors.text;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }], width: style?.width || '100%' }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.buttonBase, getButtonStyles(), style]}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={outline ? (isSecondary ? theme.colors.secondary : theme.colors.primary) : theme.colors.text} 
          />
        ) : (
          <Text style={[styles.textBase, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: 52,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...theme.shadows.sm,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dangerButton: {
    backgroundColor: theme.colors.error,
  },
  disabledButton: {
    backgroundColor: theme.colors.surfaceLight,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  outlineBase: {
    borderWidth: 1.5,
  },
  textBase: {
    fontSize: theme.typography.md,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
