/**
 * Enhanced TensorFlow Lite Service Testing Script
 * 
 * Script para probar el servicio TensorFlow Lite con diferentes configuraciones y casos de prueba
 */

import { modelTestingTools, TestResult, BenchmarkResult } from '../services/model-testing-tools';
import { tfliteService } from '../services/tflite-service';
import { DEVELOPMENT_CONFIG, TEST_CASES } from '../config/development-config';
import { devLogger } from '../services/development-logger';

class TFLiteServiceTester {
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Enhanced TensorFlow Lite Service Tests');
    console.log('='.repeat(60));
    
    try {
      // 1. Probar información del modelo
      await this.testModelInfo();
      
      // 2. Probar casos individuales
      await this.testIndividualCases();
      
      // 3. Ejecutar benchmark
      await this.runBenchmark();
      
      // 4. Probar comparación simulación vs real
      await this.testSimulationVsReal();
      
      // 5. Probar manejo de errores
      await this.testErrorHandling();
      
      console.log('\n✅ All tests completed successfully!');
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }
  
  private async testModelInfo(): Promise<void> {
    console.log('\n📊 Testing Model Information...');
    
    const info = modelTestingTools.getModelInfo();
    
    console.log('Model Info:', {
      isLoaded: info.isLoaded,
      isSimulation: info.isSimulation,
      configClasses: info.config?.outputClasses?.length || 0,
      performanceStats: info.performanceStats,
    });
    
    if (!info.isLoaded) {
      console.log('⚠️ Model not loaded, initializing...');
      await tfliteService.initializeModel();
    }
  }
  
  private async testIndividualCases(): Promise<void> {
    console.log('\n🧪 Testing Individual Test Cases...');
    
    for (const [testCase, testData] of Object.entries(TEST_CASES)) {
      console.log(`\nTesting case: ${testCase} - ${testData.description}`);
      
      try {
        const result = await modelTestingTools.runSingleTest(testCase as any);
        console.log(`✅ ${testCase}: ${result.isValid ? 'PASSED' : 'FAILED'}`);
        console.log(`   Predicted: ${result.actualTopPrediction} (${(result.confidence * 100).toFixed(1)}%)`);
        console.log(`   Expected: ${result.expectedPredictions.join(', ')}`);
        console.log(`   Time: ${result.processingTime.toFixed(2)}ms`);      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ ${testCase}: ERROR -`, errorMessage);
      }
    }
  }
  
  private async runBenchmark(): Promise<void> {
    console.log('\n⚡ Running Performance Benchmark...');
    
    const iterations = DEVELOPMENT_CONFIG.testing.enableBenchmarking ? 3 : 1;
    const benchmarkResult = await modelTestingTools.runBenchmark(iterations);
    
    console.log('Benchmark Results:');
    console.log(`  Total Tests: ${benchmarkResult.totalTests}`);
    console.log(`  Success Rate: ${((benchmarkResult.successfulTests / benchmarkResult.totalTests) * 100).toFixed(1)}%`);
    console.log(`  Avg Time: ${benchmarkResult.averageProcessingTime.toFixed(2)}ms`);
    console.log(`  Min Time: ${benchmarkResult.minProcessingTime.toFixed(2)}ms`);
    console.log(`  Max Time: ${benchmarkResult.maxProcessingTime.toFixed(2)}ms`);
    
    // Generar reporte si está habilitado
    if (DEVELOPMENT_CONFIG.debugging.saveAnalysisHistory) {
      const report = modelTestingTools.generateTestReport(benchmarkResult);
      console.log('\n📄 Test report generated (check logs for full details)');
    }
  }
  
  private async testSimulationVsReal(): Promise<void> {
    console.log('\n🎭 Testing Simulation vs Real Model...');
    
    if (DEVELOPMENT_CONFIG.testing.enableComparison) {
      try {
        const comparison = await modelTestingTools.compareSimulationVsReal('rust');
        
        console.log('Simulation Result:', {
          topPrediction: comparison.simulationResult.predictions[0]?.className,
          confidence: comparison.simulationResult.predictions[0]?.confidence,
          time: comparison.simulationResult.processingTime,
          isSimulated: comparison.simulationResult.metadata?.isSimulated,
        });
        
        if (comparison.realResult) {
          console.log('Real Model Result:', {
            topPrediction: comparison.realResult.predictions[0]?.className,
            confidence: comparison.realResult.predictions[0]?.confidence,
            time: comparison.realResult.processingTime,
            isSimulated: comparison.realResult.metadata?.isSimulated,
          });
          
          if (comparison.comparison) {
            console.log('Comparison:', comparison.comparison);
          }
        } else {
          console.log('⚠️ Real model not available for comparison');
        }      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Comparison test failed:', errorMessage);
      }
    } else {
      console.log('ℹ️ Comparison testing disabled in configuration');
    }
  }
  
  private async testErrorHandling(): Promise<void> {
    console.log('\n🛠️ Testing Error Handling...');
    
    // Test con imagen inválida
    try {
      console.log('Testing with invalid image URI...');
      await tfliteService.analyzeImage('invalid://test.jpg');
      console.log('⚠️ Expected error but none was thrown');    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('✅ Error handling works correctly:', errorMessage);
    }
    
    // Test con configuración de error simulado
    if (DEVELOPMENT_CONFIG.simulation.simulateErrors) {
      console.log('Testing simulated errors...');
      let errorCount = 0;
      const attempts = 10;
      
      for (let i = 0; i < attempts; i++) {
        try {
          await modelTestingTools.runSingleTest('healthy');
        } catch (error) {
          errorCount++;
        }
      }
      
      console.log(`Simulated errors: ${errorCount}/${attempts} (expected ~${(DEVELOPMENT_CONFIG.simulation.errorProbability * 100).toFixed(1)}%)`);
    }
  }
  
  async benchmarkTest(): Promise<void> {
    console.log('⚡ Running Benchmark Test...');
    return this.runBenchmark();
  }

  async quickTest(): Promise<void> {
    console.log('🚀 Running Quick Test...');
    
    try {
      const result = await modelTestingTools.runSingleTest('healthy');
      console.log('✅ Quick test completed:', {
        valid: result.isValid,
        prediction: result.actualTopPrediction,
        confidence: (result.confidence * 100).toFixed(1) + '%',
        time: result.processingTime.toFixed(2) + 'ms',
      });
    } catch (error) {
      console.error('❌ Quick test failed:', error);
    }
  }
  
  async interactiveTest(): Promise<void> {
    console.log('🎮 Interactive Testing Mode');
    console.log('Available test cases:');
    
    Object.entries(TEST_CASES).forEach(([key, data]) => {
      console.log(`  ${key}: ${data.description}`);
    });
    
    // En un entorno real, aquí podrías usar readline para input del usuario
    // Por ahora, ejecutamos una secuencia predefinida
    const testSequence = ['healthy', 'rust', 'miner'];
    
    for (const testCase of testSequence) {
      console.log(`\n🧪 Running ${testCase}...`);
      try {
        const result = await modelTestingTools.runSingleTest(testCase as any);
        console.log(`Result: ${result.actualTopPrediction} (${(result.confidence * 100).toFixed(1)}%)`);      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error: ${errorMessage}`);
      }
    }
  }
}

// Función principal
async function main() {
  const tester = new TFLiteServiceTester();
  
  // Obtener argumentos de línea de comandos
  const args = process.argv.slice(2);
  const mode = args[0] || 'full';
  
  try {
    switch (mode) {
      case 'quick':
        await tester.quickTest();
        break;
      case 'interactive':
        await tester.interactiveTest();
        break;      case 'benchmark':
        await tester.benchmarkTest();
        break;
      case 'full':
      default:
        await tester.runAllTests();
        break;
    }
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

// Ejecutar solo si es el archivo principal
if (require.main === module) {
  main();
}

export { TFLiteServiceTester };
