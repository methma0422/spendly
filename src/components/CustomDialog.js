import React, { useEffect, useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';

export default function CustomDialog() {
  const { dialogConfig, hideDialog } = useAuth();
  const visible = !!dialogConfig;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.85);
    }
  }, [visible]);

  if (!visible) return null;

  const { title, message, type = 'info', buttons = [] } = dialogConfig;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={40} color="#10b981" />;
      case 'error':
        return <Ionicons name="alert-circle" size={40} color="#f43f5e" />;
      case 'confirm':
        return <Ionicons name="exit" size={40} color="#00FFF1" />;
      default:
        return <Ionicons name="information-circle" size={40} color="#00A39A" />;
    }
  };

  const getGlowColor = () => {
    switch (type) {
      case 'success': return 'rgba(16, 185, 129, 0.08)';
      case 'error': return 'rgba(244, 63, 94, 0.08)';
      case 'confirm': return 'rgba(0, 255, 241, 0.08)';
      default: return 'rgba(0, 163, 154, 0.08)';
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={hideDialog}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        <Animated.View style={[
          styles.card,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            borderColor: type === 'confirm' ? 'rgba(0, 255, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
            shadowColor: type === 'confirm' ? '#00FFF1' : theme.colors.primary,
          }
        ]}>
          <View style={[styles.iconContainer, { backgroundColor: getGlowColor() }]}>
            {getIcon()}
          </View>
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          
          <View style={[
            styles.buttonContainer,
            buttons.length > 2 ? { flexDirection: 'column' } : { flexDirection: 'row' }
          ]}>
            {buttons.length === 0 ? (
              <TouchableOpacity 
                style={[styles.btn, styles.btnPrimary]}
                onPress={hideDialog}
                activeOpacity={0.8}
              >
                <Text style={styles.btnTextPrimary}>OK</Text>
              </TouchableOpacity>
            ) : (
              buttons.map((btn, index) => {
                const isCancel = btn.style === 'cancel';
                const isDestructive = btn.style === 'destructive';
                
                const btnStyle = isCancel 
                  ? styles.btnCancel 
                  : isDestructive 
                    ? styles.btnDestructive 
                    : styles.btnPrimary;
                    
                const txtStyle = isCancel 
                  ? styles.btnTextCancel 
                  : styles.btnTextPrimary;

                return (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.btn, 
                      btnStyle,
                      buttons.length > 2 && { width: '100%', marginBottom: 10 }
                    ]}
                    onPress={() => {
                      hideDialog();
                      if (btn.onPress) btn.onPress();
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.btnText, txtStyle]}>{btn.text}</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(4, 3, 11, 0.85)',
  },
  card: {
    width: Dimensions.get('window').width * 0.82,
    backgroundColor: '#0c0a21',
    borderWidth: 1.5,
    borderRadius: 24,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  title: {
    fontSize: theme.typography.md,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    letterSpacing: 0.5,
  },
  message: {
    fontSize: theme.typography.sm - 1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xs,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary, // Sphiria Teal
  },
  btnCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  btnDestructive: {
    backgroundColor: '#f43f5e',
  },
  btnText: {
    fontSize: theme.typography.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnTextPrimary: {
    color: theme.colors.text,
  },
  btnTextCancel: {
    color: theme.colors.textSecondary,
  },
});
