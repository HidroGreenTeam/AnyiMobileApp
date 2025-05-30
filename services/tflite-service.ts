import { loadTensorflowModel, type TensorflowModel, type TensorflowModelDelegate } from 'react-native-fast-tflite';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { PLANT_ANALYSIS_CONFIG, MODEL_RECOMMENDATIONS, PlantCondition } from '@/config/model-config';
import { DEVELOPMENT_CONFIG } from '@/config/development-config';
import { devLogger } from './development-logger';
import { modelSimulation } from './model-simulation';

// Check if TensorFlow Lite is available (for Expo Go compatibility)
const isTensorFlowLiteAvailable = () => {
  try {
    // Comprobar configuración de desarrollo
    if (DEVELOPMENT_CONFIG.forceSimulationMode) {
      devLogger.info('Simulation mode forced by development configuration');
      return false;
    }
    
    // Check if the native module is available
    if (typeof loadTensorflowModel === 'undefined') {
      devLogger.warn('TensorFlow Lite module not found');
      return false;
    }
    
    // Additional check for Expo Go environment
    const globalAny = global as any;
    if (globalAny.__DEV__ && globalAny.expo && !globalAny.__EXPO_CLI_SERVER_URL__) {
      // This is likely Expo Go
      devLogger.warn('Running in Expo Go - TensorFlow Lite not supported');
      return false;
    }
    
    devLogger.info('TensorFlow Lite is available');
    return true;
  } catch (error) {
    devLogger.warn('TensorFlow Lite not available - running in Expo Go mode', error);
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
  metadata?: {
    isSimulated?: boolean;
    modelVersion?: string;
    inputShape?: number[];
    detectedPatterns?: string[];
  };
}

export interface AnalysisResult {
  image: string;
  results: ModelResult;
  timestamp: number;
}

class TFLiteService {
  private model: TensorflowModel | null = null;
  private isModelLoaded = false;
  private analysisHistory: AnalysisResult[] = [];

  /**
   * Get the model source for loading
   */
  private async getModelSource(): Promise<any> {
    devLogger.debug('Starting model source detection...');
    
    try {
      // Method 1: Use Expo Asset (most reliable approach)
      devLogger.debug('Trying Expo Asset approach...');
      try {
        const asset = Asset.fromModule(require('../assets/model/model.tflite'));
        devLogger.debug('Asset created successfully');
        
        await asset.downloadAsync();
        devLogger.debug('Asset downloaded successfully');
        
        if (asset.localUri) {
          devLogger.info('Model loaded via Asset', { localUri: asset.localUri });
          
          // Verify file exists
          const fileInfo = await FileSystem.getInfoAsync(asset.localUri);
          devLogger.debug('File info', fileInfo);
          
          if (fileInfo.exists) {
            return { uri: asset.localUri };
          } else {
            throw new Error('Asset downloaded but file does not exist at localUri');
          }
        } else {
          throw new Error('Asset localUri is null after download');
        }
      } catch (assetError) {
        devLogger.warn('Asset loading failed', assetError);
      }

      // Method 2: Try direct require (fallback)
      devLogger.debug('Trying direct require approach...');
      try {
        const modelAsset = require('../assets/model/model.tflite');
        devLogger.debug('Require result', { type: typeof modelAsset, value: modelAsset });
        
        if (modelAsset && typeof modelAsset !== 'undefined') {
          devLogger.info('Model loaded via require', modelAsset);
          return modelAsset;
        } else {
          throw new Error('Require returned undefined or null');
        }
      } catch (requireError) {
        devLogger.warn('Require failed', requireError);
      }

      // Method 3: Try bundle path
      devLogger.debug('Trying bundle path approach...');
      try {
        const bundlePath = `${FileSystem.bundleDirectory}assets/model/model.tflite`;
        devLogger.debug('Checking bundle path', { bundlePath });
        
        const bundleInfo = await FileSystem.getInfoAsync(bundlePath);
        devLogger.debug('Bundle file info', bundleInfo);
        
        if (bundleInfo.exists) {
          devLogger.info('Model found in bundle', { bundlePath });
          return { uri: bundlePath };
        } else {
          throw new Error('Model file not found in bundle directory');
        }
      } catch (bundleError) {
        devLogger.warn('Bundle path failed', bundleError);
      }

      // Method 4: List available assets for debugging
      devLogger.debug('Listing available assets for debugging...');
      try {
        const assetsPath = `${FileSystem.bundleDirectory}assets`;
        const assetsInfo = await FileSystem.getInfoAsync(assetsPath);
        devLogger.debug('Assets directory info', assetsInfo);
        
        if (assetsInfo.exists && assetsInfo.isDirectory) {
          const assetsContents = await FileSystem.readDirectoryAsync(assetsPath);
          devLogger.debug('Assets directory contents', assetsContents);
        }
      } catch (listError) {
        devLogger.warn('Could not list assets', listError);
      }

      throw new Error('Model file not found in any location. Check that model.tflite exists in assets/model/ directory and is properly bundled.');
    } catch (error) {
      devLogger.error('Failed to get model source', error);
      throw error;
    }
  }
  /**
   * Initialize and load the TensorFlow Lite model
   */
  async initializeModel(): Promise<void> {
    devLogger.model('Starting TensorFlow Lite model initialization...');
    
    try {
      if (this.isModelLoaded) {
        devLogger.model('Model already loaded, skipping initialization');
        return;
      }

      if (!isTensorFlowLiteAvailable()) {
        devLogger.warn('TensorFlow Lite not available, running in simulation mode', undefined, 'SIMULATION');
        this.isModelLoaded = true; // Mark as loaded for simulation
        return;
      }

      // Get model source
      const modelSource = await this.getModelSource();
      devLogger.model('Model source obtained', modelSource);

      // Load model with proper delegate configuration
      const delegate: TensorflowModelDelegate = Platform.OS === 'android' ? 'default' : 'default';
      
      try {
        devLogger.model('Loading TensorFlow Lite model...');
        this.model = await loadTensorflowModel(modelSource, delegate);
        
        if (!this.model) {
          throw new Error('Model loading returned null');
        }
        
        devLogger.model('Model loaded successfully!', {
          inputs: this.model.inputs.map(input => ({
            name: input.name,
            dataType: input.dataType,
            shape: input.shape,
          })),
          outputs: this.model.outputs.map(output => ({
            name: output.name,
            dataType: output.dataType,
            shape: output.shape,
          })),
        });
        
        this.isModelLoaded = true;
      } catch (fallbackError) {
        devLogger.warn('TensorFlow Lite loading failed, falling back to simulation mode', fallbackError, 'SIMULATION');
        this.model = null;
        this.isModelLoaded = true; // Mark as loaded for simulation
      }
    } catch (error) {
      devLogger.error('Critical error during model initialization', error, 'MODEL');
      throw new Error(`Failed to initialize TensorFlow Lite model: ${error}`);
    }
  }
  /**
   * Preprocess the image before analysis
   */
  private async preprocessImage(imageUri: string): Promise<string> {
    try {
      if (DEVELOPMENT_CONFIG.debugging.logImagePreprocessing) {
        devLogger.image('Preprocessing image', { imageUri });
      }
      
      // For now, return the image as-is
      // In the future, you could add image preprocessing here
      return imageUri;
    } catch (error) {
      devLogger.error('Error preprocessing image', error, 'IMAGE');
      throw error;
    }
  }
  /**
   * Analyze an image and return predictions
   */
  async analyzeImage(imageUri: string): Promise<ModelResult> {
    const startTime = performance.now();
    
    try {
      if (!this.isModelLoaded) {
        await this.initializeModel();
      }

      let results: any;
      let metadata: any = {};
        if (!this.model || !isTensorFlowLiteAvailable()) {
        devLogger.simulation('Running in simulation mode');
        const simulationResult = await modelSimulation.generateSimulatedResults(imageUri);
        results = [simulationResult.confidences];
        metadata = simulationResult.metadata;
      } else {
        devLogger.model('Running real model inference');
        const processedImageUri = await this.preprocessImage(imageUri);
        const imageData = await this.imageToTensor(processedImageUri);
        
        try {
          results = this.model.runSync([imageData]); // Sync version (faster)
          metadata = {
            isSimulated: false,
            modelVersion: '1.0.0',
            inputShape: this.model.inputs[0]?.shape || [],
          };
        } catch (inferenceError) {
          devLogger.warn('Model inference failed, falling back to simulation', inferenceError);
          const simulationResult = await modelSimulation.generateSimulatedResults(imageUri);
          results = [simulationResult.confidences];
          metadata = {
            ...simulationResult.metadata,
            fallbackReason: 'inference_error',
          };
        }
      }
      
      const predictions = this.processModelOutput(results);
      const processingTime = performance.now() - startTime;
      
      if (DEVELOPMENT_CONFIG.debugging.logModelOutputs) {
        devLogger.model('Model output processed', {
          predictionsCount: predictions.length,
          topPrediction: predictions[0],
          metadata,
        });
      }
      
      const result: ModelResult = {
        predictions,
        processingTime,
        metadata,
      };
      
      // Save to analysis history if enabled
      if (DEVELOPMENT_CONFIG.debugging.saveAnalysisHistory) {
        this.analysisHistory.push({
          image: imageUri,
          results: result,
          timestamp: Date.now(),
        });
        
        // Keep only last 50 analyses
        if (this.analysisHistory.length > 50) {
          this.analysisHistory = this.analysisHistory.slice(-50);
        }
      }
      
      devLogger.performance('Analysis complete', startTime, {
        predictionsCount: predictions.length,
        isSimulated: metadata.isSimulated,
      });
      
      return result;
    } catch (error) {
      devLogger.error('Error analyzing image', error);
      throw error;
    }
  }  /**
   * Process raw model output into structured predictions
   */
  private processModelOutput(rawOutput: any): Array<{ className: string; confidence: number; recommendations?: any }> {
    try {
      const predictions: Array<{ className: string; confidence: number; recommendations?: any }> = [];
      
      if (Array.isArray(rawOutput) && rawOutput.length > 0) {
        const confidences = rawOutput[0];
        const classNames = PLANT_ANALYSIS_CONFIG.outputClasses;
        
        // Create predictions for each class
        for (let i = 0; i < Math.min(confidences.length, classNames.length); i++) {
          const className = classNames[i];
          const confidence = confidences[i];
          
          // Only include predictions above confidence threshold
          if (confidence >= PLANT_ANALYSIS_CONFIG.confidenceThreshold) {
            const prediction: any = {
              className,
              confidence,
            };
            
            // Add recommendations if available
            if (MODEL_RECOMMENDATIONS[className as PlantCondition]) {
              prediction.recommendations = MODEL_RECOMMENDATIONS[className as PlantCondition];
            }
            
            predictions.push(prediction);
          }
        }
      }
      
      // Sort by confidence (highest first)
      predictions.sort((a, b) => b.confidence - a.confidence);
      
      // Limit to top predictions
      return predictions.slice(0, PLANT_ANALYSIS_CONFIG.maxPredictions);
    } catch (error) {
      console.error('❌ Error processing model output:', error);
      // Return default prediction in case of error
      return [{
        className: 'healthy',
        confidence: 0.5,
        recommendations: MODEL_RECOMMENDATIONS.nodisease,
      }];
    }
  }

  /**
   * Get information about the loaded model
   */
  getModelInfo(): { isLoaded: boolean; isSimulation: boolean; modelPath?: string; config?: any } {
    const isSimulation = !this.model || !isTensorFlowLiteAvailable();
    
    return {
      isLoaded: this.isModelLoaded,
      isSimulation,
      config: PLANT_ANALYSIS_CONFIG,
    };
  }

  /**
   * Convert image to tensor format expected by the model
   */
  private async imageToTensor(imageUri: string): Promise<Float32Array> {
    // Para obtener las dimensiones correctas del modelo:
    if (this.model && this.model.inputs.length > 0) {
      const inputTensor = this.model.inputs[0];
      console.log('📐 Model input shape:', inputTensor.shape);
      
      // For now, return a placeholder tensor with correct dimensions
      // You would implement actual image processing here
      const [batch, height, width, channels] = inputTensor.shape;
      const tensorSize = height * width * channels;
      return new Float32Array(tensorSize).fill(0.5); // Placeholder values
    }
    
    // Default tensor if model not available
    return new Float32Array(224 * 224 * 3).fill(0.5);
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    try {
      if (this.model) {
        console.log('🧹 Cleaning up TensorFlow Lite model...');
        // Note: react-native-fast-tflite doesn't have explicit cleanup in current version
        this.model = null;
        this.isModelLoaded = false;
        console.log('✅ Model cleanup complete');
      }
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export const tfliteService = new TFLiteService();
export default tfliteService;
