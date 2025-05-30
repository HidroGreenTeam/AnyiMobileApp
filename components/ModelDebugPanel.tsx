/**
 * Development Debug Panel Component
 * 
 * Panel de debugging para probar el modelo TensorFlow Lite durante el desarrollo
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { modelTestingTools, TestResult, BenchmarkResult } from '../services/model-testing-tools';
import { tfliteService } from '../services/tflite-service';
import { DEVELOPMENT_CONFIG, TEST_CASES, TestCaseKey } from '../config/development-config';
import { devLogger } from '../services/development-logger';

interface DebugPanelProps {
  visible: boolean;
  onClose: () => void;
}

export function ModelDebugPanel({ visible, onClose }: DebugPanelProps) {
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<TestResult | null>(null);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      refreshModelInfo();
      loadRecentLogs();
    }
  }, [visible]);

  const refreshModelInfo = () => {
    const info = modelTestingTools.getModelInfo();
    setModelInfo(info);
  };

  const loadRecentLogs = () => {
    const recentLogs = devLogger.getLogs('INFO');
    const logMessages = recentLogs.slice(-10).map(log => 
      `[${log.level}] ${log.message} ${log.data ? JSON.stringify(log.data) : ''}`
    );
    setLogs(logMessages);
  };

  const runQuickTest = async () => {
    setIsRunningTest(true);
    try {
      const result = await modelTestingTools.runSingleTest('healthy');
      setLastTestResult(result);      Alert.alert(
        'Quick Test Result',
        `${result.isValid ? '✅ PASSED' : '❌ FAILED'}\n` +
        `Prediction: ${result.actualTopPrediction}\n` +
        `Confidence: ${(result.confidence * 100).toFixed(1)}%\n` +
        `Time: ${result.processingTime.toFixed(2)}ms`
      );
    } catch (error) {
      Alert.alert('Test Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsRunningTest(false);
      loadRecentLogs();
    }
  };

  const runSpecificTest = (testCase: TestCaseKey) => {
    Alert.alert(
      'Select Test Type',
      `Test case: ${testCase}`,
      [
        {
          text: 'Single Test',
          onPress: () => runSingleTest(testCase),
        },
        {
          text: 'With Comparison',
          onPress: () => runComparisonTest(testCase),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };
  const runSingleTest = async (testCase: TestCaseKey) => {
    setIsRunningTest(true);
    try {
      const result = await modelTestingTools.runSingleTest(testCase);
      setLastTestResult(result);
    } catch (error) {
      Alert.alert('Test Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsRunningTest(false);
      loadRecentLogs();
    }
  };

  const runComparisonTest = async (testCase: TestCaseKey) => {
    setIsRunningTest(true);
    try {
      const comparison = await modelTestingTools.compareSimulationVsReal(testCase);
      
      let message = `Simulation: ${comparison.simulationResult.predictions[0]?.className} (${(comparison.simulationResult.predictions[0]?.confidence * 100).toFixed(1)}%)\n`;
      
      if (comparison.realResult) {
        message += `Real: ${comparison.realResult.predictions[0]?.className} (${(comparison.realResult.predictions[0]?.confidence * 100).toFixed(1)}%)\n`;
        if (comparison.comparison) {
          message += `Match: ${comparison.comparison.topPredictionMatch ? 'Yes' : 'No'}`;
        }
      } else {
        message += 'Real model not available';
      }
        Alert.alert('Comparison Result', message);
    } catch (error) {
      Alert.alert('Comparison Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsRunningTest(false);
      loadRecentLogs();
    }
  };

  const runBenchmark = async () => {
    setIsRunningTest(true);
    try {
      const result = await modelTestingTools.runBenchmark(2);
      setBenchmarkResult(result);
      Alert.alert(
        'Benchmark Complete',
        `Tests: ${result.totalTests}\n` +
        `Success Rate: ${((result.successfulTests / result.totalTests) * 100).toFixed(1)}%\n` +
        `Avg Time: ${result.averageProcessingTime.toFixed(2)}ms`      );
    } catch (error) {
      Alert.alert('Benchmark Failed', error instanceof Error ? error.message : String(error));
    } finally {
      setIsRunningTest(false);
      loadRecentLogs();
    }
  };

  const toggleSimulationMode = () => {
    Alert.alert(
      'Toggle Simulation Mode',
      `Currently: ${DEVELOPMENT_CONFIG.forceSimulationMode ? 'Simulation' : 'Auto-detect'}`,
      [
        {
          text: 'Force Simulation',
          onPress: () => {
            (DEVELOPMENT_CONFIG as any).forceSimulationMode = true;
            refreshModelInfo();
          },
        },
        {
          text: 'Auto-detect',
          onPress: () => {
            (DEVELOPMENT_CONFIG as any).forceSimulationMode = false;
            refreshModelInfo();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const clearLogs = () => {
    devLogger.clearLogs();
    setLogs([]);
    Alert.alert('Logs Cleared', 'Development logs have been cleared.');
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Model Debug Panel</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Model Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Model Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={[styles.infoValue, { color: modelInfo?.isLoaded ? '#4CAF50' : '#F44336' }]}>
              {modelInfo?.isLoaded ? '✅ Loaded' : '❌ Not Loaded'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mode:</Text>
            <Text style={[styles.infoValue, { color: modelInfo?.isSimulation ? '#FF9800' : '#4CAF50' }]}>
              {modelInfo?.isSimulation ? '🎭 Simulation' : '🧠 Real Model'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Classes:</Text>
            <Text style={styles.infoValue}>{modelInfo?.config?.outputClasses?.length || 0}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={runQuickTest}
              disabled={isRunningTest}
            >
              <Text style={styles.buttonText}>
                {isRunningTest ? '⏳ Testing...' : '🚀 Quick Test'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={runBenchmark}
              disabled={isRunningTest}
            >
              <Text style={styles.buttonText}>📊 Benchmark</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={toggleSimulationMode}
            >
              <Text style={styles.buttonText}>🎭 Toggle Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={clearLogs}
            >
              <Text style={styles.buttonText}>🗑️ Clear Logs</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Test Cases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Test Cases</Text>
          {Object.entries(TEST_CASES).map(([key, data]) => (
            <TouchableOpacity
              key={key}
              style={styles.testCaseButton}
              onPress={() => runSpecificTest(key as TestCaseKey)}
              disabled={isRunningTest}
            >
              <Text style={styles.testCaseName}>{key}</Text>
              <Text style={styles.testCaseDescription}>{data.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Last Test Result */}
        {lastTestResult && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Last Test Result</Text>
            <View style={styles.resultContainer}>
              <Text style={[styles.resultStatus, { 
                color: lastTestResult.isValid ? '#4CAF50' : '#F44336' 
              }]}>
                {lastTestResult.isValid ? '✅ PASSED' : '❌ FAILED'}
              </Text>
              <Text style={styles.resultText}>
                Test: {lastTestResult.testCase}
              </Text>
              <Text style={styles.resultText}>
                Predicted: {lastTestResult.actualTopPrediction} ({(lastTestResult.confidence * 100).toFixed(1)}%)
              </Text>
              <Text style={styles.resultText}>
                Expected: {lastTestResult.expectedPredictions.join(', ')}
              </Text>
              <Text style={styles.resultText}>
                Time: {lastTestResult.processingTime.toFixed(2)}ms
              </Text>
            </View>
          </View>
        )}

        {/* Recent Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Recent Logs</Text>
          <View style={styles.logsContainer}>
            {logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#CCCCCC',
  },
  infoValue: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  testCaseButton: {
    padding: 12,
    backgroundColor: '#333333',
    borderRadius: 6,
    marginBottom: 8,
  },
  testCaseName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  testCaseDescription: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 2,
  },
  resultContainer: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 6,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    color: 'white',
    marginBottom: 4,
  },
  logsContainer: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 6,
    maxHeight: 200,
  },
  logText: {
    color: '#00FF00',
    fontSize: 10,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});
