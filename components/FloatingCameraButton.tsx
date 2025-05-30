import React from 'react';
import { View, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';

const StyleColors = {
  brand: {
    primary: '#00A86B',
  },
  white: '#FFFFFF',
};

export const FloatingCameraButton: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = Dimensions.get('window');
  const focused = pathname === '/camera';

  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/camera');
  };
  return (
    <View
      style={{
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 45 : 15,
        left: width / 2 - 30,
        zIndex: 10000, // Aumentado para estar por encima del tab bar
        elevation: 25, // Aumentado para Android
      }}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: focused ? '#007A4D' : StyleColors.brand.primary,
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 20, // Aumentado para Android
          borderWidth: 3,
          borderColor: StyleColors.white,
        }}
        activeOpacity={0.8}
      >
        <Ionicons name="camera-outline" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
};
