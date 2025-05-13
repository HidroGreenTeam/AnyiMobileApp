import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HapticTab } from '../../components/HapticTab';

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
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: StyleColors.brand.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        lazy: false,
        tabBarStyle: Platform.select({
          android: {
            height: 65,
            backgroundColor: StyleColors.white,
            paddingBottom: 5,
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
          },
          ios: {
            height: 85,
            paddingBottom: 30, // Espacio extra para evitar la home indicator en iOS
            borderTopWidth: 1,
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          },
          default: {
            height: 60,
            paddingBottom: 5,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house" color={color} style={{ marginTop: 6 }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginBottom: Platform.OS === 'ios' ? 10 : 5 }}>Home</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="diagnose"
        options={{
          title: 'Diagnose',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="checkmark.shield" color={color} style={{ marginTop: 6 }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginBottom: Platform.OS === 'ios' ? 10 : 5 }}>Diagnose</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol   
              size={24} 
              name="camera" 
              color="white" 
              style={{
                backgroundColor: focused ? '#007A4D' : StyleColors.brand.primary, // Color más oscuro cuando está activo
                width: 56,
                height: 56,
                borderRadius: 28,
                justifyContent: 'center',
                alignItems: 'center',
               }}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="plants"
        options={{
          title: 'My Plants',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="leaf" color={color} style={{ marginTop: 0 }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginBottom: Platform.OS === 'ios' ? 10 : 5 }}>My Plants</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person" color={color} style={{ marginTop: 0 }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginBottom: 5 }}>Account</Text>
          ),
        }}
      />
    </Tabs>
  );
}