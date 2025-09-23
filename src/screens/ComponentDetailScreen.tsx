import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  useTheme,
  Divider,
} from 'react-native-paper';
import {useRoute, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Component} from '../services/api';
import {useComponents} from '../contexts/ComponentContext';

interface RouteParams {
  component: Component;
}

const ComponentDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const {component} = route.params as RouteParams;
  const {addToInventory, removeFromInventory, isComponentSelected} = useComponents();

  const isSelected = isComponentSelected(component.id!);

  const handleToggleComponent = () => {
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

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <Surface style={[styles.headerSection, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.headerContent}>
          <View style={[styles.categoryIcon, {backgroundColor: `${theme.colors.primary}20`}]}>
            <Icon 
              name={getCategoryIcon(component.category)} 
              size={32} 
              color={theme.colors.primary} 
            />
          </View>
          
          <Title style={[styles.componentName, {color: theme.colors.text}]}>
            {component.name}
          </Title>
          
          <Paragraph style={[styles.componentDescription, {color: theme.colors.onSurface}]}>
            {component.description}
          </Paragraph>

          <View style={styles.headerMeta}>
            <Chip
              style={[styles.categoryChip, {backgroundColor: `${theme.colors.secondary}20`}]}
              textStyle={{color: theme.colors.secondary}}>
              {component.category}
            </Chip>
            
            <View style={styles.availabilityContainer}>
              <View 
                style={[
                  styles.availabilityDot, 
                  {backgroundColor: getAvailabilityColor(component.availability)}
                ]} 
              />
              <Paragraph style={[styles.availabilityText, {color: theme.colors.onSurface}]}>
                {component.availability}
              </Paragraph>
            </View>
          </View>

          <Title style={[styles.priceRange, {color: theme.colors.primary}]}>
            {component.price_range}
          </Title>
        </View>
      </Surface>

      {/* Specifications */}
      {component.specifications && Object.keys(component.specifications).length > 0 && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Technical Specifications
            </Title>
            
            <View style={styles.specificationsContainer}>
              {Object.entries(component.specifications).map(([key, value], index) => (
                <View key={key}>
                  <View style={styles.specificationRow}>
                    <Paragraph style={[styles.specKey, {color: theme.colors.onSurface}]}>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Paragraph>
                    <Paragraph style={[styles.specValue, {color: theme.colors.text}]}>
                      {value}
                    </Paragraph>
                  </View>
                  {index < Object.entries(component.specifications).length - 1 && (
                    <Divider style={styles.specDivider} />
                  )}
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Usage Tips */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Usage & Applications
          </Title>
          
          <View style={styles.usageContainer}>
            <View style={styles.usageItem}>
              <Icon name="lightbulb-outline" size={20} color={theme.colors.primary} />
              <Paragraph style={[styles.usageText, {color: theme.colors.onSurface}]}>
                Perfect for {component.category.toLowerCase()} projects
              </Paragraph>
            </View>
            
            <View style={styles.usageItem}>
              <Icon name="build" size={20} color={theme.colors.primary} />
              <Paragraph style={[styles.usageText, {color: theme.colors.onSurface}]}>
                Easy to integrate with microcontrollers
              </Paragraph>
            </View>
            
            <View style={styles.usageItem}>
              <Icon name="school" size={20} color={theme.colors.primary} />
              <Paragraph style={[styles.usageText, {color: theme.colors.onSurface}]}>
                Great for learning and prototyping
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Project Ideas */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Project Ideas
          </Title>
          
          <Paragraph style={[styles.projectIdeasText, {color: theme.colors.onSurface}]}>
            Add this component to your inventory and use the AI Generator to discover 
            amazing project ideas that incorporate {component.name}!
          </Paragraph>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Generator' as never)}
            style={styles.projectIdeasButton}
            contentStyle={styles.buttonContent}>
            <Icon name="auto-awesome" size={16} />
            {' Generate Project Ideas'}
          </Button>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          mode={isSelected ? 'contained' : 'outlined'}
          onPress={handleToggleComponent}
          style={[styles.actionButton, isSelected && {backgroundColor: theme.colors.primary}]}
          contentStyle={styles.actionButtonContent}>
          <Icon 
            name={isSelected ? 'check' : 'add'} 
            size={20} 
            color={isSelected ? theme.colors.onPrimary : theme.colors.primary} 
          />
          {isSelected ? ' Added to Project' : ' Add to Project'}
        </Button>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    padding: 24,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  componentName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  componentDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  categoryChip: {
    flex: 1,
    marginRight: 16,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceRange: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  specificationsContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  specKey: {
    fontSize: 14,
    flex: 1,
    marginRight: 16,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  specDivider: {
    marginVertical: 4,
  },
  usageContainer: {
    gap: 12,
  },
  usageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  usageText: {
    fontSize: 14,
    flex: 1,
  },
  projectIdeasText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  projectIdeasButton: {
    alignSelf: 'center',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  actionContainer: {
    padding: 16,
  },
  actionButton: {
    elevation: 4,
  },
  actionButtonContent: {
    paddingVertical: 12,
  },
  bottomSpacer: {
    height: 16,
  },
});

export default ComponentDetailScreen;