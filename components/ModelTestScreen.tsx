/**
 * Componente de prueba para el modelo TensorFlow Lite
 * 
 * Este componente te permite probar rápidamente el modelo y ver
 * información detallada sobre su funcionamiento.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { tfliteService } from '../services/tflite-service';
import * as ImagePicker from 'expo-image-picker';

interface ModelTestResult {
  isLoaded: boolean;
  isSimulation: boolean;
  processingTime?: number;
  predictions?: any[];
  error?: string;
}

export default function ModelTestScreen() {
  const [testResult, setTestResult] = useState<ModelTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState<any>(null);

  useEffect(() => {
    initializeModel();
  }, []);

  const initializeModel = async () => {
    try {
      setIsLoading(true);
      await tfliteService.initializeModel();
      const info = tfliteService.getModelInfo();
      setModelInfo(info);
    } catch (error) {
      console.error('Error initializing model:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testWithCamera = async () => {
    try {
      setIsLoading(true);
      
      // Solicitar permisos
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Error', 'Se necesitan permisos de cámara para esta función');
        return;
      }

      // Tomar foto
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error with camera:', error);
      setTestResult({
        isLoaded: false,
        isSimulation: false,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testWithGallery = async () => {
    try {
      setIsLoading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error with gallery:', error);
      setTestResult({
        isLoaded: false,
        isSimulation: false,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testSimulation = async () => {
    try {
      setIsLoading(true);
      await analyzeImage('simulation://test-image');
    } catch (error) {
      console.error('Error with simulation:', error);
      setTestResult({
        isLoaded: false,
        isSimulation: false,
        error: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    try {
      const startTime = Date.now();
      const result = await tfliteService.analyzeImage(imageUri);
      const endTime = Date.now();

      setTestResult({
        isLoaded: true,
        isSimulation: modelInfo?.isSimulation || false,
        processingTime: endTime - startTime,
        predictions: result.predictions,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      setTestResult({
        isLoaded: false,
        isSimulation: false,
        error: error.message,
      });
    }
  };

  const getStatusColor = () => {
    if (!modelInfo) return '#999';
    if (modelInfo.isSimulation) return '#FF9500';
    return modelInfo.isLoaded ? '#34C759' : '#FF3B30';
  };

  const getStatusText = () => {
    if (!modelInfo) return 'Verificando...';
    if (modelInfo.isSimulation) return 'Modo Simulación';
    return modelInfo.isLoaded ? 'Modelo Cargado' : 'Modelo No Disponible';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Prueba del Modelo TensorFlow Lite</Text>
        
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>

      {modelInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>📊 Información del Modelo</Text>
          <Text style={styles.infoText}>Estado: {modelInfo.isLoaded ? 'Cargado' : 'No cargado'}</Text>
          <Text style={styles.infoText}>Modo: {modelInfo.isSimulation ? 'Simulación' : 'Real'}</Text>
          {modelInfo.config && (
            <>
              <Text style={styles.infoText}>Clases: {modelInfo.config.outputClasses.length}</Text>
              <Text style={styles.infoText}>Umbral: {modelInfo.config.confidenceThreshold}</Text>
            </>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          onPress={testWithCamera}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>📷 Probar con Cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.galleryButton]}
          onPress={testWithGallery}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🖼️ Probar con Galería</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.simulationButton]}
          onPress={testSimulation}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🎯 Probar Simulación</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      )}

      {testResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.sectionTitle}>🔍 Resultados de la Prueba</Text>
          
          {testResult.error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ Error: {testResult.error}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.resultText}>
                ⏱️ Tiempo de procesamiento: {testResult.processingTime}ms
              </Text>
              <Text style={styles.resultText}>
                🤖 Modo: {testResult.isSimulation ? 'Simulación' : 'Modelo Real'}
              </Text>
              
              {testResult.predictions && testResult.predictions.length > 0 && (
                <View style={styles.predictionsContainer}>
                  <Text style={styles.predictionsTitle}>🏆 Predicciones:</Text>
                  {testResult.predictions.map((prediction, index) => (
                    <View key={index} style={styles.predictionItem}>
                      <Text style={styles.predictionClass}>
                        {index + 1}. {prediction.className}
                      </Text>
                      <Text style={styles.predictionConfidence}>
                        {(prediction.confidence * 100).toFixed(1)}%
                      </Text>
                      {prediction.recommendations && (
                        <Text style={styles.predictionDiagnosis}>
                          {prediction.recommendations.diagnosis}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  cameraButton: {
    backgroundColor: '#007AFF',
  },
  galleryButton: {
    backgroundColor: '#34C759',
  },
  simulationButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 12,
    borderRadius: 6,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  predictionsContainer: {
    marginTop: 12,
  },
  predictionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  predictionItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  predictionClass: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  predictionConfidence: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  predictionDiagnosis: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
