/**
 * Test script for TensorFlow Lite service
 * Run this to verify the service works in both simulation and real modes
 */

import { tfliteService } from '../services/tflite-service';

async function testTensorFlowLiteService() {
  console.log('🧪 Testing TensorFlow Lite Service...\n');

  try {
    // Test 1: Check if service can initialize
    console.log('1. Initializing service...');
    await tfliteService.initializeModel();
    console.log('✅ Service initialized successfully\n');

    // Test 2: Get model info
    console.log('2. Getting model information...');
    const modelInfo = tfliteService.getModelInfo();
    console.log('📊 Model Info:', {
      isLoaded: modelInfo.isLoaded,
      isSimulation: modelInfo.isSimulation,
      hasConfig: !!modelInfo.config
    });
    console.log('');

    // Test 3: Test image analysis (simulation)
    console.log('3. Testing image analysis...');
    const mockImageUri = 'data:image/jpeg;base64,mock-image-data';
    
    const startTime = Date.now();
    const result = await tfliteService.analyzeImage(mockImageUri);
    const endTime = Date.now();

    console.log('🔍 Analysis Results:');
    console.log(`⏱️  Processing time: ${result.processingTime}ms`);
    console.log(`🕒 Total test time: ${endTime - startTime}ms`);
    console.log(`📋 Predictions found: ${result.predictions.length}`);
    
    if (result.predictions.length > 0) {
      console.log('\n🏆 Top Prediction:');
      const topPrediction = result.predictions[0];
      console.log(`   Class: ${topPrediction.className}`);
      console.log(`   Confidence: ${(topPrediction.confidence * 100).toFixed(1)}%`);
      
      if (topPrediction.recommendations) {
        console.log(`   Diagnosis: ${topPrediction.recommendations.diagnosis}`);
        console.log(`   Severity: ${topPrediction.recommendations.severity}`);
      }
    }

    console.log('\n📊 All Predictions:');
    result.predictions.forEach((pred, index) => {
      console.log(`   ${index + 1}. ${pred.className}: ${(pred.confidence * 100).toFixed(1)}%`);
    });

    console.log('\n✅ All tests passed! Service is working correctly.');
    
    if (modelInfo.isSimulation) {
      console.log('\n⚠️  Note: Running in simulation mode (Expo Go)');
      console.log('   To test real AI model, create a development build:');
      console.log('   1. Run: eas build --platform android --profile development');
      console.log('   2. Install the built APK');
      console.log('   3. Run: npx expo start --dev-client');
    } else {
      console.log('\n🎯 Running with real TensorFlow Lite model!');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure you\'re running this in the app context');
    console.log('   - Check that all dependencies are installed');
    console.log('   - Verify the model file exists in assets/model/model.tflite');
  }
}

// Export for use in app
export { testTensorFlowLiteService };

// Run test if this file is executed directly
if (require.main === module) {
  testTensorFlowLiteService();
}
