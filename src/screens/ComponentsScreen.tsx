import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  useTheme,
  ActivityIndicator,
  FAB,
} from 'react-native-paper';
import {useQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Component, apiService} from '../services/api';
import {useComponents} from '../contexts/ComponentContext';

const ComponentsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {addToInventory, removeFromInventory, isComponentSelected} = useComponents();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    'All',
    'Microcontrollers',
    'Sensors',
    'Actuators',
    'Displays',
    'Communication',
    'Power',
  ];

  const {
    data: components = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['components', selectedCategory, searchQuery],
    queryFn: () =>
      apiService.getComponents(
        selectedCategory !== 'All' ? selectedCategory : undefined,
        searchQuery || undefined
      ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleComponentPress = (component: Component) => {
    navigation.navigate('ComponentDetail' as never, {component} as never);
  };

  const handleToggleComponent = (component: Component) => {
    const isSelected = isComponentSelected(component.id!);
    
    if (isSelected) {
      removeFromInventory(component.id!);
      Toast.show({
        type: 'success',
        text1: 'Removed from inventory',
        text2: component.name,
      });
    } else {
      addToInventory(component);
      Toast.show({
        type: 'success',
        text1: 'Added to inventory',
        text2: component.name,
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'microcontrollers':
        return 'memory';
      case 'sensors':
        return 'sensors';
      case 'actuators':
        return 'settings-input-component';
      case 'displays':
        return 'monitor';
      case 'communication':
        return 'wifi';
      case 'power':
        return 'battery-charging-full';
      default:
        return 'category';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available':
        return '#10b981';
      case 'partially available':
        return '#f59e0b';
      case 'not available':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (error) {
    return (
      <View style={[styles.centerContainer, {backgroundColor: theme.colors.background}]}>
        <Icon name="error-outline" size={48} color={theme.colors.error} />
        <Title style={[styles.errorTitle, {color: theme.colors.error}]}>
          Failed to load components
        </Title>
        <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Search and Filter */}
      <Surface style={[styles.searchContainer, {backgroundColor: theme.colors.surface}]}>
        <Searchbar
          placeholder="Search components..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={{color: theme.colors.onSurface}}
        />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}>
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryChip}
              textStyle={{
                color: selectedCategory === category 
                  ? theme.colors.onPrimary 
                  : theme.colors.onSurface
              }}>
              {category}
            </Chip>
          ))}
        </ScrollView>
      </Surface>

      {/* Components List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Paragraph style={[styles.loadingText, {color: theme.colors.onSurface}]}>
            Loading components...
          </Paragraph>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          }>
          {components.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="search-off" size={48} color={theme.colors.onSurface} />
              <Title style={[styles.emptyTitle, {color: theme.colors.onSurface}]}>
                No components found
              </Title>
              <Paragraph style={[styles.emptyText, {color: theme.colors.onSurface}]}>
                Try adjusting your search or filter criteria
              </Paragraph>
            </View>
          ) : (
            components.map((component) => {
              const isSelected = isComponentSelected(component.id!);
              const availabilityColor = getAvailabilityColor(component.availability);
              
              return (
                <Card
                  key={component.id}
                  style={[
                    styles.componentCard,
                    {backgroundColor: theme.colors.surface},
                    isSelected && {borderColor: theme.colors.primary, borderWidth: 2}
                  ]}
                  onPress={() => handleComponentPress(component)}>
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <View style={[styles.categoryIcon, {backgroundColor: `${theme.colors.primary}20`}]}>
                        <Icon 
                          name={getCategoryIcon(component.category)} 
                          size={24} 
                          color={theme.colors.primary} 
                        />
                      </View>
                      <View style={styles.availabilityIndicator}>
                        <View 
                          style={[
                            styles.availabilityDot, 
                            {backgroundColor: availabilityColor}
                          ]} 
                        />
                      </View>
                    </View>

                    <Title style={[styles.componentName, {color: theme.colors.text}]}>
                      {component.name}
                    </Title>
                    
                    <Paragraph 
                      style={[styles.componentDescription, {color: theme.colors.onSurface}]}
                      numberOfLines={2}>
                      {component.description}
                    </Paragraph>

                    <View style={styles.cardFooter}>
                      <Chip
                        compact
                        style={[styles.categoryChip, {backgroundColor: `${theme.colors.secondary}20`}]}
                        textStyle={{color: theme.colors.secondary}}>
                        {component.category}
                      </Chip>
                      <Paragraph style={[styles.priceRange, {color: theme.colors.primary}]}>
                        {component.price_range}
                      </Paragraph>
                    </View>

                    <View style={styles.cardActions}>
                      <Button
                        mode={isSelected ? 'contained' : 'outlined'}
                        onPress={() => handleToggleComponent(component)}
                        style={styles.actionButton}
                        contentStyle={styles.buttonContent}>
                        <Icon 
                          name={isSelected ? 'check' : 'add'} 
                          size={16} 
                          color={isSelected ? theme.colors.onPrimary : theme.colors.primary} 
                        />
                        {isSelected ? ' Added' : ' Add to Project'}
                      </Button>
                      
                      <Button
                        mode="text"
                        onPress={() => handleComponentPress(component)}
                        style={styles.detailButton}>
                        Details
                      </Button>
                    </View>

                    {isSelected && (
                      <View style={[styles.selectedIndicator, {backgroundColor: theme.colors.primary}]}>
                        <Icon name="check" size={16} color={theme.colors.onPrimary} />
                      </View>
                    )}
                  </Card.Content>
                </Card>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Add Component FAB */}
      <FAB
        icon="add"
        style={[styles.fab, {backgroundColor: theme.colors.primary}]}
        onPress={() => navigation.navigate('AddComponent' as never)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    elevation: 4,
  },
  searchbar: {
    marginBottom: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 4,
  },
  categoryChip: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  componentCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availabilityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  componentName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  componentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceRange: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
  detailButton: {
    minWidth: 80,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 250,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ComponentsScreen;