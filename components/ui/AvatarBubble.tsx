import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface AvatarBubbleProps {
  name: string;
  avatarUrl?: string | null;
  color?: string;
  size?: number;
}

export function AvatarBubble({ name, avatarUrl, color = '#4A90D9', size = 40 }: AvatarBubbleProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color + '30',
          borderColor: color + '60',
        },
      ]}
    >
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={[styles.image, { borderRadius: size / 2 }]} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.38, color }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  initials: { fontWeight: '700' },
});
