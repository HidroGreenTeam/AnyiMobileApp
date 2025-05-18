import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import FarmerService, { FarmerResponse, UpdateFarmerDto } from "./services/farmer-service";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  StyleSheet, 
  TextInput, 
  Image, 
  Alert, 
  Platform, 
  TouchableOpacity, 
  ActivityIndicator,
  View,
  StatusBar,
  Button
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

export default function DetailAccountScreen() {
  const [farmer, setFarmer] = useState<FarmerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const farmerService = new FarmerService();

  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchFarmer = async () => {
      if (!user) {
        return;
      }
      try {
        setIsLoading(true);
        const farmerData = await farmerService.getFarmer(user.id);
        setFarmer(farmerData);
        setUsername(farmerData.username || '');
        setPhoneNumber(farmerData.phoneNumber || '');
        setSelectedImage(farmerData.imageUrl);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch farmer data');
        setIsLoading(false);
      }
    };
    fetchFarmer();
  }, [user]);

  // Check for changes to enable/disable update button
  useEffect(() => {
    if (!farmer) return;
    
    const hasProfileChanges = 
      username !== farmer.username || 
      phoneNumber !== farmer.phoneNumber;
    
    setHasChanges(hasProfileChanges);
  }, [username, phoneNumber, farmer]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      setIsUpdating(true);
      const updateData: UpdateFarmerDto = {};
      if (username !== farmer?.username) updateData.username = username;
      if (phoneNumber !== farmer?.phoneNumber) updateData.phoneNumber = phoneNumber;

      if (Object.keys(updateData).length > 0) {
        const updatedFarmer = await farmerService.updateFarmer(user.id, updateData);
        setFarmer(updatedFarmer);
        Alert.alert("Success", "Profile updated successfully!");
        setHasChanges(false);
      } else {
        Alert.alert("Info", "No changes to update.");
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      Alert.alert("Error", err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
    
    // Using MediaType array instead of deprecated MediaTypeOptions
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
      handleImageUpload(result.assets[0].uri);
    }
  };

  const handleImageUpload = async (uri: string) => {
    if (!user || !uri) return;
    
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image`;

    // @ts-ignore
    formData.append('file', { uri, name: filename, type });

    try {
      setIsUpdating(true);
      const updatedFarmer = await farmerService.uploadFarmerImage(user.id, formData);
      setFarmer(updatedFarmer);
      setSelectedImage(updatedFarmer.imageUrl);
      Alert.alert("Success", "Image uploaded successfully!");
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      Alert.alert("Error", err.message || 'Failed to upload image');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading && !farmer) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.centeredContent}>
          <ActivityIndicator size="large" color="#2E8B57" />
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error && !farmer) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.centeredContent}>
          <Ionicons name="alert-circle" size={50} color="#FF6347" />
          <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setIsLoading(true);
              if (user) {
                farmerService.getFarmer(user.id)
                  .then(data => {
                    setFarmer(data);
                    setUsername(data.username || '');
                    setPhoneNumber(data.phoneNumber || '');
                    setSelectedImage(data.imageUrl);
                    setIsLoading(false);
                  })
                  .catch(err => {
                    setError(err.message || 'Failed to fetch farmer data');
                    setIsLoading(false);
                  });
              }
            }}
          >
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' />
      
      <ThemedView style={styles.content}>
                <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2E8B57" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={pickImage} 
          style={styles.imageContainer}
          disabled={isUpdating}
        >
          {isUpdating && selectedImage === null && (
            <View style={[styles.profileImagePlaceholder, styles.uploading]}>
              <ActivityIndicator size="large" color="#2E8B57" />
            </View>
          )}
          {selectedImage ? (
            <>
              <Image source={{ uri: selectedImage }} style={styles.profileImage} />
              {isUpdating && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#ffffff" />
                </View>
              )}
            </>
          ) : (
            <ThemedView style={styles.profileImagePlaceholder}>
              <Ionicons name="camera" size={50} color="#2E8B57" />
              <ThemedText type="subtitle" style={styles.addPhotoText}>Add Photo</ThemedText>
            </ThemedView>
          )}
        </TouchableOpacity>

        <ThemedText style={styles.label} type="defaultSemiBold">Username</ThemedText>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor="#999"
          editable={!isUpdating}
        />

        <ThemedText style={styles.label} type="defaultSemiBold">Email</ThemedText>
        <ThemedView style={styles.readOnlyField}>
          <ThemedText style={styles.emailText}>{farmer?.email || "Not available"}</ThemedText>
        </ThemedView>
        
        <ThemedText style={styles.label} type="defaultSemiBold">Phone Number</ThemedText>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
          editable={!isUpdating}
        />
        
        <TouchableOpacity 
          style={[
            styles.updateButton, 
            (!hasChanges || isUpdating) && styles.updateButtonDisabled
          ]} 
          onPress={handleUpdateProfile} 
          disabled={!hasChanges || isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <ThemedText style={styles.updateButtonText}>
              Update Profile
            </ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2E8B57',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#2E8B57',
  },
  profileImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2E8B57',
    overflow: 'hidden',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploading: {
    backgroundColor: 'rgba(46, 139, 87, 0.1)',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#c4e3d3',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  readOnlyField: {
    backgroundColor: '#f1f9f5',
    borderWidth: 1,
    borderColor: '#c4e3d3',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  emailText: {
    fontSize: 16,
    color: '#555',
  },
  updateButton: {
    backgroundColor: '#2E8B57',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 50,
  },
  updateButtonDisabled: {
    backgroundColor: '#a5d6b7',
    opacity: 0.7,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2E8B57',
  },
  errorText: {
    color: '#FF6347',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2E8B57',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addPhotoText: {
    color: '#2E8B57',
    marginTop: 6,
  },
});