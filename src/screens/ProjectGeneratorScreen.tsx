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
  Chip,
  Surface,
  useTheme,
  ActivityIndicator,
  TextInput,
  RadioButton,
} from 'react-native-paper';
import {useMutation} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {GenerateProjectRequest, ProjectIdea, apiService} from '../services/api';
import {useComponents} from '../contexts/ComponentContext';
import {useProjects} from '../contexts/ProjectContext';
import ProjectIdeaCard from '../components/ProjectIdeaCard';

const ProjectGeneratorScreen: React.FC = () => {
  const theme = useTheme();
  const {getSelectedComponentNames} = useComponents();
  const {setGeneratedIdeas, generatedIdeas, isProjectSaved, saveIdeaAsProject} = useProjects();

  const [skillLevel, setSkillLevel] = useState<string>('beginner');
  const [timeCommitment, setTimeCommitment] = useState<string>('2-5h');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  const skillLevels = [
    {value: 'beginner', label: 'Beginner', description: 'New to electronics'},
    {value: 'intermediate', label: 'Intermediate', description: 'Some experience'},
    {value: 'advanced', label: 'Advanced', description: 'Experienced maker'},
  ];

  const timeCommitments = [
    {value: 'lt-2h', label: '< 2 hours', icon: 'schedule'},
    {value: '2-5h', label: '2-5 hours', icon: 'access-time'},
    {value: '5-10h', label: '5-10 hours', icon: 'more-time'},
    {value: '10h-plus', label: '10+ hours', icon: 'timer'},
  ];

  const categories = [
    'Robotics',
    'IoT',
    'Automation',
    'Wearables',
    'AI/ML',
    'Energy',
    'Environmental',
    'Home',
    'Educational',
    'Art & Creative',
  ];

  const generateMutation = useMutation({
    mutationFn: (request: GenerateProjectRequest) => apiService.generateProjectIdeas(request),
    onSuccess: (ideas: ProjectIdea[]) => {
      setGeneratedIdeas(ideas);
      Toast.show({
        type: 'success',
        text1: 'Ideas Generated!',
        text2: `Found ${ideas.length} project ideas for you`,
      });
    },
    onError: (error: any) => {
      console.error('Generate ideas error:', error);
      Toast.show({
        type: 'error',
        text1: 'Generation Failed',
        text2: 'Please try again later',
      });
    },
  });

  const handleGenerateIdeas = () => {
    const selectedComponents = getSelectedComponentNames();
    
    if (selectedComponents.length === 0) {
      Alert.alert(
        'No Components Selected',
        'Please select some components from the Components tab to generate personalized project ideas.',
        [
          {text: 'OK'},
        ]
      );
      return;
    }

    const request: GenerateProjectRequest = {
      skill: skillLevel,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      components: selectedComponents,
      time: timeCommitment,
      notes: notes.trim() || undefined,
    };

    generateMutation.mutate(request);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSaveIdea = (idea: ProjectIdea) => {
    const saved = isProjectSaved(idea.id);
    if (!saved) {
      saveIdeaAsProject(idea);
      Toast.show({
        type: 'success',
        text1: 'Project Saved!',
        text2: idea.title,
      });
    }
  };

  const selectedComponents = getSelectedComponentNames();

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <Surface style={[styles.headerSection, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.headerContent}>
          <Title style={[styles.headerTitle, {color: theme.colors.primary}]}>
            AI Project Generator
          </Title>
          <Paragraph style={[styles.headerSubtitle, {color: theme.colors.onSurface}]}>
            Get personalized STEM project ideas based on your components and preferences
          </Paragraph>
        </View>
      </Surface>

      {/* Selected Components */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Selected Components ({selectedComponents.length})
          </Title>
          {selectedComponents.length === 0 ? (
            <Paragraph style={[styles.noComponentsText, {color: theme.colors.onSurface}]}>
              No components selected. Go to Components tab to select components for your project.
            </Paragraph>
          ) : (
            <View style={styles.componentsContainer}>
              {selectedComponents.map((component, index) => (
                <Chip
                  key={index}
                  style={[styles.componentChip, {backgroundColor: `${theme.colors.primary}20`}]}
                  textStyle={{color: theme.colors.primary}}>
                  {component}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Skill Level */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Skill Level
          </Title>
          <RadioButton.Group
            onValueChange={(value) => setSkillLevel(value)}
            value={skillLevel}>
            {skillLevels.map((skill) => (
              <View key={skill.value} style={styles.radioItem}>
                <RadioButton value={skill.value} />
                <View style={styles.radioContent}>
                  <Title style={[styles.radioTitle, {color: theme.colors.text}]}>
                    {skill.label}
                  </Title>
                  <Paragraph style={[styles.radioDescription, {color: theme.colors.onSurface}]}>
                    {skill.description}
                  </Paragraph>
                </View>
              </View>
            ))}
          </RadioButton.Group>
        </Card.Content>
      </Card>

      {/* Time Commitment */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Available Time
          </Title>
          <View style={styles.timeGrid}>
            {timeCommitments.map((time) => (
              <Button
                key={time.value}
                mode={timeCommitment === time.value ? 'contained' : 'outlined'}
                onPress={() => setTimeCommitment(time.value)}
                style={styles.timeButton}
                contentStyle={styles.timeButtonContent}>
                <Icon name={time.icon} size={16} />
                {' ' + time.label}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Categories */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Project Categories (Optional)
          </Title>
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <Chip
                key={category}
                selected={selectedCategories.includes(category)}
                onPress={() => toggleCategory(category)}
                style={styles.categoryChip}
                textStyle={{
                  color: selectedCategories.includes(category)
                    ? theme.colors.onPrimary
                    : theme.colors.onSurface
                }}>
                {category}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Additional Notes */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Additional Notes (Optional)
          </Title>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={3}
            placeholder="Any specific requirements or preferences..."
            value={notes}
            onChangeText={setNotes}
            style={styles.notesInput}
          />
        </Card.Content>
      </Card>

      {/* Generate Button */}
      <View style={styles.generateContainer}>
        <Button
          mode="contained"
          onPress={handleGenerateIdeas}
          loading={generateMutation.isPending}
          disabled={generateMutation.isPending || selectedComponents.length === 0}
          style={styles.generateButton}
          contentStyle={styles.generateButtonContent}>
          <Icon name="auto-awesome" size={20} />
          {generateMutation.isPending ? ' Generating Ideas...' : ' Generate Project Ideas'}
        </Button>
      </View>

      {/* Generated Ideas */}
      {generatedIdeas.length > 0 && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Generated Ideas ({generatedIdeas.length})
            </Title>
            {generatedIdeas.map((idea, index) => (
              <ProjectIdeaCard
                key={idea.id}
                idea={idea}
                onSave={() => handleSaveIdea(idea)}
                isSaved={isProjectSaved(idea.id)}
                style={index > 0 ? styles.ideaCardSpacing : undefined}
              />
            ))}
          </Card.Content>
        </Card>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
  },
  headerContent: {
    padding: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
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
    marginBottom: 16,
  },
  noComponentsText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  componentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  componentChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioContent: {
    marginLeft: 8,
    flex: 1,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioDescription: {
    fontSize: 14,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    minWidth: '45%',
  },
  timeButtonContent: {
    paddingVertical: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  notesInput: {
    marginTop: 8,
  },
  generateContainer: {
    margin: 16,
  },
  generateButton: {
    elevation: 4,
  },
  generateButtonContent: {
    paddingVertical: 12,
  },
  ideaCardSpacing: {
    marginTop: 16,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default ProjectGeneratorScreen;