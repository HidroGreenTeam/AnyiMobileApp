import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { StyledText } from '@/components/StyledText';
import { StyleColors, Spacing, BorderRadius } from '@/constants';
import { t } from 'i18next';

// Define plant data type
interface PlantData {
  id: string;
  name: string;
  status: string;
  image: string;
}

// Plant Item component props
interface PlantItemProps {
  item: PlantData;
  onPress: (id: string) => void;
}

// Plant Item component
const PlantItem = memo<PlantItemProps>(({ item, onPress }) => {
  const isHealthy = item.status === 'Healthy';
  
  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);
  
  const statusColor = useMemo(() => {
    if (isHealthy) return StyleColors.state.success;
    if (item.status === 'Needs Water') return StyleColors.state.warning;
    return StyleColors.state.error;
  }, [isHealthy, item.status]);
  
  return (
    <TouchableOpacity style={styles.plantCard} onPress={handlePress}>
      <Image source={{ uri: item.image }} style={styles.plantImage} />
      <View style={styles.plantInfo}>
        <StyledText weight="600">{item.name}</StyledText>
        <View style={styles.statusRow}>
          <View 
            style={[
              styles.statusDot, 
              { backgroundColor: statusColor }
            ]} 
          />
          <StyledText style={styles.statusText}>{item.status}</StyledText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={StyleColors.grey.grey3} />
    </TouchableOpacity>
  );
});

PlantItem.displayName = 'PlantItem';

// Mock data for plants
const PLANTS_DATA: PlantData[] = [
  {
    id: '1',
    name: 'Café Arabica #1',
    status: 'Sin Enfermedades',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80', // Planta de café Arabica
  },
  {
    id: '2',
    name: 'Café Robusta #2',
    status: 'Necesita revisión',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=300&q=80', // Planta de café Robusta
  },
  {
    id: '3',
    name: 'Café Liberica #131',
    status: 'Sin Enfermedades',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80', // Planta de café Liberica
  },
  {
    id: '4',
    name: 'Café Excelsa #444',
    status: 'Atención Necesaria',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=300&q=80', // Planta de café Excelsa
  },
  {
    id: '5',
    name: 'Café en Flor #5',
    status: 'Sin Enfermedades',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80', // Flor de planta de café
  },
  {
    id: '6',
    name: 'Café Fruto Maduro #91',
    status: 'Necesita revisión',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=300&q=80', // Fruto maduro de café
  },
];



const PlantsScreen = memo(() => {
  // Handle plant selection
  const handlePlantPress = useCallback((id: string) => {
    console.log(`Plant ${id} selected`);
    // Add navigation or detail view logic here
  }, []);
  
  // Handle add plant button press
  const handleAddPlant = useCallback(() => {
    console.log('Add plant button pressed');
    // Add navigation to add plant screen logic here
  }, []);
  
  // Memoize the render item function to prevent re-creation on each render
  const renderPlantItem = useCallback(({ item }: { item: PlantData }) => (
    <PlantItem item={item} onPress={handlePlantPress} />
  ), [handlePlantPress]);
  
  // Memoize the key extractor
  const keyExtractor = useCallback((item: PlantData) => item.id, []);
  
  const isEmpty = PLANTS_DATA.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <StyledText variant="h4" weight="700">
          {t('My Plants')}
        </StyledText>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlant}>
          <Ionicons name="add" size={24} color={StyleColors.white} />
        </TouchableOpacity>
      </View>
      
      {!isEmpty ? (
        <FlatList
          data={PLANTS_DATA}
          renderItem={renderPlantItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={48} color={StyleColors.grey.grey3} />
          <StyledText variant="h5" weight="600" style={styles.emptyStateTitle}>
            No Plants Yet
          </StyledText>
          <StyledText style={styles.emptyStateText}>
            Add your first plant to start monitoring its health
          </StyledText>
        </View>
      )}
    </SafeAreaView>
  );
});

PlantsScreen.displayName = 'PlantsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: StyleColors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.lg,
  },
  plantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: StyleColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: StyleColors.black.black1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
  },
  plantInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  statusText: {
    fontSize: 14,
    color: StyleColors.grey.grey3,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyStateTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    textAlign: 'center',
    color: StyleColors.grey.grey3,
  },
});

export default PlantsScreen; 