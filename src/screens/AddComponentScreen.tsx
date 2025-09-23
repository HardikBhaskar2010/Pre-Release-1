import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  useTheme,
  TextInput,
  SegmentedButtons,
  ActivityIndicator,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {ComponentCreate, apiService} from '../services/api';

const AddComponentScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [specifications, setSpecifications] = useState<{[key: string]: string}>({});

  // Dynamic specification fields
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const categories = [
    {value: 'Microcontrollers', label: 'Microcontrollers'},
    {value: 'Sensors', label: 'Sensors'},
    {value: 'Actuators', label: 'Actuators'},
    {value: 'Displays', label: 'Displays'},
    {value: 'Communication', label: 'Communication'},
    {value: 'Power', label: 'Power'},
    {value: 'Other', label: 'Other'},
  ];

  const priceRanges = [
    {value: '$1-5', label: 'Under $5'},
    {value: '$5-15', label: '$5-15'},
    {value: '$15-30', label: '$15-30'},
    {value: '$30-50', label: '$30-50'},
    {value: '$50+', label: 'Over $50'},
  ];

  const createComponentMutation = useMutation({
    mutationFn: (component: ComponentCreate) => apiService.createComponent(component),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['components']});
      Toast.show({
        type: 'success',
        text1: 'Component Added!',
        text2: 'New component has been added to the database',
      });
      navigation.goBack();
    },
    onError: (error: any) => {
      console.error('Create component error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Add Component',
        text2: 'Please try again later',
      });
    },
  });

  const handleAddSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setSpecifications(prev => ({
        ...prev,
        [specKey.trim().toLowerCase().replace(/\s+/g, '_')]: specValue.trim(),
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpecification = (key: string) => {
    setSpecifications(prev => {
      const newSpecs = {...prev};
      delete newSpecs[key];
      return newSpecs;
    });
  };

  const handleSubmit = () => {
    if (!name.trim() || !description.trim() || !category || !priceRange) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields (Name, Description, Category, and Price Range).',
        [{text: 'OK'}]
      );
      return;
    }

    const componentData: ComponentCreate = {
      name: name.trim(),
      description: description.trim(),
      category,
      price_range: priceRange,
      specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
    };

    createComponentMutation.mutate(componentData);
  };

  const isSubmitDisabled = !name.trim() || !description.trim() || !category || !priceRange || createComponentMutation.isPending;

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <Surface style={[styles.headerSection, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, {backgroundColor: `${theme.colors.primary}20`}]}>
            <Icon name="add-circle" size={32} color={theme.colors.primary} />
          </View>
          <Title style={[styles.headerTitle, {color: theme.colors.text}]}>
            Add New Component
          </Title>
          <Paragraph style={[styles.headerSubtitle, {color: theme.colors.onSurface}]}>
            Contribute to our component database by adding new electronic components
          </Paragraph>
        </View>
      </Surface>

      {/* Basic Information */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Basic Information *
          </Title>
          
          <TextInput
            mode="outlined"
            label="Component Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g., Arduino Uno R3"
            style={styles.input}
            right={<TextInput.Icon icon="memory" />}
          />
          
          <TextInput
            mode="outlined"
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of the component and its uses"
            multiline
            numberOfLines={3}
            style={styles.input}
            right={<TextInput.Icon icon="description" />}
          />
        </Card.Content>
      </Card>

      {/* Category */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Category *
          </Title>
          
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <Button
                key={cat.value}
                mode={category === cat.value ? 'contained' : 'outlined'}
                onPress={() => setCategory(cat.value)}
                style={styles.categoryButton}
                contentStyle={styles.categoryButtonContent}>
                {cat.label}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Price Range */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Price Range *
          </Title>
          
          <SegmentedButtons
            value={priceRange}
            onValueChange={setPriceRange}
            buttons={priceRanges.map(price => ({
              value: price.value,
              label: price.label,
            }))}
            style={styles.segmentedButtons}
          />
        </Card.Content>
      </Card>

      {/* Specifications */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Technical Specifications (Optional)
          </Title>
          
          <Paragraph style={[styles.sectionDescription, {color: theme.colors.onSurface}]}>
            Add technical specifications to help users understand the component better.
          </Paragraph>
          
          {/* Add Specification */}
          <View style={styles.addSpecContainer}>
            <View style={styles.specInputs}>
              <TextInput
                mode="outlined"
                label="Specification Name"
                value={specKey}
                onChangeText={setSpecKey}
                placeholder="e.g., Operating Voltage"
                style={styles.specKeyInput}
              />
              <TextInput
                mode="outlined"
                label="Value"
                value={specValue}
                onChangeText={setSpecValue}
                placeholder="e.g., 5V"
                style={styles.specValueInput}
              />
            </View>
            <Button
              mode="outlined"
              onPress={handleAddSpecification}
              disabled={!specKey.trim() || !specValue.trim()}
              style={styles.addSpecButton}
              contentStyle={styles.addSpecButtonContent}>
              <Icon name="add" size={16} />
            </Button>
          </View>
          
          {/* Current Specifications */}
          {Object.keys(specifications).length > 0 && (
            <View style={styles.specificationsContainer}>
              <Paragraph style={[styles.specificationsTitle, {color: theme.colors.text}]}>
                Current Specifications:
              </Paragraph>
              {Object.entries(specifications).map(([key, value]) => (
                <View key={key} style={styles.specificationItem}>
                  <View style={styles.specificationContent}>
                    <Paragraph style={[styles.specificationKey, {color: theme.colors.onSurface}]}>
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Paragraph>
                    <Paragraph style={[styles.specificationValue, {color: theme.colors.text}]}>
                      {value}
                    </Paragraph>
                  </View>
                  <Button
                    mode="text"
                    onPress={() => handleRemoveSpecification(key)}
                    contentStyle={styles.removeSpecButtonContent}>
                    <Icon name="close" size={16} />
                  </Button>
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}>
          {createComponentMutation.isPending ? (
            <>
              <ActivityIndicator size="small" color={theme.colors.onPrimary} />
              {' Adding Component...'}
            </>
          ) : (
            <>
              <Icon name="add-circle" size={20} />
              {' Add Component'}
            </>
          )}
        </Button>
        
        <Paragraph style={[styles.submitNote, {color: theme.colors.onSurface}]}>
          * Required fields
        </Paragraph>
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
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    minWidth: 120,
    marginBottom: 8,
  },
  categoryButtonContent: {
    paddingVertical: 8,
  },
  segmentedButtons: {
    marginTop: 8,
  },
  addSpecContainer: {
    marginBottom: 16,
  },
  specInputs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  specKeyInput: {
    flex: 2,
  },
  specValueInput: {
    flex: 1,
  },
  addSpecButton: {
    alignSelf: 'flex-start',
  },
  addSpecButtonContent: {
    paddingVertical: 4,
  },
  specificationsContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
  },
  specificationsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  specificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  specificationContent: {
    flex: 1,
  },
  specificationKey: {
    fontSize: 14,
    fontWeight: '500',
  },
  specificationValue: {
    fontSize: 14,
    marginTop: 2,
  },
  removeSpecButtonContent: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  submitContainer: {
    padding: 16,
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    maxWidth: 300,
    elevation: 4,
    marginBottom: 8,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },
  submitNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default AddComponentScreen;