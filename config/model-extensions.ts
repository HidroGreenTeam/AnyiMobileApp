/**
 * Configuración para futuras extensiones del modelo de análisis de café
 * 
 * Este archivo permite agregar nuevas clases de detección sin modificar
 * la configuración principal del modelo.
 */

export interface ExtendedModelConfig {
  version: string;
  lastUpdated: string;
  futureClasses?: string[];
  experimentalFeatures?: {
    multiCrop: boolean;
    severityLevels: boolean;
    diseaseProgression: boolean;
  };
}

/**
 * Configuración para futuras clases de café que se pueden agregar
 */
export const FUTURE_COFFEE_CLASSES = [
  'leaf_spot',       // Mancha de la hoja
  'cherry_borer',    // Perforador del fruto
  'anthracnose',     // Antracnosis
  'black_rot',       // Pudrición negra
  'scale_insects',   // Insectos escama
  'thrips',          // Trips
  'bacterial_blight', // Tizón bacteriano
  'sooty_mold',      // Fumagina
  'white_stem_borer', // Perforador blanco del tallo
  'coffee_berry_disease' // Enfermedad del fruto del café
];

/**
 * Mapeo de severidad por enfermedad para futuras implementaciones
 */
export const DISEASE_SEVERITY_MAPPING = {
  'rust': 'critical',         // Roya = crítico
  'phoma': 'high',            // Phoma = alto
  'redspider': 'medium',      // Araña roja = medio
  'miner': 'medium',          // Minador = medio
  'nodisease': 'none',        // Sin enfermedad = ninguno
} as const;

/**
 * Configuración para modelos regionales específicos
 */
export interface RegionalModelConfig {
  region: string;
  climate: 'tropical' | 'subtropical' | 'temperate';
  altitude: 'low' | 'medium' | 'high';
  commonDiseases: string[];
  seasonalFactors: {
    rainySeasonDiseases: string[];
    drySeasonDiseases: string[];
  };
}

/**
 * Ejemplo de configuración regional para Colombia
 */
export const COLOMBIA_COFFEE_CONFIG: RegionalModelConfig = {
  region: 'Colombia',
  climate: 'tropical',
  altitude: 'high',
  commonDiseases: ['rust', 'phoma', 'redspider'],
  seasonalFactors: {
    rainySeasonDiseases: ['rust', 'phoma'],
    drySeasonDiseases: ['redspider', 'miner']
  }
};

/**
 * Configuración experimental para múltiples cultivos
 */
export const MULTI_CROP_CONFIG = {
  enabled: false, // Para futuras implementaciones
  supportedCrops: ['coffee', 'cacao', 'banana'],
  modelPaths: {
    coffee: 'assets/model/coffee-model.tflite',
    cacao: 'assets/model/cacao-model.tflite',
    banana: 'assets/model/banana-model.tflite'
  }
};

export default {
  FUTURE_COFFEE_CLASSES,
  DISEASE_SEVERITY_MAPPING,
  COLOMBIA_COFFEE_CONFIG,
  MULTI_CROP_CONFIG
};
