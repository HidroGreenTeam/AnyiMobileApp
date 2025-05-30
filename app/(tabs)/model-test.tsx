/**
 * Pantalla de testing del modelo TensorFlow Lite con herramientas de desarrollo avanzadas
 * 
 * Esta pantalla incluye herramientas para probar tanto modo simulado como real,
 * benchmarking, y debugging del modelo.
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ModelTestScreen from '@/components/ModelTestScreen';
import { ModelDebugPanel } from '@/components/ModelDebugPanel';
import { DEVELOPMENT_CONFIG } from '@/config/development-config';

export default function ModelTestTab() {
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Solo mostrar en modo desarrollo
  if (!__DEV__ || !DEVELOPMENT_CONFIG.enableDetailedLogging) {
    return (
      <View style={styles.container}>
        <ModelTestScreen />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ModelTestScreen />
      
      {/* Botón para abrir panel de debug */}
      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => setShowDebugPanel(true)}
      >
        <Text style={styles.debugButtonText}>🧪 Debug Panel</Text>
      </TouchableOpacity>

      {/* Panel de debugging */}
      <ModelDebugPanel 
        visible={showDebugPanel}
        onClose={() => setShowDebugPanel(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  debugButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
