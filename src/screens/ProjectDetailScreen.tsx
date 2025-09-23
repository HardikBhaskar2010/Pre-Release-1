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
  TextInput,
  Menu,
  Divider,
} from 'react-native-paper';
import {useRoute, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Project} from '../services/api';
import {useProjects} from '../contexts/ProjectContext';

interface RouteParams {
  project: Project;
}

type ProjectStatus = 'saved' | 'in-progress' | 'completed';

const ProjectDetailScreen: React.FC = () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const {project} = route.params as RouteParams;
  const {updateProject, removeProject} = useProjects();

  const [notes, setNotes] = useState(project.notes || '');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const statusConfig = {
    saved: {
      label: 'Saved',
      color: '#6b7280',
      icon: 'bookmark-border',
      description: 'Project saved for later',
    },
    'in-progress': {
      label: 'In Progress',
      color: '#f59e0b',
      icon: 'work-in-progress',
      description: 'Currently working on this',
    },
    completed: {
      label: 'Completed',
      color: '#10b981',
      icon: 'check-circle',
      description: 'Project finished successfully',
    },
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    updateProject(project.id!, {status: newStatus});
    setShowStatusMenu(false);
    Toast.show({
      type: 'success',
      text1: 'Status Updated',
      text2: `Project marked as ${statusConfig[newStatus].label.toLowerCase()}`,
    });
  };

  const handleSaveNotes = () => {
    updateProject(project.id!, {notes});
    setIsEditingNotes(false);
    Toast.show({
      type: 'success',
      text1: 'Notes Saved',
      text2: 'Your notes have been updated',
    });
  };

  const handleDeleteProject = () => {
    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeProject(project.id!);
            Toast.show({
              type: 'success',
              text1: 'Project Deleted',
              text2: 'Project removed from library',
            });
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const currentStatus = statusConfig[project.status as ProjectStatus];

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <Surface style={[styles.headerSection, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.headerContent}>
          <Title style={[styles.projectTitle, {color: theme.colors.text}]}>
            {project.title}
          </Title>
          
          <View style={styles.projectMeta}>
            <Chip
              style={[styles.categoryChip, {backgroundColor: `${theme.colors.secondary}20`}]}
              textStyle={{color: theme.colors.secondary}}>
              {project.category}
            </Chip>
            
            <Chip
              style={[
                styles.difficultyChip,
                {backgroundColor: `${getDifficultyColor(project.difficulty)}20`}
              ]}
              textStyle={{color: getDifficultyColor(project.difficulty)}}>
              {project.difficulty}
            </Chip>
          </View>

          <View style={styles.statusContainer}>
            <Menu
              visible={showStatusMenu}
              onDismiss={() => setShowStatusMenu(false)}
              anchor={
                <Button
                  mode="contained"
                  onPress={() => setShowStatusMenu(true)}
                  style={[styles.statusButton, {backgroundColor: currentStatus.color}]}
                  contentStyle={styles.statusButtonContent}>
                  <Icon name={currentStatus.icon} size={16} />
                  {' ' + currentStatus.label}
                </Button>
              }>
              {Object.entries(statusConfig).map(([status, config]) => (
                <Menu.Item
                  key={status}
                  onPress={() => handleStatusChange(status as ProjectStatus)}
                  title={config.label}
                  leadingIcon={config.icon}
                />
              ))}
            </Menu>
          </View>

          <Paragraph style={[styles.dateText, {color: theme.colors.onSurface}]}>
            Saved on {new Date(project.dateSaved).toLocaleDateString()}
          </Paragraph>
        </View>
      </Surface>

      {/* Instructions */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            <Icon name="assignment" size={20} color={theme.colors.text} />
            {' Instructions'}
          </Title>
          
          <View style={styles.instructionsContainer}>
            <Paragraph style={[styles.instructionsText, {color: theme.colors.onSurface}]}>
              {project.instructions}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Required Components */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            <Icon name="list" size={20} color={theme.colors.text} />
            {' Required Components'}
          </Title>
          
          <View style={styles.componentsContainer}>
            {project.requirements.map((component, index) => (
              <View key={index} style={styles.componentItem}>
                <Icon name="radio-button-checked" size={16} color={theme.colors.primary} />
                <Paragraph style={[styles.componentText, {color: theme.colors.onSurface}]}>
                  {component}
                </Paragraph>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Tags */}
      {project.tags.length > 0 && (
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
              <Icon name="local-offer" size={20} color={theme.colors.text} />
              {' Tags'}
            </Title>
            
            <View style={styles.tagsContainer}>
              {project.tags.map((tag, index) => (
                <Chip
                  key={index}
                  style={[styles.tagChip, {backgroundColor: `${theme.colors.primary}20`}]}
                  textStyle={{color: theme.colors.primary}}>
                  {tag}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Notes */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <View style={styles.notesHeader}>
            <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
              <Icon name="note" size={20} color={theme.colors.text} />
              {' Personal Notes'}
            </Title>
            
            <Button
              mode="text"
              onPress={() => {
                if (isEditingNotes) {
                  handleSaveNotes();
                } else {
                  setIsEditingNotes(true);
                }
              }}
              contentStyle={styles.editButtonContent}>
              {isEditingNotes ? 'Save' : 'Edit'}
            </Button>
          </View>
          
          {isEditingNotes ? (
            <View style={styles.notesEditContainer}>
              <TextInput
                mode="outlined"
                multiline
                numberOfLines={4}
                placeholder="Add your notes, progress, or modifications..."
                value={notes}
                onChangeText={setNotes}
                style={styles.notesInput}
              />
              <View style={styles.notesActions}>
                <Button
                  mode="text"
                  onPress={() => {
                    setNotes(project.notes || '');
                    setIsEditingNotes(false);
                  }}
                  style={styles.cancelButton}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveNotes}
                  style={styles.saveButton}
                  contentStyle={styles.buttonContent}>
                  Save Notes
                </Button>
              </View>
            </View>
          ) : (
            <View style={styles.notesDisplayContainer}>
              {notes.trim() ? (
                <Paragraph style={[styles.notesText, {color: theme.colors.onSurface}]}>
                  {notes}
                </Paragraph>
              ) : (
                <Paragraph style={[styles.noNotesText, {color: theme.colors.onSurface}]}>
                  No notes added yet. Tap "Edit" to add your thoughts, progress, or modifications.
                </Paragraph>
              )}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Actions */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Actions
          </Title>
          
          <View style={styles.actionsContainer}>
            {project.status === 'saved' && (
              <Button
                mode="contained"
                onPress={() => handleStatusChange('in-progress')}
                style={[styles.actionButton, {backgroundColor: statusConfig['in-progress'].color}]}
                contentStyle={styles.buttonContent}>
                <Icon name="play-arrow" size={16} />
                {' Start Project'}
              </Button>
            )}
            
            {project.status === 'in-progress' && (
              <Button
                mode="contained"
                onPress={() => handleStatusChange('completed')}
                style={[styles.actionButton, {backgroundColor: statusConfig.completed.color}]}
                contentStyle={styles.buttonContent}>
                <Icon name="check" size={16} />
                {' Mark Complete'}
              </Button>
            )}
            
            <Button
              mode="outlined"
              onPress={handleDeleteProject}
              style={[styles.actionButton, styles.deleteButton, {borderColor: theme.colors.error}]}
              contentStyle={styles.buttonContent}
              textColor={theme.colors.error}>
              <Icon name="delete" size={16} />
              {' Delete Project'}
            </Button>
          </View>
        </Card.Content>
      </Card>

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
  projectTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  projectMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  categoryChip: {
    height: 32,
  },
  difficultyChip: {
    height: 32,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusButton: {
    elevation: 2,
  },
  statusButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 14,
    fontStyle: 'italic',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionsContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
  },
  componentsContainer: {
    gap: 12,
  },
  componentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  componentText: {
    fontSize: 14,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    height: 32,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editButtonContent: {
    paddingVertical: 4,
  },
  notesEditContainer: {
    gap: 12,
  },
  notesInput: {
    minHeight: 100,
  },
  notesActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    marginRight: 8,
  },
  saveButton: {
    minWidth: 100,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  notesDisplayContainer: {
    minHeight: 60,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noNotesText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    elevation: 2,
  },
  deleteButton: {
    marginTop: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default ProjectDetailScreen;