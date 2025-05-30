/**
 * Enhanced Model Simulation Service
 * 
 * Proporciona simulación realista del modelo TensorFlow Lite para desarrollo y testing
 */

import { PLANT_ANALYSIS_CONFIG, MODEL_RECOMMENDATIONS, PlantCondition } from '../config/model-config';
import { DEVELOPMENT_CONFIG, TEST_CASES, TestCaseKey, TestCaseData } from '../config/development-config';
import { devLogger } from './development-logger';

interface SimulationResult {
  confidences: Float32Array;
  metadata: {
    isSimulated: true;
    detectedPatterns: string[];
    processingTime: number;
    testCase?: TestCaseKey;
  };
}

export class ModelSimulationService {
  /**
   * Analiza el URI de imagen para detectar patrones que sugieran condiciones específicas
   */
  private analyzeImageUri(imageUri: string): string[] {
    const patterns: string[] = [];
    const lowerUri = imageUri.toLowerCase();
    
    // Buscar palabras clave en el nombre del archivo o path
    Object.entries(TEST_CASES).forEach(([key, testCase]) => {
      testCase.imageKeywords.forEach(keyword => {
        if (lowerUri.includes(keyword.toLowerCase())) {
          patterns.push(key);
          devLogger.simulation(`Detected pattern "${keyword}" suggesting "${key}" condition`);
        }
      });
    });
    
    return patterns;
  }
  
  /**
   * Genera confianzas basadas en patrones detectados
   */
  private generatePatternBasedConfidences(detectedPatterns: string[]): Float32Array {
    const classCount = PLANT_ANALYSIS_CONFIG.outputClasses.length;
    const confidences = new Float32Array(classCount);
    
    // Inicializar con valores base bajos
    for (let i = 0; i < classCount; i++) {
      confidences[i] = 0.01 + Math.random() * 0.05; // 1-6%
    }
    
    // Si se detectaron patrones, aumentar confianza para esas clases
    if (detectedPatterns.length > 0) {
      detectedPatterns.forEach(pattern => {
        const testCase = TEST_CASES[pattern as TestCaseKey];
        if (testCase) {
          testCase.expectedPredictions.forEach(prediction => {
            const classIndex = PLANT_ANALYSIS_CONFIG.outputClasses.indexOf(prediction);
            if (classIndex !== -1) {
              const [minConf, maxConf] = testCase.confidenceRange;
              confidences[classIndex] = minConf + Math.random() * (maxConf - minConf);
              devLogger.simulation(`Set confidence for "${prediction}": ${(confidences[classIndex] * 100).toFixed(1)}%`);
            }
          });
        }
      });
    } else {
      // Sin patrones detectados, generar resultado más balanceado
      // Favorecer "nodisease" (saludable) por defecto
      const healthyIndex = PLANT_ANALYSIS_CONFIG.outputClasses.indexOf('nodisease');
      if (healthyIndex !== -1) {
        confidences[healthyIndex] = 0.4 + Math.random() * 0.4; // 40-80%
      }
      
      // Distribuir el resto aleatoriamente
      const remaining = 1.0 - confidences[healthyIndex];
      const otherIndices = Array.from({length: classCount}, (_, i) => i).filter(i => i !== healthyIndex);
      
      otherIndices.forEach((index, i) => {
        const portion = remaining / otherIndices.length;
        confidences[index] = portion * (0.5 + Math.random() * 0.5); // Variación del 50-100% de la porción
      });
    }
    
    // Normalizar para que sumen 1.0
    const sum = confidences.reduce((a, b) => a + b, 0);
    for (let i = 0; i < classCount; i++) {
      confidences[i] /= sum;
    }
    
    return confidences;
  }
  
  /**
   * Simula tiempo de procesamiento variable
   */
  private simulateProcessingTime(): number {
    if (!DEVELOPMENT_CONFIG.simulation.variableProcessingTime) {
      return 150; // Tiempo fijo
    }
    
    // Simular variación realista de tiempo de procesamiento
    const baseTime = 120; // ms base
    const variation = 50; // ±50ms
    const networkLatency = Math.random() * 30; // 0-30ms latencia adicional
    
    return baseTime + (Math.random() - 0.5) * 2 * variation + networkLatency;
  }
  
  /**
   * Simula error ocasional para testing de manejo de errores
   */
  private shouldSimulateError(): boolean {
    if (!DEVELOPMENT_CONFIG.simulation.simulateErrors) return false;
    return Math.random() < DEVELOPMENT_CONFIG.simulation.errorProbability;
  }
    /**
   * Genera resultados simulados realistas
   */
  async generateSimulatedResults(imageUri?: string): Promise<SimulationResult> {
    const startTime = performance.now();
    
    devLogger.simulation('Starting enhanced simulation', { imageUri });
    
    if (this.shouldSimulateError()) {
      devLogger.simulation('Simulating error condition');
      throw new Error('Simulated model inference error for testing');
    }
    
    let detectedPatterns: string[] = [];
    let testCase: TestCaseKey | undefined;
    
    // Analizar imagen si está disponible y habilitado
    if (imageUri && DEVELOPMENT_CONFIG.simulation.useImageBasedResults) {
      detectedPatterns = this.analyzeImageUri(imageUri);
      if (detectedPatterns.length > 0) {
        testCase = detectedPatterns[0] as TestCaseKey;
      }
    }
    
    // Generar confianzas
    let confidences: Float32Array;
    if (DEVELOPMENT_CONFIG.simulation.enableRealisticResults) {
      confidences = this.generatePatternBasedConfidences(detectedPatterns);
    } else {
      // Simulación simple como antes
      confidences = this.generateSimpleRandomConfidences();
    }
    
    const processingTime = this.simulateProcessingTime();
    
    // Simular el tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    const result: SimulationResult = {
      confidences,
      metadata: {
        isSimulated: true,
        detectedPatterns,
        processingTime,
        testCase,
      },
    };
    
    devLogger.performance('Simulation completed', startTime, {
      detectedPatterns,
      testCase,
      topPrediction: this.getTopPrediction(confidences),
    }, 'SIMULATION');
    
    return result;
  }
  
  /**
   * Generación simple de confianzas (fallback)
   */
  private generateSimpleRandomConfidences(): Float32Array {
    const classCount = PLANT_ANALYSIS_CONFIG.outputClasses.length;
    const confidences = new Float32Array(classCount);
    
    let total = 0;
    for (let i = 0; i < classCount; i++) {
      confidences[i] = Math.random();
      total += confidences[i];
    }
    
    // Normalizar
    for (let i = 0; i < classCount; i++) {
      confidences[i] /= total;
    }
    
    // Hacer una clase más dominante
    const topClass = Math.floor(Math.random() * classCount);
    confidences[topClass] = Math.max(0.6, confidences[topClass]);
    
    return confidences;
  }
  
  /**
   * Obtiene la predicción con mayor confianza
   */
  private getTopPrediction(confidences: Float32Array): { className: string; confidence: number } {
    let maxIndex = 0;
    let maxConfidence = confidences[0];
    
    for (let i = 1; i < confidences.length; i++) {
      if (confidences[i] > maxConfidence) {
        maxConfidence = confidences[i];
        maxIndex = i;
      }
    }
    
    return {
      className: PLANT_ANALYSIS_CONFIG.outputClasses[maxIndex],
      confidence: maxConfidence,
    };
  }
  
  /**
   * Valida si un resultado simulado coincide con un caso de prueba esperado
   */
  validateSimulationResult(confidences: Float32Array, expectedTestCase?: TestCaseKey): boolean {
    if (!expectedTestCase) return true;
      const testCase = TEST_CASES[expectedTestCase];
    const topPrediction = this.getTopPrediction(confidences);
    
    const isExpectedClass = testCase.expectedPredictions.includes(topPrediction.className);
    const isInConfidenceRange = topPrediction.confidence >= testCase.confidenceRange[0] && 
                                topPrediction.confidence <= testCase.confidenceRange[1];
    
    devLogger.simulation('Validation result', {
      expectedTestCase,
      topPrediction,
      isExpectedClass,
      isInConfidenceRange,
      isValid: isExpectedClass && isInConfidenceRange,
    });
    
    return isExpectedClass && isInConfidenceRange;
  }
}

// Singleton instance
export const modelSimulation = new ModelSimulationService();
export default modelSimulation;
