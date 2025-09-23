import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  Surface,
  useTheme,
  Searchbar,
  FAB,
  Menu,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Project} from '../services/api';
import {useProjects} from '../contexts/ProjectContext';

type ProjectStatus = 'saved' | 'in-progress' | 'completed';
type SortOption = 'date' | 'name' | 'difficulty' | 'status';

const ProjectLibraryScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    savedProjects,
    updateProject,
    removeProject,
    getProjectsByStatus,
  } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const statusConfig = {
    saved: {
      label: 'Saved',
      color: '#6b7280',
      icon: 'bookmark-border',
    },
    'in-progress': {
      label: 'In Progress',
      color: '#f59e0b',
      icon: 'work-in-progress',
    },
    completed: {
      label: 'Completed',
      color: '#10b981',
      icon: 'check-circle',
    },
  };

  const sortOptions = [
    {value: 'date', label: 'Date Added', icon: 'schedule'},
    {value: 'name', label: 'Name A-Z', icon: 'sort-by-alpha'},
    {value: 'difficulty', label: 'Difficulty', icon: 'trending-up'},
    {value: 'status', label: 'Status', icon: 'flag'},
  ];

  // Filter and sort projects
  const filteredProjects = React.useMemo(() => {
    let filtered = savedProjects;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.instructions.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = {beginner: 0, intermediate: 1, advanced: 2};
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
                 difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
        case 'status':
          const statusOrder = {saved: 0, 'in-progress': 1, completed: 2};
          return statusOrder[a.status as keyof typeof statusOrder] - 
                 statusOrder[b.status as keyof typeof statusOrder];
        case 'date':
        default:
          return new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime();
      }
    });

    return filtered;
  }, [savedProjects, searchQuery, statusFilter, sortBy]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleProjectPress = (project: Project) => {
    navigation.navigate('ProjectDetail' as never, {project} as never);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProject(projectId, {status: newStatus});
    Toast.show({
      type: 'success',
      text1: 'Status Updated',
      text2: `Project marked as ${statusConfig[newStatus].label.toLowerCase()}`,
    });
  };

  const handleDeleteProject = (projectId: string) => {
    removeProject(projectId);
    Toast.show({
      type: 'success',
      text1: 'Project Deleted',
      text2: 'Project removed from library',
    });
  };

  const getStatusChip = (status: ProjectStatus) => {
    const config = statusConfig[status];
    return (
      <Chip
        icon={config.icon}
        style={[styles.statusChip, {backgroundColor: `${config.color}20`}]}
        textStyle={{color: config.color}}>
        {config.label}
      </Chip>
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

  const stats = {
    total: savedProjects.length,
    saved: getProjectsByStatus('saved').length,
    inProgress: getProjectsByStatus('in-progress').length,
    completed: getProjectsByStatus('completed').length,
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header with Stats */}
      <Surface style={[styles.headerSection, {backgroundColor: theme.colors.surface}]}>
        <Title style={[styles.headerTitle, {color: theme.colors.text}]}>
          Project Library
        </Title>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Title style={[styles.statValue, {color: theme.colors.primary}]}>
              {stats.total}
            </Title>
            <Paragraph style={[styles.statLabel, {color: theme.colors.onSurface}]}>
              Total
            </Paragraph>
          </View>
          <View style={styles.statItem}>
            <Title style={[styles.statValue, {color: statusConfig['in-progress'].color}]}>
              {stats.inProgress}
            </Title>
            <Paragraph style={[styles.statLabel, {color: theme.colors.onSurface}]}>
              In Progress
            </Paragraph>
          </View>
          <View style={styles.statItem}>
            <Title style={[styles.statValue, {color: statusConfig.completed.color}]}>
              {stats.completed}
            </Title>
            <Paragraph style={[styles.statLabel, {color: theme.colors.onSurface}]}>
              Completed
            </Paragraph>
          </View>
        </View>
      </Surface>

      {/* Search and Filters */}
      <Surface style={[styles.filtersSection, {backgroundColor: theme.colors.surface}]}>
        <Searchbar
          placeholder="Search projects..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={statusFilter === 'all'}
              onPress={() => setStatusFilter('all')}
              style={styles.filterChip}>
              All Status
            </Chip>
            {Object.entries(statusConfig).map(([status, config]) => (
              <Chip
                key={status}
                selected={statusFilter === status}
                onPress={() => setStatusFilter(status as ProjectStatus)}
                style={styles.filterChip}
                icon={config.icon}>
                {config.label}
              </Chip>
            ))}
          </ScrollView>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.sortButton}
                contentStyle={styles.sortButtonContent}>
                <Icon name="sort" size={16} />
                {' Sort'}
              </Button>
            }>
            {sortOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  setSortBy(option.value as SortOption);
                  setMenuVisible(false);
                }}
                title={option.label}
                leadingIcon={option.icon}
              />
            ))}
          </Menu>
        </View>
      </Surface>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open" size={48} color={theme.colors.onSurface} />
          <Title style={[styles.emptyTitle, {color: theme.colors.onSurface}]}>
            {searchQuery || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
          </Title>
          <Paragraph style={[styles.emptyText, {color: theme.colors.onSurface}]}>
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Generate some project ideas to get started'
            }
          </Paragraph>
          {!searchQuery && statusFilter === 'all' && (
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Generator' as never)}
              style={styles.emptyButton}>
              Generate Ideas
            </Button>
          )}
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
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              style={[styles.projectCard, {backgroundColor: theme.colors.surface}]}
              onPress={() => handleProjectPress(project)}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.projectInfo}>
                    <Title style={[styles.projectTitle, {color: theme.colors.text}]}>
                      {project.title}
                    </Title>
                    <View style={styles.projectMeta}>
                      <Chip
                        compact
                        style={[styles.categoryChip, {backgroundColor: `${theme.colors.secondary}20`}]}
                        textStyle={{color: theme.colors.secondary}}>
                        {project.category}
                      </Chip>
                      <Chip
                        compact
                        style={[
                          styles.difficultyChip,
                          {backgroundColor: `${getDifficultyColor(project.difficulty)}20`}
                        ]}
                        textStyle={{color: getDifficultyColor(project.difficulty)}}>
                        {project.difficulty}
                      </Chip>
                    </View>
                  </View>
                  {getStatusChip(project.status as ProjectStatus)}
                </View>

                <Paragraph
                  style={[styles.projectInstructions, {color: theme.colors.onSurface}]}
                  numberOfLines={2}>
                  {project.instructions}
                </Paragraph>

                <View style={styles.tagsContainer}>
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <Chip
                      key={index}
                      compact
                      style={styles.tagChip}
                      textStyle={{fontSize: 12}}>
                      {tag}
                    </Chip>
                  ))}
                  {project.tags.length > 3 && (
                    <Chip compact style={styles.tagChip} textStyle={{fontSize: 12}}>
                      +{project.tags.length - 3}
                    </Chip>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <Paragraph style={[styles.dateText, {color: theme.colors.onSurface}]}>
                    {new Date(project.dateSaved).toLocaleDateString()}
                  </Paragraph>
                  
                  <View style={styles.actionButtons}>
                    <Button
                      mode="text"
                      onPress={() => handleProjectPress(project)}
                      contentStyle={styles.actionButtonContent}>
                      View
                    </Button>
                    {project.status === 'saved' && (
                      <Button
                        mode="text"
                        onPress={() => handleStatusChange(project.id!, 'in-progress')}
                        contentStyle={styles.actionButtonContent}>
                        Start
                      </Button>
                    )}
                    {project.status === 'in-progress' && (
                      <Button
                        mode="text"
                        onPress={() => handleStatusChange(project.id!, 'completed')}
                        contentStyle={styles.actionButtonContent}>
                        Complete
                      </Button>
                    )}
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}

      {/* Generate Ideas FAB */}
      <FAB
        icon="auto-awesome"
        label="Generate Ideas"
        style={[styles.fab, {backgroundColor: theme.colors.primary}]}
        onPress={() => navigation.navigate('Generator' as never)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    padding: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  filtersSection: {
    padding: 16,
    elevation: 2,
  },
  searchbar: {
    marginBottom: 12,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterChip: {
    marginRight: 8,
  },
  sortButton: {
    minWidth: 80,
  },
  sortButtonContent: {
    paddingVertical: 4,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  projectCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginRight: 12,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  projectMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryChip: {
    height: 28,
  },
  difficultyChip: {
    height: 28,
  },
  statusChip: {
    height: 32,
  },
  projectInstructions: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  tagChip: {
    height: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButtonContent: {
    paddingHorizontal: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
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
    marginBottom: 24,
    maxWidth: 250,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ProjectLibraryScreen;