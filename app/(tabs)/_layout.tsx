import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const StyleColors = {
  brand: {
    primary: '#00A86B', 
  },
  white: '#FFFFFF',
};

const HapticTab = ({ children, ...props }: { children: React.ReactNode } & any) => {
  return (
    <View {...props}>
      {children}
    </View>
  );
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
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {
            height: 80,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house" color={color} style={{ marginTop: 10 }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginTop: 2 }}>Home</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="diagnose"
        options={{
          title: 'Diagnose',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="checkmark.shield" color={color} style={{ marginTop: 10 }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginTop: 2 }}>Diagnose</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color }) => (
            <IconSymbol   
              size={24} 
              name="camera" 
              color="white" 
              style={{
                backgroundColor: StyleColors.brand.primary,
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
                marginTop: 10,
              }}
            />
          ),
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginTop: 2 }}>Camera</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="plants"
        options={{
          title: 'My Plants',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="leaf" color={color} style={{ marginTop: 10 }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginTop: 2 }}>My Plants</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person" color={color} style={{ marginTop: 10 }} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, fontSize: 12, marginTop: 2 }}>Account</Text>
          ),
        }}
      />
    </Tabs>
  );
}