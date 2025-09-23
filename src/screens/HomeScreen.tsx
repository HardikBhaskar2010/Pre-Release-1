import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Surface,
  useTheme,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../contexts/AuthContext';
import {useComponents} from '../contexts/ComponentContext';
import {useProjects} from '../contexts/ProjectContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {user, isAuthenticated} = useAuth();
  const {inventory} = useComponents();
  const {savedProjects, getProjectsByStatus} = useProjects();

  const inProgressProjects = getProjectsByStatus('in-progress');
  const completedProjects = getProjectsByStatus('completed');

  const features = [
    {
      title: 'Component Database',
      description: 'Browse 500+ electronic components with detailed specifications',
      icon: 'memory',
      color: '#6366f1',
      action: () => navigation.navigate('Components' as never),
    },
    {
      title: 'AI Project Generator',
      description: 'Get personalized project ideas based on your components',
      icon: 'auto-awesome',
      color: '#8b5cf6',
      action: () => navigation.navigate('Generator' as never),
    },
    {
      title: 'Project Library',
      description: 'Save, organize, and track your project progress',
      icon: 'folder',
      color: '#06b6d4',
      action: () => navigation.navigate('Library' as never),
    },
  ];

  const stats = [
    {
      title: 'Components Selected',
      value: inventory.length,
      icon: 'inventory',
      color: '#10b981',
    },
    {
      title: 'Projects Saved',
      value: savedProjects.length,
      icon: 'bookmark',
      color: '#f59e0b',
    },
    {
      title: 'In Progress',
      value: inProgressProjects.length,
      icon: 'trending-up',
      color: '#ef4444',
    },
    {
      title: 'Completed',
      value: completedProjects.length,
      icon: 'check-circle',
      color: '#8b5cf6',
    },
  ];

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Hero Section */}
      <Surface style={[styles.heroSection, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.heroContent}>
          <Title style={[styles.heroTitle, {color: theme.colors.primary}]}>
            Atal Idea Generator
          </Title>
          <Paragraph style={[styles.heroSubtitle, {color: theme.colors.onSurface}]}>
            Transform your electronic components into amazing STEM projects with AI-powered suggestions!
          </Paragraph>
          {isAuthenticated ? (
            <Paragraph style={[styles.welcomeText, {color: theme.colors.text}]}>
              Welcome back, {user?.name}! 👋
            </Paragraph>
          ) : (
            <Button
              mode="contained"
              style={styles.getStartedButton}
              onPress={() => navigation.navigate('Profile' as never)}
              contentStyle={styles.buttonContent}>
              Get Started
            </Button>
          )}
        </View>
      </Surface>

      {/* Stats Section */}
      {isAuthenticated && (
        <View style={styles.statsContainer}>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Your Progress
          </Title>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Surface key={index} style={[styles.statCard, {backgroundColor: theme.colors.surface}]}>
                <View style={[styles.statIcon, {backgroundColor: `${stat.color}20`}]}>
                  <Icon name={stat.icon} size={24} color={stat.color} />
                </View>
                <Title style={[styles.statValue, {color: theme.colors.text}]}>
                  {stat.value}
                </Title>
                <Paragraph style={[styles.statTitle, {color: theme.colors.onSurface}]}>
                  {stat.title}
                </Paragraph>
              </Surface>
            ))}
          </View>
        </View>
      )}

      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
          Key Features
        </Title>
        {features.map((feature, index) => (
          <Card
            key={index}
            style={[styles.featureCard, {backgroundColor: theme.colors.surface}]}
            onPress={feature.action}>
            <Card.Content>
              <View style={styles.featureHeader}>
                <View style={[styles.featureIcon, {backgroundColor: `${feature.color}20`}]}>
                  <Icon name={feature.icon} size={28} color={feature.color} />
                </View>
                <View style={styles.featureContent}>
                  <Title style={[styles.featureTitle, {color: theme.colors.text}]}>
                    {feature.title}
                  </Title>
                  <Paragraph style={[styles.featureDescription, {color: theme.colors.onSurface}]}>
                    {feature.description}
                  </Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
          Quick Actions
        </Title>
        <View style={styles.quickActionsGrid}>
          <Button
            mode="contained"
            style={[styles.quickActionButton, {backgroundColor: theme.colors.primary}]}
            onPress={() => navigation.navigate('Components' as never)}
            contentStyle={styles.buttonContent}>
            Browse Components
          </Button>
          <Button
            mode="outlined"
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Generator' as never)}
            contentStyle={styles.buttonContent}>
            Generate Ideas
          </Button>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
  },
  heroContent: {
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  getStartedButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  statsContainer: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  featuresContainer: {
    margin: 16,
  },
  featureCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  quickActionsContainer: {
    margin: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default HomeScreen;