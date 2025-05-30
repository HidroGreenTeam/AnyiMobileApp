import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { StyledText } from '@/components/StyledText';
import { StyleColors, Spacing } from '@/constants';
import { AnalysisResult } from '@/services/tflite-service';
import { useTabBarPadding } from '@/hooks/useTabBarPadding';
import { t } from 'i18next';

// Use React.memo to prevent unnecessary re-renders
const DiagnoseScreen = memo(() => {
  const params = useLocalSearchParams();
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const tabBarPadding = useTabBarPadding();

  useEffect(() => {
    if (params.analysisData) {
      try {
        const data = JSON.parse(params.analysisData as string);
        setAnalysisData(data);
      } catch (error) {
        console.error('Error parsing analysis data:', error);
        Alert.alert('Error', 'No se pudieron cargar los resultados del análisis');
      }
    }
  }, [params.analysisData]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return StyleColors.state.success;
    if (confidence >= 0.6) return StyleColors.state.warning;
    return StyleColors.state.error;
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.6) return 'Media';
    return 'Baja';
  };

  if (!analysisData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <StyledText variant="h4" weight="700">
            {t('Diagnose')}
          </StyledText>
        </View>
        
        <View style={styles.content}>
          <StyledText variant="h5" weight="600" style={styles.centerText}>
            Diagnóstico de Plantas
          </StyledText>
          <StyledText style={styles.centerText}>
            Toma una foto para analizar el estado de tu planta
          </StyledText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <StyledText variant="h4" weight="700">
          Resultados del Análisis
        </StyledText>
        <StyledText style={styles.timestamp}>
          {formatTimestamp(analysisData.timestamp)}
        </StyledText>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarPadding }}
      >
        {/* Image Preview */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: analysisData.image }} style={styles.analysisImage} />
        </View>

        {/* Analysis Results */}
        <View style={styles.resultsContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="analytics" size={24} color={StyleColors.brand.primary} />
            <StyledText variant="h5" weight="600" style={styles.sectionTitle}>
              Resultados del Diagnóstico
            </StyledText>
          </View>

          {analysisData.results.predictions.length > 0 ? (
            <View style={styles.predictionsContainer}>
              {analysisData.results.predictions.map((prediction, index) => (
                <View key={index} style={styles.predictionCard}>
                  <View style={styles.predictionHeader}>
                    <StyledText variant="h6" weight="600" style={styles.predictionName}>
                      {prediction.className}
                    </StyledText>
                    <View style={[
                      styles.confidenceBadge, 
                      { backgroundColor: getConfidenceColor(prediction.confidence) }
                    ]}>
                      <StyledText style={styles.confidenceText}>
                        {getConfidenceText(prediction.confidence)}
                      </StyledText>
                    </View>
                  </View>
                    <View style={styles.confidenceBar}>
                    <View 
                      style={[
                        styles.confidenceFill, 
                        { 
                          width: `${prediction.confidence * 100}%`,
                          backgroundColor: getConfidenceColor(prediction.confidence)
                        }
                      ]} 
                    />
                  </View>
                  
                  <StyledText style={styles.confidencePercentage}>
                    Confianza: {(prediction.confidence * 100).toFixed(1)}%
                  </StyledText>

                  {/* Recommendations */}
                  {prediction.recommendations && (
                    <View style={styles.recommendationsContainer}>
                      <View style={styles.diagnosisContainer}>
                        <Ionicons 
                          name="medical" 
                          size={16} 
                          color={prediction.recommendations.severity === 'high' ? StyleColors.state.error : 
                                prediction.recommendations.severity === 'medium' ? StyleColors.state.warning : 
                                StyleColors.state.success} 
                        />
                        <StyledText style={styles.diagnosisText}>
                          {prediction.recommendations.diagnosis}
                        </StyledText>
                      </View>
                      
                      <View style={styles.recommendationsList}>
                        <StyledText style={styles.recommendationsTitle}>
                          Recomendaciones:
                        </StyledText>
                        {prediction.recommendations.recommendations.map((rec: string, recIndex: number) => (
                          <View key={recIndex} style={styles.recommendationItem}>
                            <StyledText style={styles.recommendationBullet}>•</StyledText>
                            <StyledText style={styles.recommendationText}>{rec}</StyledText>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="alert-circle" size={48} color={StyleColors.grey.grey3} />
              <StyledText style={styles.noResultsText}>
                No se pudieron detectar patrones reconocibles en la imagen
              </StyledText>
            </View>
          )}

          {/* Processing Time */}
          <View style={styles.processingInfo}>
            <Ionicons name="time" size={16} color={StyleColors.grey.grey2} />
            <StyledText style={styles.processingText}>
              Procesado en {analysisData.results.processingTime}ms
            </StyledText>
          </View>
        </View>
      </ScrollView>
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
  timestamp: {
    fontSize: 12,
    color: StyleColors.grey.grey2,
    marginTop: Spacing.xs,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  analysisImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  resultsContainer: {
    backgroundColor: StyleColors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginLeft: Spacing.sm,
    color: StyleColors.grey.grey1,
  },
  predictionsContainer: {
    gap: Spacing.md,
  },
  predictionCard: {
    backgroundColor: StyleColors.grey.grey5,
    borderRadius: 8,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: StyleColors.brand.primary,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  predictionName: {
    flex: 1,
    color: StyleColors.grey.grey1,
  },
  confidenceBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    color: StyleColors.white,
    fontWeight: '600',
  },
  confidenceBar: {
    height: 8,
    backgroundColor: StyleColors.grey.grey4,
    borderRadius: 4,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidencePercentage: {
    fontSize: 12,
    color: StyleColors.grey.grey2,
    textAlign: 'right',
  },
  recommendationsContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: StyleColors.grey.grey4,
  },
  diagnosisContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  diagnosisText: {
    marginLeft: Spacing.xs,
    fontSize: 14,
    fontWeight: '600',
    color: StyleColors.grey.grey1,
    flex: 1,
  },
  recommendationsList: {
    marginTop: Spacing.sm,
  },
  recommendationsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: StyleColors.grey.grey2,
    marginBottom: Spacing.xs,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  recommendationBullet: {
    color: StyleColors.brand.primary,
    fontWeight: 'bold',
    marginRight: Spacing.xs,
    marginTop: 1,
  },
  recommendationText: {
    flex: 1,
    fontSize: 12,
    color: StyleColors.grey.grey2,
    lineHeight: 16,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noResultsText: {
    marginTop: Spacing.md,
    textAlign: 'center',
    color: StyleColors.grey.grey3,
  },
  processingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: StyleColors.grey.grey5,
  },
  processingText: {
    marginLeft: Spacing.xs,
    fontSize: 12,
    color: StyleColors.grey.grey2,
  },
});

export default DiagnoseScreen;