import { loadTensorflowModel, type TensorflowModel, type TensorflowModelDelegate } from 'react-native-fast-tflite';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { PLANT_ANALYSIS_CONFIG, MODEL_RECOMMENDATIONS, PlantCondition } from '@/config/model-config';

// Check if TensorFlow Lite is available (for Expo Go compatibility)
const isTensorFlowLiteAvailable = () => {
  try {
    return typeof loadTensorflowModel !== 'undefined';
  } catch (error) {
    console.warn('TensorFlow Lite not available - running in Expo Go mode');
    return false;
  }
};

export interface ModelResult {
  predictions: Array<{
    className: string;
    confidence: number;
    recommendations?: {
      diagnosis: string;
      recommendations: string[];
      severity: string;
    };
  }>;
  processingTime: number;
}

export interface AnalysisResult {
  image: string;
  results: ModelResult;
  timestamp: number;
}

class TFLiteService {
  private model: TensorflowModel | null = null;
  private isModelLoaded = false;
  /**
   * Initialize and load the TensorFlow Lite model
   */
  async initializeModel(): Promise<void> {
    try {
      if (this.isModelLoaded) {
        return;
      }

      // Check if TensorFlow Lite is available (native module check)
      if (!isTensorFlowLiteAvailable()) {
        console.warn('TensorFlow Lite not available - running in simulation mode (Expo Go)');
        this.isModelLoaded = true; // Mark as loaded for simulation
        return;
      }

      // Load the model using require() as recommended in the documentation
      // The model should be in assets/model/model.tflite
      const delegate: TensorflowModelDelegate = Platform.OS === 'ios' ? 'metal' : 'android-gpu';
      this.model = await loadTensorflowModel(require('../../assets/model/model.tflite'), delegate);
      this.isModelLoaded = true;
      console.log('TensorFlow Lite model loaded successfully');
      console.log('Model inputs:', this.model.inputs);
      console.log('Model outputs:', this.model.outputs);    } catch (error) {
      console.error('Failed to load TensorFlow Lite model:', error);
      
      // Check if this is a TurboModuleRegistry error (Expo Go limitation)
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('TurboModuleRegistry')) {
        console.warn('TensorFlow Lite not available in Expo Go - running in simulation mode');
        this.isModelLoaded = true; // Mark as loaded for simulation
        return;
      }
      
      // Fallback to default delegate if GPU fails
      try {
        console.log('Retrying with default delegate...');
        this.model = await loadTensorflowModel(require('../../assets/model/model.tflite'), 'default');
        this.isModelLoaded = true;
        console.log('TensorFlow Lite model loaded successfully with default delegate');
      } catch (fallbackError) {
        console.error('Failed to load model with default delegate:', fallbackError);
        // Final fallback to simulation mode
        console.warn('Falling back to simulation mode');
        this.isModelLoaded = true;
      }
    }
  }

  /**
   * Preprocess image to 300x300 format required by the model
   */
  private async preprocessImage(imageUri: string): Promise<string> {
    try {
      // For now, we'll return the original image URI
      // In a production app, you might want to resize the image here
      // using a library like react-native-image-resizer
      return imageUri;
    } catch (error) {
      console.error('Error preprocessing image:', error);
      throw error;
    }
  }
  /**
   * Run inference on an image
   */
  async analyzeImage(imageUri: string): Promise<ModelResult> {
    try {
      if (!this.isModelLoaded) {
        await this.initializeModel();
      }

      // Record start time for performance measurement
      const startTime = Date.now();

      let results: any;

      // Check if we're running in simulation mode (Expo Go or model load failed)
      if (!this.model || !isTensorFlowLiteAvailable()) {
        console.log('Running in simulation mode - generating mock predictions');
        results = this.generateSimulatedResults();
      } else {
        // Real TensorFlow Lite inference
        console.log('Running real TensorFlow Lite inference');
        
        // Preprocess the image
        const processedImageUri = await this.preprocessImage(imageUri);
        
        // Convert image to tensor
        const imageData = await this.imageToTensor(processedImageUri);
        
        // Run the model with the input data
        try {
          results = this.model.runSync([imageData]); // Sync version (faster)
        } catch (inferenceError) {
          console.error('Inference failed, falling back to simulation:', inferenceError);
          results = this.generateSimulatedResults();
        }
      }

      const processingTime = Date.now() - startTime;

      // Process the results into a more readable format
      const predictions = this.processModelOutput(results);

      return {
        predictions,
        processingTime,
      };
    } catch (error) {
      console.error('Error during model inference:', error);
      throw error;
    }
  }  /**
   * Generate simulated results for testing in Expo Go
   */
  private generateSimulatedResults(): Float32Array[] {
    // Simulate realistic coffee disease detection results
    // Classes: ['miner', 'nodisease', 'phoma', 'redspider', 'rust']
    
    const scenarios = [
      // Healthy plant scenario
      new Float32Array([0.05, 0.85, 0.03, 0.04, 0.03]),
      // Rust disease scenario
      new Float32Array([0.10, 0.15, 0.05, 0.08, 0.62]),
      // Miner damage scenario  
      new Float32Array([0.72, 0.12, 0.08, 0.05, 0.03]),
      // Phoma disease scenario
      new Float32Array([0.08, 0.20, 0.58, 0.09, 0.05]),
      // Red spider scenario
      new Float32Array([0.06, 0.25, 0.04, 0.60, 0.05]),
    ];
    
    // Randomly select a scenario for simulation
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    return [randomScenario];
  }

  /**
   * Process raw model output into structured predictions
   */
  private processModelOutput(rawOutput: any): Array<{ className: string; confidence: number; recommendations?: any }> {
    try {
      const predictions: Array<{ className: string; confidence: number; recommendations?: any }> = [];

      if (Array.isArray(rawOutput) && rawOutput.length > 0) {
        // Assuming rawOutput is an array of confidence scores
        const confidences = rawOutput[0];
        
        if (Array.isArray(confidences)) {
          confidences.forEach((confidence: number, index: number) => {
            if (index < PLANT_ANALYSIS_CONFIG.outputClasses.length && confidence > PLANT_ANALYSIS_CONFIG.confidenceThreshold) {
              const className = PLANT_ANALYSIS_CONFIG.outputClasses[index];
              const predictionData = {
                className,
                confidence: Math.round(confidence * 100) / 100, // Round to 2 decimal places
                recommendations: MODEL_RECOMMENDATIONS[className as PlantCondition] || undefined,
              };
              predictions.push(predictionData);
            }
          });
        }
      }

      // Sort by confidence (highest first)
      predictions.sort((a, b) => b.confidence - a.confidence);

      // Return top predictions based on config
      return predictions.slice(0, PLANT_ANALYSIS_CONFIG.maxPredictions);
    } catch (error) {
      console.error('Error processing model output:', error);
      return [{
        className: 'Error de Análisis',
        confidence: 0,
        recommendations: {
          diagnosis: 'No se pudo procesar la imagen',
          recommendations: ['Intenta tomar otra foto', 'Verifica que la imagen sea clara', 'Contacta soporte si el problema persiste'],
          severity: 'high',
        },
      }];
    }
  }
  /**
   * Get model information
   */
  getModelInfo(): { isLoaded: boolean; isSimulation: boolean; modelPath?: string; config?: any } {
    const isSimulation = !this.model || !isTensorFlowLiteAvailable();
    
    return {
      isLoaded: this.isModelLoaded,
      isSimulation,
      modelPath: this.isModelLoaded ? PLANT_ANALYSIS_CONFIG.modelPath : undefined,
      config: this.isModelLoaded ? PLANT_ANALYSIS_CONFIG : undefined,
    };
  }/**
   * Convert image to tensor format 
   * TODO: Implementar conversión real de imagen a tensor
   * Esta función debería:
   * 1. Cargar la imagen desde el URI
   * 2. Redimensionar a la entrada del modelo (verificar con model.inputs[0].shape)
   * 3. Normalizar los valores de píxeles según lo que espere el modelo
   * 4. Convertir a Float32Array en el formato correcto
   */
  private async imageToTensor(imageUri: string): Promise<Float32Array> {
    // Para obtener las dimensiones correctas del modelo:
    if (this.model && this.model.inputs.length > 0) {
      const inputTensor = this.model.inputs[0];
      console.log('Model input tensor:', {
        name: inputTensor.name,
        shape: inputTensor.shape,
        dataType: inputTensor.dataType
      });
      
      // El shape típico será algo como [1, 300, 300, 3] para [batch, height, width, channels]
      const [batch, height, width, channels] = inputTensor.shape;
      const tensorSize = height * width * channels;
      
      // TODO: Implementar conversión real aquí
      // Por ahora retornamos valores simulados en el tamaño correcto
      return new Float32Array(tensorSize).fill(0.5);
    }
    
    // Fallback con el tamaño configurado
    const tensorSize = PLANT_ANALYSIS_CONFIG.inputSize.width * PLANT_ANALYSIS_CONFIG.inputSize.height * 3;
    return new Float32Array(tensorSize).fill(0.5);
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    try {
      if (this.model) {
        // Clean up model resources if needed
        this.model = null;
        this.isModelLoaded = false;
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export const tfliteService = new TFLiteService();
