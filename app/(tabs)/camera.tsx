import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

import { StyledText } from '@/components/StyledText';
import { StyleColors, Spacing } from '@/constants';

const CameraScreen = memo(() => {  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState<'front' | 'back'>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<any>(null);

  // Request camera and media library permissions
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Permisos insuficientes',
          'Necesitamos acceso a la cámara y galería para esta funcionalidad'
        );
      }
    })();
  }, []);

  // Take a picture with the camera
  const handleCapturePress = useCallback(async () => {
    if (cameraRef.current && cameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        setCapturedImage(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    } else {
      console.log('Camera not ready');
    }
  }, [cameraReady]);
  
  // Toggle between front and back camera
  const toggleCameraType = useCallback(() => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  }, []);

  // Pick an image from the gallery
  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  }, []);

  // Save captured photo to gallery
  const savePicture = useCallback(async () => {
    if (capturedImage) {
      try {
        await MediaLibrary.saveToLibraryAsync(capturedImage);
        Alert.alert('Éxito', 'Imagen guardada en la galería');
      } catch (error) {
        console.error('Error saving picture:', error);
        Alert.alert('Error', 'No se pudo guardar la imagen');
      }
    }
  }, [capturedImage]);

  // Discard captured image and return to camera
  const retakePicture = useCallback(() => {
    setCapturedImage(null);
  }, []);

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.content}>
          <StyledText>Solicitando permisos...</StyledText>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.content}>
          <StyledText>No hay acceso a la cámara o galería</StyledText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <StyledText variant="h4" weight="700">
          Camera
        </StyledText>
      </View>
      
      <View style={styles.content}>
        {capturedImage ? (
          // Show captured image with options
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
            
            <View style={styles.previewControls}>
              <TouchableOpacity style={styles.controlButton} onPress={retakePicture}>
                <Ionicons name="refresh" size={24} color={StyleColors.grey.grey1} />
                <StyledText style={styles.buttonText}>Volver a tomar</StyledText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton} onPress={savePicture}>
                <Ionicons name="save" size={24} color={StyleColors.grey.grey1} />
                <StyledText style={styles.buttonText}>Guardar</StyledText>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Show camera
          <>
            <View style={styles.camera}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing={type}
                onCameraReady={() => setCameraReady(true)}
              >
                <View style={styles.cameraControls}>
                  <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
                    <Ionicons name="camera-reverse" size={28} color="white" />
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
            
            <View style={styles.bottomControls}>
              <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                <Ionicons name="images" size={28} color={StyleColors.brand.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.captureButton} onPress={handleCapturePress}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
              
              <View style={styles.spacer} />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
});

// Add display name for better debugging
CameraScreen.displayName = 'CameraScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  centerText: {
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  camera: {
    width: '100%',
    height: '75%',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: StyleColors.grey.grey5,
  },
  cameraPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: Spacing.md,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: StyleColors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: StyleColors.brand.primary,
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: StyleColors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    width: 50,
  },
  imagePreviewContainer: {
    width: '100%',
    height: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '85%',
    borderRadius: 12,
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: Spacing.lg,
    width: '100%',
  },
  controlButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  buttonText: {
    marginTop: Spacing.xs,
    fontSize: 12,
  },
});

export default CameraScreen;
