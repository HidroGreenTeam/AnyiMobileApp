/**
 * Development Configuration for TensorFlow Lite Model Testing
 * 
 * Esta configuración permite probar la funcionalidad del modelo tanto en modo simulado
 * como con el modelo real, facilitando el desarrollo y debugging.
 */

export interface TestCaseData {
  description: string;
  expectedPredictions: string[];
  confidenceRange: [number, number];
  imageKeywords: string[];
}

export interface DevelopmentConfig {
  // Modo de operación
  forceSimulationMode: boolean;
  enableDetailedLogging: boolean;
  
  // Configuración de simulación
  simulation: {
    enableRealisticResults: boolean;
    useImageBasedResults: boolean;
    variableProcessingTime: boolean;
    simulateErrors: boolean;
    errorProbability: number;
  };
  
  // Configuración de debugging
  debugging: {
    logModelOutputs: boolean;
    logImagePreprocessing: boolean;
    logPerformanceMetrics: boolean;
    saveAnalysisHistory: boolean;
  };
  
  // Configuración de testing
  testing: {
    enableBenchmarking: boolean;
    autoGenerateTestCases: boolean;
    enableComparison: boolean;
  };
}

export const DEVELOPMENT_CONFIG: DevelopmentConfig = {
  // Controla si forzar modo simulación independientemente de disponibilidad de TFLite
  forceSimulationMode: false, // Cambia a true para forzar simulación
  enableDetailedLogging: __DEV__, // Solo en desarrollo
  
  simulation: {
    enableRealisticResults: true, // Resultados más realistas basados en patrones
    useImageBasedResults: true, // Simular resultados basados en nombre/características de imagen
    variableProcessingTime: true, // Simular tiempos de procesamiento variables
    simulateErrors: false, // Simular errores ocasionales para testing
    errorProbability: 0.05, // 5% probabilidad de error en simulación
  },
  
  debugging: {
    logModelOutputs: true, // Log detallado de salidas del modelo
    logImagePreprocessing: true, // Log del preprocesamiento de imágenes
    logPerformanceMetrics: true, // Métricas de rendimiento detalladas
    saveAnalysisHistory: true, // Guardar historial de análisis para revisión
  },
  
  testing: {
    enableBenchmarking: true, // Habilitar benchmarking de rendimiento
    autoGenerateTestCases: false, // Auto-generar casos de prueba
    enableComparison: true, // Comparar resultados simulados vs reales
  },
};

/**
 * Configuración de casos de prueba predefinidos
 */
export const TEST_CASES: Record<string, TestCaseData> = {
  healthy: {
    description: 'Planta de café saludable',
    expectedPredictions: ['nodisease'],
    confidenceRange: [0.7, 0.95],
    imageKeywords: ['healthy', 'green', 'normal', 'good'],
  },
  rust: {
    description: 'Roya del café',
    expectedPredictions: ['rust'],
    confidenceRange: [0.6, 0.9],
    imageKeywords: ['rust', 'roya', 'orange', 'yellow', 'spots'],
  },
  miner: {
    description: 'Minador de la hoja',
    expectedPredictions: ['miner'],
    confidenceRange: [0.5, 0.85],
    imageKeywords: ['miner', 'minador', 'tunnels', 'lines', 'tracks'],
  },
  phoma: {
    description: 'Enfermedad fúngica Phoma',
    expectedPredictions: ['phoma'],
    confidenceRange: [0.4, 0.8],
    imageKeywords: ['phoma', 'fungus', 'brown', 'spots', 'lesions'],
  },
  redspider: {
    description: 'Araña roja',
    expectedPredictions: ['redspider'],
    confidenceRange: [0.5, 0.85],
    imageKeywords: ['spider', 'araña', 'red', 'mites', 'webbing'],
  },
  mixed: {
    description: 'Múltiples condiciones',
    expectedPredictions: ['rust', 'miner'],
    confidenceRange: [0.3, 0.7],
    imageKeywords: ['multiple', 'mixed', 'complex'],  },
};

/**
 * Configuración de logs para diferentes niveles
 */
export const LOG_CONFIG = {
  levels: {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4,
  },
  currentLevel: __DEV__ ? 3 : 1, // DEBUG en desarrollo, WARN en producción
  colors: {
    ERROR: '🔴',
    WARN: '🟡',
    INFO: '🔵',
    DEBUG: '🟢',
    TRACE: '⚪',
  },
  prefixes: {
    MODEL: '🤖',
    IMAGE: '📸',
    PERFORMANCE: '⚡',
    SIMULATION: '🎭',
    TFLITE: '🧠',
  },
};

export type TestCaseKey = keyof typeof TEST_CASES;
export type LogLevel = keyof typeof LOG_CONFIG.levels;
export type LogPrefix = keyof typeof LOG_CONFIG.prefixes;
