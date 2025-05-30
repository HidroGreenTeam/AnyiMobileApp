/**
 * Script de prueba para validar la integración del modelo TensorFlow Lite
 * 
 * Ejecutar con: npx ts-node scripts/test-model.ts
 */

import { tfliteService } from '../services/tflite-service';
import { PLANT_ANALYSIS_CONFIG } from '../config/model-config';

async function testModelIntegration() {
  console.log('🧪 Iniciando pruebas del modelo TensorFlow Lite...\n');

  try {
    // Test 1: Verificar configuración del modelo
    console.log('✅ Test 1: Configuración del modelo');
    console.log(`   - Clases: ${PLANT_ANALYSIS_CONFIG.outputClasses.length}`);
    console.log(`   - Tamaño de entrada: ${PLANT_ANALYSIS_CONFIG.inputSize.width}x${PLANT_ANALYSIS_CONFIG.inputSize.height}`);
    console.log(`   - Umbral de confianza: ${PLANT_ANALYSIS_CONFIG.confidenceThreshold}`);
    console.log(`   - Clases disponibles: ${PLANT_ANALYSIS_CONFIG.outputClasses.join(', ')}\n`);

    // Test 2: Inicializar el servicio
    console.log('🔄 Test 2: Inicializando servicio TensorFlow Lite...');
    await tfliteService.initialize();
    console.log('✅ Servicio inicializado correctamente\n');

    // Test 3: Verificar estado del modelo
    console.log('🔄 Test 3: Verificando estado del modelo...');
    const isLoaded = tfliteService.isLoaded();
    console.log(`   - Modelo cargado: ${isLoaded ? '✅' : '❌'}\n`);

    // Test 4: Simular análisis de imagen
    console.log('🔄 Test 4: Simulando análisis de imagen...');
    const mockImageUri = 'file://mock-image.jpg';
    
    try {
      const startTime = Date.now();
      const result = await tfliteService.analyzeImage(mockImageUri);
      const endTime = Date.now();
      
      console.log('✅ Análisis completado');
      console.log(`   - Tiempo de procesamiento: ${endTime - startTime}ms`);
      console.log(`   - Predicciones encontradas: ${result.predictions.length}`);
      
      result.predictions.forEach((prediction, index) => {
        console.log(`   - ${index + 1}. ${prediction.className}: ${(prediction.confidence * 100).toFixed(1)}%`);
      });
      
      console.log(`   - Imagen procesada: ${result.processedImage ? '✅' : '❌'}`);
      console.log(`   - Timestamp: ${new Date(result.timestamp).toLocaleString()}\n`);
      
    } catch (error) {
      console.log(`❌ Error en análisis: ${error}\n`);
    }

    // Test 5: Cleanup
    console.log('🔄 Test 5: Limpieza de recursos...');
    await tfliteService.cleanup();
    console.log('✅ Cleanup completado\n');

    console.log('🎉 Todas las pruebas completadas');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    process.exit(1);
  }
}

// Función para simular una prueba de rendimiento
async function testPerformance() {
  console.log('⚡ Iniciando pruebas de rendimiento...\n');

  try {
    await tfliteService.initialize();
    
    const iterations = 5;
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      await tfliteService.analyzeImage('file://test-image.jpg');
      const endTime = Date.now();
      
      const duration = endTime - startTime;
      times.push(duration);
      console.log(`   Iteración ${i + 1}: ${duration}ms`);
    }
    
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    
    console.log('\n📊 Estadísticas de rendimiento:');
    console.log(`   - Tiempo promedio: ${avgTime.toFixed(1)}ms`);
    console.log(`   - Tiempo mínimo: ${minTime}ms`);
    console.log(`   - Tiempo máximo: ${maxTime}ms`);
    
    await tfliteService.cleanup();
    
  } catch (error) {
    console.error('❌ Error en pruebas de rendimiento:', error);
  }
}

// Ejecutar pruebas si se llama directamente
if (require.main === module) {
  console.log('🚀 TensorFlow Lite Model Test Suite\n');
  
  testModelIntegration()
    .then(() => {
      console.log('\n' + '='.repeat(50));
      return testPerformance();
    })
    .then(() => {
      console.log('\n✨ Todas las pruebas finalizadas exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Error fatal en las pruebas:', error);
      process.exit(1);
    });
}

export { testModelIntegration, testPerformance };
