/**
 * Development Tools for TensorFlow Lite Model Testing
 * 
 * Herramientas para probar y debuggear el modelo en diferentes modos
 */

import { tfliteService, ModelResult } from '../services/tflite-service';
import { DEVELOPMENT_CONFIG, TEST_CASES, TestCaseKey, TestCaseData } from '../config/development-config';
import { devLogger } from '../services/development-logger';
import { modelSimulation } from '../services/model-simulation';

export interface TestResult {
  testCase: TestCaseKey;
  imageUri: string;
  result: ModelResult;
  isValid: boolean;
  expectedPredictions: string[];
  actualTopPrediction: string;
  confidence: number;
  processingTime: number;
}

export interface BenchmarkResult {
  totalTests: number;
  successfulTests: number;
  failedTests: number;
  averageProcessingTime: number;
  minProcessingTime: number;
  maxProcessingTime: number;
  testResults: TestResult[];
}

export class ModelTestingTools {
  /**
   * Ejecuta una prueba individual del modelo
   */
  async runSingleTest(testCase: TestCaseKey, imageUri?: string): Promise<TestResult> {
    const startTime = performance.now();
    
    devLogger.info(`Running test case: ${testCase}`, TEST_CASES[testCase]);
    
    // Generar URI de imagen de prueba si no se proporciona
    if (!imageUri) {
      imageUri = this.generateTestImageUri(testCase);
    }
    
    try {
      const result = await tfliteService.analyzeImage(imageUri);
      const topPrediction = result.predictions[0];
      const testCaseData = TEST_CASES[testCase];
        // Validar si el resultado es correcto
      const isValid = testCaseData.expectedPredictions.includes(topPrediction.className) &&
                     topPrediction.confidence >= testCaseData.confidenceRange[0] &&
                     topPrediction.confidence <= testCaseData.confidenceRange[1];
      
      const testResult: TestResult = {
        testCase,
        imageUri,
        result,
        isValid,
        expectedPredictions: [...testCaseData.expectedPredictions],
        actualTopPrediction: topPrediction.className,
        confidence: topPrediction.confidence,
        processingTime: performance.now() - startTime,
      };
      
      devLogger.info(`Test ${testCase} ${isValid ? 'PASSED' : 'FAILED'}`, {
        expected: testCaseData.expectedPredictions,
        actual: topPrediction.className,
        confidence: topPrediction.confidence,
      });
      
      return testResult;
    } catch (error) {
      devLogger.error(`Test ${testCase} ERROR`, error);
      throw error;
    }
  }
  
  /**
   * Ejecuta un benchmark completo del modelo
   */
  async runBenchmark(iterations: number = 1): Promise<BenchmarkResult> {
    devLogger.info(`Starting benchmark with ${iterations} iterations per test case`);
    
    const allTestResults: TestResult[] = [];
    const processingTimes: number[] = [];
    
    for (const testCase of Object.keys(TEST_CASES) as TestCaseKey[]) {
      for (let i = 0; i < iterations; i++) {
        try {
          const testResult = await this.runSingleTest(testCase);
          allTestResults.push(testResult);
          processingTimes.push(testResult.processingTime);
        } catch (error) {
          devLogger.error(`Benchmark test failed for ${testCase} iteration ${i}`, error);
        }
      }
    }
    
    const successfulTests = allTestResults.filter(r => r.isValid).length;
    const failedTests = allTestResults.length - successfulTests;
    
    const benchmarkResult: BenchmarkResult = {
      totalTests: allTestResults.length,
      successfulTests,
      failedTests,
      averageProcessingTime: processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length,
      minProcessingTime: Math.min(...processingTimes),
      maxProcessingTime: Math.max(...processingTimes),
      testResults: allTestResults,
    };
    
    devLogger.info('Benchmark completed', {
      successRate: `${((successfulTests / allTestResults.length) * 100).toFixed(1)}%`,
      avgTime: `${benchmarkResult.averageProcessingTime.toFixed(2)}ms`,
      minTime: `${benchmarkResult.minProcessingTime.toFixed(2)}ms`,
      maxTime: `${benchmarkResult.maxProcessingTime.toFixed(2)}ms`,
    });
    
    return benchmarkResult;
  }
  
  /**
   * Compara resultados entre modo simulado y modo real (si está disponible)
   */
  async compareSimulationVsReal(testCase: TestCaseKey, imageUri?: string): Promise<{
    simulationResult: ModelResult;
    realResult?: ModelResult;
    comparison?: {
      topPredictionMatch: boolean;
      confidenceDifference: number;
      processingTimeDifference: number;
    };
  }> {
    if (!imageUri) {
      imageUri = this.generateTestImageUri(testCase);
    }
    
    devLogger.info(`Comparing simulation vs real for test case: ${testCase}`);
    
    // Forzar modo simulación
    const originalForceSimulation = DEVELOPMENT_CONFIG.forceSimulationMode;
    (DEVELOPMENT_CONFIG as any).forceSimulationMode = true;
    
    const simulationResult = await tfliteService.analyzeImage(imageUri);
    
    // Restaurar configuración original
    (DEVELOPMENT_CONFIG as any).forceSimulationMode = originalForceSimulation;
    
    let realResult: ModelResult | undefined;
    let comparison: any;
    
    // Solo intentar modo real si TensorFlow Lite está disponible
    try {
      if (!originalForceSimulation) {
        realResult = await tfliteService.analyzeImage(imageUri);
        
        const simTop = simulationResult.predictions[0];
        const realTop = realResult.predictions[0];
        
        comparison = {
          topPredictionMatch: simTop.className === realTop.className,
          confidenceDifference: Math.abs(simTop.confidence - realTop.confidence),
          processingTimeDifference: Math.abs(simulationResult.processingTime - realResult.processingTime),
        };
        
        devLogger.info('Simulation vs Real comparison', comparison);
      }
    } catch (error) {
      devLogger.warn('Could not run real model comparison', error);
    }
    
    return {
      simulationResult,
      realResult,
      comparison,
    };
  }
  
  /**
   * Genera URI de imagen de prueba con palabras clave del caso de prueba
   */
  private generateTestImageUri(testCase: TestCaseKey): string {
    const testCaseData = TEST_CASES[testCase];
    const keywords = testCaseData.imageKeywords.join('_');
    return `file://test_image_${testCase}_${keywords}.jpg`;
  }
  
  /**
   * Obtiene información detallada del modelo
   */
  getModelInfo(): any {
    const info = tfliteService.getModelInfo();
    const perfStats = devLogger.getPerformanceStats();
    
    return {
      ...info,
      performanceStats: perfStats,
      developmentConfig: DEVELOPMENT_CONFIG,
      availableTestCases: Object.keys(TEST_CASES),
    };
  }
  
  /**
   * Resetea el estado del servicio para testing
   */
  async resetForTesting(): Promise<void> {
    devLogger.info('Resetting service for testing');
    await tfliteService.cleanup();
    devLogger.clearLogs();
  }
  
  /**
   * Genera reporte de testing en formato texto
   */
  generateTestReport(benchmarkResult: BenchmarkResult): string {
    const lines = [
      '=== TENSORFLOW LITE MODEL TEST REPORT ===',
      `Date: ${new Date().toISOString()}`,
      `Total Tests: ${benchmarkResult.totalTests}`,
      `Successful: ${benchmarkResult.successfulTests} (${((benchmarkResult.successfulTests / benchmarkResult.totalTests) * 100).toFixed(1)}%)`,
      `Failed: ${benchmarkResult.failedTests} (${((benchmarkResult.failedTests / benchmarkResult.totalTests) * 100).toFixed(1)}%)`,
      '',
      '=== PERFORMANCE METRICS ===',
      `Average Processing Time: ${benchmarkResult.averageProcessingTime.toFixed(2)}ms`,
      `Min Processing Time: ${benchmarkResult.minProcessingTime.toFixed(2)}ms`,
      `Max Processing Time: ${benchmarkResult.maxProcessingTime.toFixed(2)}ms`,
      '',
      '=== DETAILED RESULTS ===',
    ];
    
    benchmarkResult.testResults.forEach(result => {
      lines.push(`${result.testCase}: ${result.isValid ? 'PASS' : 'FAIL'} - ${result.actualTopPrediction} (${(result.confidence * 100).toFixed(1)}%) in ${result.processingTime.toFixed(2)}ms`);
    });
    
    lines.push('');
    lines.push('=== DEVELOPMENT LOGS ===');
    lines.push(devLogger.exportLogs());
    
    return lines.join('\n');
  }
}

// Singleton instance
export const modelTestingTools = new ModelTestingTools();
export default modelTestingTools;
