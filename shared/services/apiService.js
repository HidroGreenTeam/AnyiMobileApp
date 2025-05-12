import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL = 'https://ayni-backend-mono-d5akeuepdsgrauaa.canadacentral-01.azurewebsites.net/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Helper function to get token based on platform
const getAuthToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('authToken');
  } else {
    return await SecureStore.getItemAsync('authToken');
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Remove token based on platform
        if (Platform.OS === 'web') {
          localStorage.removeItem('authToken');
        } else {
          await SecureStore.deleteItemAsync('authToken');
        }
      }
      
      return Promise.reject({
        status: status,
        message: error.response.data.message || 'Error en la solicitud',
        data: error.response.data
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'No se pudo conectar con el servidor. Revisa tu conexión a internet.',
      });
    } else {
      return Promise.reject({
        status: 0,
        message: 'Error al realizar la solicitud',
        error: error.message
      });
    }
  }
);

export const apiService = {
  get: (endpoint, params = {}) => {
    return apiClient.get(endpoint, { params });
  },
  
  post: (endpoint, data = {}) => {
    return apiClient.post(endpoint, data);
  },
  
  delete: (endpoint) => {
    return apiClient.delete(endpoint);
  },
  
  patch: (endpoint, data = {}) => {
    return apiClient.patch(endpoint, data);
  },
  
  upload: (endpoint, formData, onUploadProgress = () => {}) => {
    return apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  
  download: (endpoint, params = {}, responseType = 'blob') => {
    return apiClient.get(endpoint, {
      params,
      responseType,
    });
  }
};

export default apiService;