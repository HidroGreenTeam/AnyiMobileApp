// This is a shim for web and Android where the tab bar is generally opaque.
import { Platform } from 'react-native';

export default undefined;

export function useBottomTabOverflow() {
  // Retornar la altura del tab bar para el padding cuando está en posición absoluta
  return Platform.select({
    ios: 90, // Altura del tab bar en iOS
    android: 70, // Altura del tab bar en Android
    default: 70, // Para web y otras plataformas
  });
}
