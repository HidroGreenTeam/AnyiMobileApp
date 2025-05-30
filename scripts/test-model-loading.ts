/**
 * Test script to verify TensorFlow Lite model loading
 * This script helps debug model loading issues
 */

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export async function testModelLoading() {
  console.log('🔍 Testing TensorFlow Lite model loading...');
  
  // Test 1: Check if model file exists in assets
  console.log('\n📁 Test 1: Checking model file existence...');
  try {
    const modelAsset = require('../assets/model/model.tflite');
    console.log('✅ Model asset require successful:', typeof modelAsset);
    console.log('   Asset value:', modelAsset);
  } catch (error) {
    console.log('❌ Model asset require failed:', error);
  }

  // Test 2: Try Expo Asset approach
  console.log('\n📦 Test 2: Testing Expo Asset approach...');
  try {
    const asset = Asset.fromModule(require('../assets/model/model.tflite'));
    console.log('✅ Asset creation successful');
    console.log('   Asset URI before download:', asset.uri);
    console.log('   Asset local URI before download:', asset.localUri);
    
    await asset.downloadAsync();
    console.log('✅ Asset download successful');
    console.log('   Asset URI after download:', asset.uri);
    console.log('   Asset local URI after download:', asset.localUri);
    
    if (asset.localUri) {
      const fileInfo = await FileSystem.getInfoAsync(asset.localUri);
      console.log('✅ File info:', fileInfo);
    }
  } catch (error) {
    console.log('❌ Expo Asset approach failed:', error);
  }

  // Test 3: Check bundle directory
  console.log('\n📦 Test 3: Checking bundle directory...');
  try {
    const bundlePath = `${FileSystem.bundleDirectory}assets/model/model.tflite`;
    console.log('   Bundle path:', bundlePath);
    
    const bundleInfo = await FileSystem.getInfoAsync(bundlePath);
    console.log('✅ Bundle file info:', bundleInfo);
  } catch (error) {
    console.log('❌ Bundle directory check failed:', error);
  }

  // Test 4: List assets directory
  console.log('\n📂 Test 4: Listing assets directory...');
  try {
    const assetsPath = `${FileSystem.bundleDirectory}assets`;
    const assetsInfo = await FileSystem.getInfoAsync(assetsPath);
    console.log('   Assets directory info:', assetsInfo);
    
    if (assetsInfo.exists && assetsInfo.isDirectory) {
      const assetsContents = await FileSystem.readDirectoryAsync(assetsPath);
      console.log('   Assets directory contents:', assetsContents);
      
      // Check if model directory exists
      if (assetsContents.includes('model')) {
        const modelPath = `${assetsPath}/model`;
        const modelContents = await FileSystem.readDirectoryAsync(modelPath);
        console.log('   Model directory contents:', modelContents);
      }
    }
  } catch (error) {
    console.log('❌ Assets directory listing failed:', error);
  }

  console.log('\n🔍 Model loading test completed');
}

export async function testTensorFlowLiteModule() {
  console.log('\n🤖 Testing TensorFlow Lite module availability...');
  
  try {
    // Try to import the module
    const tflite = require('react-native-fast-tflite');
    console.log('✅ TensorFlow Lite module imported successfully');
    console.log('   Available exports:', Object.keys(tflite));
    
    // Check if loadTensorflowModel function exists
    if (typeof tflite.loadTensorflowModel === 'function') {
      console.log('✅ loadTensorflowModel function is available');
    } else {
      console.log('❌ loadTensorflowModel function is not available');
    }
  } catch (error) {
    console.log('❌ TensorFlow Lite module import failed:', error);
  }
}

// Export for use in other files
export default {
  testModelLoading,
  testTensorFlowLiteModule,
};
