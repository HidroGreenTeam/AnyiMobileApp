/**
 * Script para configurar el entorno de desarrollo para pruebas con TensorFlow Lite
 * 
 * Este script automatiza la configuración necesaria para probar el modelo
 * TensorFlow Lite en modo desarrollo.
 */

import * as fs from 'fs';
import * as path from 'path';

interface DevSetupConfig {
  hasEASCLI: boolean;
  hasModel: boolean;
  hasDevClient: boolean;
  isAndroidConfigured: boolean;
  recommendations: string[];
}

async function checkDevEnvironment(): Promise<DevSetupConfig> {
  const config: DevSetupConfig = {
    hasEASCLI: false,
    hasModel: false,
    hasDevClient: false,
    isAndroidConfigured: false,
    recommendations: []
  };

  // Verificar EAS CLI
  try {
    const { execSync } = require('child_process');
    execSync('eas --version', { stdio: 'ignore' });
    config.hasEASCLI = true;
    console.log('✅ EAS CLI está instalado');
  } catch {
    config.hasEASCLI = false;
    config.recommendations.push('Instalar EAS CLI: npm install -g @expo/eas-cli');
  }

  // Verificar modelo TensorFlow Lite
  const modelPath = path.join(__dirname, '..', 'assets', 'model', 'model.tflite');
  if (fs.existsSync(modelPath)) {
    config.hasModel = true;
    console.log('✅ Modelo TensorFlow Lite encontrado');
    
    // Verificar tamaño del modelo
    const stats = fs.statSync(modelPath);
    console.log(`   Tamaño del modelo: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  } else {
    config.hasModel = false;
    config.recommendations.push('Asegúrate de que el modelo model.tflite esté en assets/model/');
  }

  // Verificar expo-dev-client en package.json
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.dependencies && packageJson.dependencies['expo-dev-client']) {
      config.hasDevClient = true;
      console.log('✅ expo-dev-client está configurado');
    } else {
      config.recommendations.push('Instalar expo-dev-client: npx expo install expo-dev-client');
    }
  }

  // Verificar configuración de Android
  const appJsonPath = path.join(__dirname, '..', 'app.json');
  if (fs.existsSync(appJsonPath)) {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    if (appJson.expo?.android?.package) {
      config.isAndroidConfigured = true;
      console.log('✅ Configuración de Android está completa');
    } else {
      config.recommendations.push('Configurar package name para Android en app.json');
    }
  }

  return config;
}

function printSetupInstructions(config: DevSetupConfig) {
  console.log('\n🚀 INSTRUCCIONES PARA CONFIGURAR EL ENTORNO DE DESARROLLO\n');
  
  if (config.recommendations.length > 0) {
    console.log('⚠️  Acciones requeridas:');
    config.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    console.log('');
  }

  console.log('📱 PASOS PARA PROBAR EL MODELO:');
  console.log('');
  console.log('1️⃣ Crear build de desarrollo:');
  console.log('   npm run build:dev:android');
  console.log('   (Este proceso puede tomar 10-15 minutos)');
  console.log('');
  console.log('2️⃣ Instalar el APK generado en tu dispositivo Android');
  console.log('');
  console.log('3️⃣ Iniciar el servidor de desarrollo:');
  console.log('   npm run dev-client');
  console.log('');
  console.log('4️⃣ Conectar desde la app instalada al servidor');
  console.log('');
  console.log('5️⃣ Probar el modelo:');
  console.log('   - Ir a la pantalla de diagnóstico');
  console.log('   - Tomar/seleccionar una foto');
  console.log('   - Ver resultados del análisis');
  console.log('');
  console.log('🔧 COMANDOS ÚTILES:');
  console.log('   npm run test:model          - Probar servicio TensorFlow Lite');
  console.log('   npm run test:model-loading  - Verificar carga del modelo');
  console.log('   eas build:list              - Ver builds disponibles');
  console.log('   eas device:list             - Registrar dispositivos');
  console.log('');
  
  if (!config.hasEASCLI) {
    console.log('⚠️  IMPORTANTE: Necesitas instalar EAS CLI primero');
    console.log('   npm install -g @expo/eas-cli');
    console.log('   eas login');
    console.log('');
  }
  
  console.log('💡 CONSEJOS:');
  console.log('   - El primer build puede tomar más tiempo');
  console.log('   - Asegúrate de tener Java 17 y Android SDK configurados');
  console.log('   - Usa un dispositivo físico para mejor rendimiento');
  console.log('   - El modelo funciona mejor con imágenes de plantas claras');
  console.log('');
}

async function main() {
  console.log('🔍 Verificando entorno de desarrollo...\n');
  
  try {
    const config = await checkDevEnvironment();
    printSetupInstructions(config);
    
    if (config.hasEASCLI && config.hasModel && config.hasDevClient) {
      console.log('🎉 ¡Entorno listo para desarrollo! Puedes ejecutar:');
      console.log('   npm run build:dev:android');
    } else {
      console.log('⚙️  Completa las acciones requeridas y ejecuta este script nuevamente');
    }
    
  } catch (error) {
    console.error('❌ Error verificando entorno:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

export { checkDevEnvironment, printSetupInstructions };
