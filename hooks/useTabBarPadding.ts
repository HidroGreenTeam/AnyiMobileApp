import { Platform } from 'react-native';

/**
 * Hook para obtener el padding necesario cuando el tab bar está en posición absoluta
 * Esto asegura que el contenido no se oculte detrás del tab bar
 */
export function useTabBarPadding() {
  return Platform.select({
    ios: 90, // Altura del tab bar en iOS
    android: 70, // Altura del tab bar en Android
    default: 70, // Para web y otras plataformas
  });
}
