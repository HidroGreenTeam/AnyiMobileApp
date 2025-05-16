import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, FlatList, Animated, ViewToken } from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Your All-in-One Plant Care Companion',
    description: 'Ayni helps you care for your plants. Set reminders, document their growth, and diagnose diseases with a quick camera scan.',
    image: require('@/assets/images/icon.png')
  },
  {
    id: '2',
    title: 'Check Your Plant',
    description: 'Take photos, start diagnose diseases, and get plant care tips for optimal growth.',
    image: require('@/assets/images/icon.png')
  }
];

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewableItemsChanged = useRef(({ viewableItems }: ViewableItemsChanged) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;
  
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const slidesRef = useRef<FlatList<OnboardingItem>>(null);

  const navigateToLogin = () => {
    router.replace('/auth/login');
  };
  
  const  goToNextSlide = () => {
    if (currentIndex < onboardingData.length - 1 && slidesRef.current) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigateToLogin();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
      </View>
      
      <FlatList
        data={onboardingData}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image 
              source={item.image} 
              style={styles.slideImage} 
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.description}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
        <View style={styles.paginationContainer}>
        {onboardingData.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { width: dotWidth, opacity, backgroundColor: i === currentIndex ? '#07B279' : '#E6F4EF' },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.skipButton} onPress={navigateToLogin}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} onPress={goToNextSlide}>
          <Text style={styles.continueText}>{currentIndex === onboardingData.length - 1 ? 'Continue' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  slide: {
    alignItems: 'center',
    padding: 20,
  },
  slideImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#07B279',
    marginHorizontal: 5,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#E6F4EF',
    padding: 16,
    borderRadius: 30,
    marginRight: 10,
    alignItems: 'center',
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#07B279',
    padding: 16,
    borderRadius: 30,
    marginLeft: 10,
    alignItems: 'center',
  },
  skipText: {
    color: '#07B279',
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
