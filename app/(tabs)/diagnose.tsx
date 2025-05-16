import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StyledText } from '@/components/StyledText';
import { StyleColors, Spacing } from '@/constants';
import { t } from 'i18next';

// Use React.memo to prevent unnecessary re-renders
const DiagnoseScreen = memo(() => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <StyledText variant="h4" weight="700">
          {t('Diagnose')}
        </StyledText>
      </View>
      
      <View style={styles.content}>
        <StyledText variant="h5" weight="600" style={styles.centerText}>
          Diagnose Screen
        </StyledText>
        <StyledText style={styles.centerText}>
          This screen will contain plant diagnosis features
        </StyledText>
      </View>
    </SafeAreaView>
  );
});

// Add display name for better debugging
DiagnoseScreen.displayName = 'DiagnoseScreen';

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
    marginBottom: Spacing.md,
  },
});

export default DiagnoseScreen; 