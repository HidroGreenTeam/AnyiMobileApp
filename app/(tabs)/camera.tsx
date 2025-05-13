import React, { memo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { StyledText } from '@/components/StyledText';
import { StyleColors, Spacing } from '@/constants';

// Use React.memo to prevent unnecessary re-renders
const CameraScreen = memo(() => {
  // Use useCallback for event handlers
  const handleCapturePress = useCallback(() => {
    console.log('Capture button pressed');
    // Add camera capture logic here
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <StyledText variant="h4" weight="700">
          Camera
        </StyledText>
      </View>
      
      <View style={styles.content}>
        <View style={styles.cameraPlaceholder}>
          <Ionicons name="camera" size={48} color={StyleColors.grey.grey3} />
          <StyledText style={styles.centerText} weight="600">
            Camera Preview
          </StyledText>
        </View>
        
        <TouchableOpacity style={styles.captureButton} onPress={handleCapturePress}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

// Add display name for better debugging
CameraScreen.displayName = 'CameraScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  centerText: {
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  cameraPlaceholder: {
    width: '100%',
    height: '70%',
    backgroundColor: StyleColors.grey.grey5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: StyleColors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  captureInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: StyleColors.brand.primary,
  },
});

export default CameraScreen; 