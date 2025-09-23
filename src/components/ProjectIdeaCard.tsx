import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {ProjectIdea} from '../services/api';

interface ProjectIdeaCardProps {
  idea: ProjectIdea;
  onSave: () => void;
  isSaved: boolean;
  style?: ViewStyle;
}

const ProjectIdeaCard: React.FC<ProjectIdeaCardProps> = ({
  idea,
  onSave,
  isSaved,
  style,
}) => {
  const theme = useTheme();

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

  const getTimeColor = (time: string) => {
    switch (time) {
      case 'lt-2h':
        return '#10b981';
      case '2-5h':
        return '#f59e0b';
      case '5-10h':
        return '#ef4444';
      case '10h-plus':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getTimeLabel = (time: string) => {
    switch (time) {
      case 'lt-2h':
        return '< 2 hours';
      case '2-5h':
        return '2-5 hours';
      case '5-10h':
        return '5-10 hours';
      case '10h-plus':
        return '10+ hours';
      default:
        return time;
    }
  };

  return (
    <Card style={[styles.card, {backgroundColor: theme.colors.surface}, style]}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Title style={[styles.title, {color: theme.colors.text}]}>
              {idea.title}
            </Title>
            <View style={styles.badges}>
              <Chip
                compact
                style={[
                  styles.difficultyChip,
                  {backgroundColor: `${getDifficultyColor(idea.difficulty)}20`}
                ]}
                textStyle={{color: getDifficultyColor(idea.difficulty)}}>
                {idea.difficulty}
              </Chip>
              <Chip
                compact
                style={[
                  styles.timeChip,
                  {backgroundColor: `${getTimeColor(idea.estimatedTime)}20`}
                ]}
                textStyle={{color: getTimeColor(idea.estimatedTime)}}>
                {getTimeLabel(idea.estimatedTime)}
              </Chip>
            </View>
          </View>
          
          {isSaved && (
            <View style={[styles.savedIndicator, {backgroundColor: theme.colors.primary}]}>
              <Icon name="bookmark" size={16} color={theme.colors.onPrimary} />
            </View>
          )}
        </View>

        {/* Description */}
        <Paragraph style={[styles.description, {color: theme.colors.onSurface}]}>
          {idea.description}
        </Paragraph>

        {/* Category */}
        <View style={styles.categoryContainer}>
          <Chip
            style={[styles.categoryChip, {backgroundColor: `${theme.colors.secondary}20`}]}
            textStyle={{color: theme.colors.secondary}}
            icon="category">
            {idea.category}
          </Chip>
        </View>

        {/* Components */}
        <View style={styles.componentsSection}>
          <Paragraph style={[styles.componentsTitle, {color: theme.colors.text}]}>
            Required Components:
          </Paragraph>
          <View style={styles.componentsContainer}>
            {idea.components.slice(0, 4).map((component, index) => (
              <Chip
                key={index}
                compact
                style={[styles.componentChip, {backgroundColor: `${theme.colors.primary}20`}]}
                textStyle={{color: theme.colors.primary, fontSize: 12}}>
                {component}
              </Chip>
            ))}
            {idea.components.length > 4 && (
              <Chip
                compact
                style={[styles.componentChip, {backgroundColor: `${theme.colors.primary}20`}]}
                textStyle={{color: theme.colors.primary, fontSize: 12}}>
                +{idea.components.length - 4} more
              </Chip>
            )}
          </View>
        </View>

        {/* Instructions Preview */}
        <View style={styles.instructionsSection}>
          <Paragraph style={[styles.instructionsTitle, {color: theme.colors.text}]}>
            Key Steps:
          </Paragraph>
          <View style={styles.instructionsContainer}>
            {idea.instructions.slice(0, 2).map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={[styles.stepNumber, {backgroundColor: theme.colors.primary}]}>
                  <Paragraph style={[styles.stepNumberText, {color: theme.colors.onPrimary}]}>
                    {index + 1}
                  </Paragraph>
                </View>
                <Paragraph style={[styles.instructionText, {color: theme.colors.onSurface}]}>
                  {instruction}
                </Paragraph>
              </View>
            ))}
            {idea.instructions.length > 2 && (
              <Paragraph style={[styles.moreSteps, {color: theme.colors.onSurface}]}>
                +{idea.instructions.length - 2} more steps...
              </Paragraph>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode={isSaved ? 'contained' : 'outlined'}
            onPress={onSave}
            disabled={isSaved}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}>
            <Icon name={isSaved ? 'bookmark' : 'bookmark-border'} size={16} />
            {isSaved ? ' Saved' : ' Save Project'}
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyChip: {
    height: 28,
  },
  timeChip: {
    height: 28,
  },
  savedIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    height: 32,
  },
  componentsSection: {
    marginBottom: 16,
  },
  componentsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  componentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  componentChip: {
    height: 24,
  },
  instructionsSection: {
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  instructionsContainer: {
    gap: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  moreSteps: {
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: 36,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  saveButton: {
    minWidth: 120,
  },
  saveButtonContent: {
    paddingVertical: 6,
  },
});

export default ProjectIdeaCard;