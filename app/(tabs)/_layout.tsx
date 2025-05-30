import { Tabs } from 'expo-router';
import { Platform, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import { FloatingCameraButton } from '@/components/FloatingCameraButton';
import { t } from 'i18next';

const StyleColors = {
  brand: {
    primary: '#00A86B', 
  },
  white: '#FFFFFF',
};

const IconSymbol = ({ name, size, color, style }: { name: string, size: number, color: string, style: any }) => {
  const iconMapping = {
    'house': 'home-outline',
    'checkmark.shield': 'shield-checkmark-outline',
    'camera': 'camera-outline',
    'leaf': 'leaf-outline',
    'person': 'person-outline',
    'flask': 'flask-outline', // Para el icono de pruebas
  };
  
  const ionIconName = iconMapping[name as keyof typeof iconMapping] || name;
  
  return (
    <View style={style}>
      <Ionicons name={ionIconName as any} size={size} color={color} />
    </View>
  );
};

const TabBarBackground = () => {
  return <View style={{ backgroundColor: StyleColors.white, flex: 1 }} />;
};

const useColorScheme = () => {
  return 'light'; 
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: StyleColors.brand.primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          lazy: false,
          tabBarStyle: Platform.select({
            android: {
              height: 70,
              backgroundColor: StyleColors.white,
              paddingBottom: 8,
              paddingTop: 8,
              borderTopColor: 'rgba(255, 255, 255, 0.1)',
              elevation: 5, // Reducido para que el botón flotante esté por encima
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            },
            ios: {
              height: 90,
              paddingBottom: 35,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: 'rgba(0, 0, 0, 0.1)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            },
            default: {
              height: 70,
              paddingBottom: 8,
              paddingTop: 8,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            },
          }),
        }}><Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={24} 
              name="house" 
              color={color} 
              style={{ 
                marginTop: Platform.OS === 'ios' ? 0 : 2,
                marginBottom: Platform.OS === 'ios' ? 2 : 0,
              }} 
            />
          ),          tabBarLabel: ({ color }) => (
            <Text style={{ 
              color, 
              fontSize: 11, 
              marginTop: Platform.OS === 'ios' ? 0 : 4,
              marginBottom: Platform.OS === 'ios' ? 4 : 2,
              textAlign: 'center',
            }}>
              {t('Home')}
            </Text>
          ),
        }}
      />      <Tabs.Screen
        name="diagnose"
        options={{
          title: 'Diagnose',
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={24} 
              name="checkmark.shield" 
              color={color} 
              style={{ 
                marginTop: Platform.OS === 'ios' ? 0 : 2,
                marginBottom: Platform.OS === 'ios' ? 2 : 0,
              }} 
            />
          ),          tabBarLabel: ({ color }) => (
            <Text style={{ 
              color, 
              fontSize: 11, 
              marginTop: Platform.OS === 'ios' ? 0 : 4,
              marginBottom: Platform.OS === 'ios' ? 4 : 2,
              textAlign: 'center',
            }}>
              {t('Diagnose')}
            </Text>
          ),
        }}
      />      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => (
            <View style={{ opacity: 0 }}>
              <Ionicons name="camera-outline" size={24} color={color} />
            </View>
          ),
          tabBarLabel: () => null,
          tabBarItemStyle: {
            backgroundColor: 'transparent',
          },
        }}
      /><Tabs.Screen
        name="plants"
        options={{
          title: 'My Plants',
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={24} 
              name="leaf" 
              color={color} 
              style={{ 
                marginTop: Platform.OS === 'ios' ? 0 : 2,
                marginBottom: Platform.OS === 'ios' ? 2 : 0,
              }} 
            />
          ),          tabBarLabel: ({ color }) => (
            <Text style={{ 
              color, 
              fontSize: 11, 
              marginTop: Platform.OS === 'ios' ? 0 : 4,
              marginBottom: Platform.OS === 'ios' ? 4 : 2,
              textAlign: 'center',
            }}>
              {t('My Plants')}
            </Text>
          ),
        }}
      />      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => (
            <IconSymbol 
              size={24} 
              name="person" 
              color={color} 
              style={{ 
                marginTop: Platform.OS === 'ios' ? 0 : 2,
                marginBottom: Platform.OS === 'ios' ? 2 : 0,
              }} 
            />
          ),          tabBarLabel: ({ color }) => (
            <Text style={{ 
              color, 
              fontSize: 11, 
              marginTop: Platform.OS === 'ios' ? 0 : 4,
              marginBottom: Platform.OS === 'ios' ? 4 : 2,
              textAlign: 'center',
            }}>
              {t('Account')}
            </Text>
          ),}}      />
    </Tabs>
    
    {/* Botón flotante de cámara - fuera de Tabs para evitar warnings */}
    <FloatingCameraButton />
  </View>
  );
}