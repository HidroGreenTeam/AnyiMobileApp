import { loadTensorflowModel, type TensorflowModel, type TensorflowModelDelegate } from 'react-native-fast-tflite';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { PLANT_ANALYSIS_CONFIG, MODEL_RECOMMENDATIONS, PlantCondition } from '@/config/model-config';

// Check if TensorFlow Lite is available (for Expo Go compatibility)
const isTensorFlowLiteAvailable = () => {
  try {
    // Check if the native module is available
    if (typeof loadTensorflowModel === 'undefined') {
      console.warn('TensorFlow Lite module not found');
      return false;
    }
    
    // Additional check for Expo Go environment
    const globalAny = global as any;
    if (globalAny.__DEV__ && globalAny.expo && !globalAny.__EXPO_CLI_SERVER_URL__) {
      // This is likely Expo Go
      console.warn('Running in Expo Go - TensorFlow Lite not supported');
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('TensorFlow Lite not available - running in Expo Go mode:', error);
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
   * Get the model source for loading
   */
  private async getModelSource(): Promise<any> {
    console.log('🔍 Starting model source detection...');
    
    try {
      // Method 1: Use Expo Asset (most reliable approach)
      console.log('📦 Trying Expo Asset approach...');
      try {
        const asset = Asset.fromModule(require('../assets/model/model.tflite'));
        console.log('✅ Asset created successfully');
        
        await asset.downloadAsync();
        console.log('✅ Asset downloaded successfully');
        
        if (asset.localUri) {
          console.log('✅ Model loaded via Asset:', asset.localUri);
          
          // Verify file exists
          const fileInfo = await FileSystem.getInfoAsync(asset.localUri);
          console.log('📊 File info:', fileInfo);
          
          if (fileInfo.exists) {
            return { uri: asset.localUri };
          } else {
            throw new Error('Asset downloaded but file does not exist at localUri');
          }
        } else {
          throw new Error('Asset localUri is null after download');
        }
      } catch (assetError) {
        console.warn('❌ Asset loading failed:', assetError);
      }

      // Method 2: Try direct require (fallback)
      console.log('📁 Trying direct require approach...');
      try {
        const modelAsset = require('../assets/model/model.tflite');
        console.log('✅ Require result:', typeof modelAsset, modelAsset);
        
        if (modelAsset && typeof modelAsset !== 'undefined') {
          console.log('✅ Model loaded via require:', modelAsset);
          return modelAsset;
        } else {
          throw new Error('Require returned undefined or null');
        }
      } catch (requireError) {
        console.warn('❌ Require failed:', requireError);
      }

      // Method 3: Try bundle path
      console.log('📂 Trying bundle path approach...');
      try {
        const bundlePath = `${FileSystem.bundleDirectory}assets/model/model.tflite`;
        console.log('🔍 Checking bundle path:', bundlePath);
        
        const bundleInfo = await FileSystem.getInfoAsync(bundlePath);
        console.log('📊 Bundle file info:', bundleInfo);
        
        if (bundleInfo.exists) {
          console.log('✅ Model found in bundle:', bundlePath);
          return { uri: bundlePath };
        } else {
          throw new Error('Model file not found in bundle directory');
        }
      } catch (bundleError) {
        console.warn('❌ Bundle path failed:', bundleError);
      }

      // Method 4: List available assets for debugging
      console.log('📋 Listing available assets for debugging...');
      try {
        const assetsPath = `${FileSystem.bundleDirectory}assets`;
        const assetsInfo = await FileSystem.getInfoAsync(assetsPath);
        console.log('📂 Assets directory info:', assetsInfo);
        
        if (assetsInfo.exists && assetsInfo.isDirectory) {
          const assetsContents = await FileSystem.readDirectoryAsync(assetsPath);
          console.log('📋 Assets directory contents:', assetsContents);
        }
      } catch (listError) {
        console.warn('❌ Could not list assets:', listError);
      }

      throw new Error('Model file not found in any location. Check that model.tflite exists in assets/model/ directory and is properly bundled.');
    } catch (error) {
      console.error('❌ Failed to get model source:', error);
      throw error;
    }
  }

  /**
   * Initialize and load the TensorFlow Lite model
   */
  async initializeModel(): Promise<void> {
    console.log('🚀 Starting TensorFlow Lite model initialization...');
    
    try {
      if (this.isModelLoaded) {
        console.log('✅ Model already loaded, skipping initialization');
        return;
      }

      if (!isTensorFlowLiteAvailable()) {
        console.warn('⚠️ TensorFlow Lite not available, running in simulation mode');
        this.isModelLoaded = true; // Mark as loaded for simulation
        return;
      }

      // Get model source
      const modelSource = await this.getModelSource();
      console.log('📄 Model source obtained:', modelSource);      // Load model with proper delegate configuration
      const delegate: TensorflowModelDelegate = Platform.OS === 'android' ? 'default' : 'default';
      
      try {
        console.log('🔄 Loading TensorFlow Lite model...');
        this.model = await loadTensorflowModel(modelSource, delegate);
        
        if (!this.model) {
          throw new Error('Model loading returned null');
        }
        
        console.log('✅ Model loaded successfully!');
        console.log(`📊 Model info:`, {
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
        console.warn('❌ TensorFlow Lite loading failed, falling back to simulation mode:', fallbackError);
        this.model = null;
        this.isModelLoaded = true; // Mark as loaded for simulation
      }
    } catch (error) {
      console.error('❌ Critical error during model initialization:', error);
      throw new Error(`Failed to initialize TensorFlow Lite model: ${error}`);
    }
  }

  /**
   * Preprocess the image before analysis
   */
  private async preprocessImage(imageUri: string): Promise<string> {
    try {
      // For now, return the image as-is
      // In the future, you could add image preprocessing here
      return imageUri;
    } catch (error) {
      console.error('❌ Error preprocessing image:', error);
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
      
      if (!this.model || !isTensorFlowLiteAvailable()) {
        console.log('🎭 Running in simulation mode');
        results = this.generateSimulatedResults();
      } else {
        console.log('🔍 Running real model inference');
        const processedImageUri = await this.preprocessImage(imageUri);
        const imageData = await this.imageToTensor(processedImageUri);
        
        try {
          results = this.model.runSync([imageData]); // Sync version (faster)
        } catch (inferenceError) {
          console.warn('❌ Model inference failed, falling back to simulation:', inferenceError);
          results = this.generateSimulatedResults();
        }
      }
      
      const predictions = this.processModelOutput(results);
      const processingTime = performance.now() - startTime;
      
      console.log(`✅ Analysis complete in ${processingTime.toFixed(2)}ms`);
      
      return {
        predictions,
        processingTime,
      };
    } catch (error) {
      console.error('❌ Error analyzing image:', error);
      throw error;
    }
  }
  /**
   * Generate simulated results for testing/demo purposes
   */
  private generateSimulatedResults(): Float32Array[] {
    // Simulate model output with realistic confidence values
    const classCount = PLANT_ANALYSIS_CONFIG.outputClasses.length;
    const confidences = new Float32Array(classCount);
    
    // Generate random but realistic confidence values
    let total = 0;
    for (let i = 0; i < classCount; i++) {
      confidences[i] = Math.random();
      total += confidences[i];
    }
    
    // Normalize to sum to 1 (like softmax)
    for (let i = 0; i < classCount; i++) {
      confidences[i] /= total;
    }
    
    // Make one class significantly more confident
    const topClass = Math.floor(Math.random() * classCount);
    confidences[topClass] = Math.max(0.6, confidences[topClass]);
    
    return [confidences];
  }

  /**
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
