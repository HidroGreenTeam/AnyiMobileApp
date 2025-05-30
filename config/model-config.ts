/**
 * TensorFlow Lite Model Configuration - Perú Coffee Disease Detection
 * 
 * Configuración específica para el análisis de enfermedades del café en Perú.
 * Incluye recomendaciones adaptadas a las condiciones agronómicas peruanas.
 */

export interface ModelConfig {
  modelPath: string;
  inputSize: {
    width: number;
    height: number;
  };
  outputClasses: string[];
  confidenceThreshold: number;
  maxPredictions: number;
}

export const PLANT_ANALYSIS_CONFIG: ModelConfig = {
  modelPath: 'assets/model/model.tflite',
  inputSize: {
    width: 300,
    height: 300,
  },
  outputClasses: [
    'miner',
    'nodisease',
    'phoma',
    'redspider',
    'rust',
  ],
  confidenceThreshold: 0.1, // Solo mostrar predicciones con más del 10% de confianza
  maxPredictions: 3, // Mostrar las 3 mejores predicciones
};

export const MODEL_RECOMMENDATIONS = {
  'miner': {
    diagnosis: 'Minador de la hoja del café detectado',
    recommendations: [
      'Aplica insecticida específico para minadores (ej: Thiamethoxam)',
      'Remueve y quema las hojas afectadas para evitar propagación',
      'Mejora la ventilación entre plantas',
      'Monitorea semanalmente para detectar nuevos brotes',
      'Considera uso de trampas amarillas pegajosas',
    ],
    severity: 'high',
    prevalence_peru: 'Alta en zonas cafetaleras de Junín y San Martín',
  },
  'nodisease': {
    diagnosis: 'Planta de café saludable',
    recommendations: [
      'Continúa con el manejo integrado del cultivo',
      'Mantén programa de fertilización con NPK según análisis de suelo',
      'Asegúrate de que reciba 4-6 horas de luz solar directa',
      'Continúa con podas sanitarias cada 6 meses',
      'Mantén distancia de siembra de 2x2 metros',
    ],
    severity: 'low',
    prevalence_peru: 'Estado objetivo en todas las regiones cafetaleras',
  },
  'phoma': {
    diagnosis: 'Enfermedad fúngica Phoma detectada',
    recommendations: [
      'Aplica fungicida sistémico (ej: Tebuconazole 25%)',
      'Mejora drenaje del suelo para evitar encharcamientos',
      'Reduce humedad excesiva podando ramas bajas',
      'Remueve y quema partes afectadas inmediatamente',
      'Aumenta espaciamiento entre plantas para mejor aireación',
      'Aplica cada 15 días hasta control total',
    ],
    severity: 'high',
    prevalence_peru: 'Común en épocas lluviosas en Amazonas y Cajamarca',
  },
  'redspider': {
    diagnosis: 'Araña roja (Tetranychus urticae) detectada',
    recommendations: [
      'Aplica acaricida específico (ej: Abamectina 1.8%)',
      'Aumenta humedad relativa con riego por aspersión temprano',
      'Mejora ventilación natural podando exceso de follaje',
      'Inspecciona plantas vecinas en radio de 50 metros',
      'Introduce enemigos naturales: Neoseiulus californicus',
      'Evita uso excesivo de insecticidas que eliminen depredadores',
    ],
    severity: 'high',
    prevalence_peru: 'Muy común en época seca (mayo-septiembre) en costa y sierra',
  },
  'rust': {
    diagnosis: 'Roya del café (Hemileia vastatrix) detectada - EMERGENCIA',
    recommendations: [
      'URGENTE: Aplica fungicida sistémico (ej: Propiconazole + Azoxystrobin)',
      'Incrementa frecuencia de aplicación: cada 21 días por 3 meses',
      'Mejora ventilación: poda selectiva de ramas improductivas',
      'Reduce densidad de siembra si supera 2500 plantas/ha',
      'Implementa programa de nutrición con Cobre + Zinc',
      'Considera replanteo con variedades resistentes (Catimor, Caturra)',
      'Notifica a SENASA para registro fitosanitario',
    ],
    severity: 'critical',
    prevalence_peru: 'Endémica - principal amenaza en Cusco, Puno y selva central',
  },
} as const;

export type PlantCondition = keyof typeof MODEL_RECOMMENDATIONS;
