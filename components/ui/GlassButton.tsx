import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Radius } from '@/constants/radius';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function GlassButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading,
  disabled,
  style,
}: GlassButtonProps) {
  const textColor =
    variant === 'primary' ? '#fff' : variant === 'danger' ? Colors.error : Colors.accent;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], (disabled || loading) && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={textColor} style={styles.icon} />}
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.accent,
    shadowColor: Colors.fabShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  ghost: {
    backgroundColor: Colors.glassBackground,
    borderWidth: 1.5,
    borderColor: Colors.glassBorder,
  },
  danger: {
    backgroundColor: Colors.errorLight,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  disabled: { opacity: 0.5 },
  icon: { marginRight: 8 },
  text: { fontSize: 16, fontWeight: '600' },
});
