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
  Avatar,
  Surface,
  useTheme,
  TextInput,
  Divider,
  List,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {useAuth} from '../contexts/AuthContext';
import {useComponents} from '../contexts/ComponentContext';
import {useProjects} from '../contexts/ProjectContext';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const {user, isAuthenticated, signIn, signUp, logout} = useAuth();
  const {clearInventory, inventory} = useComponents();
  const {savedProjects} = useProjects();

  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        Toast.show({
          type: 'success',
          text1: 'Account Created!',
          text2: 'Welcome to Atal Idea Generator',
        });
      } else {
        await signIn(email, password);
        Toast.show({
          type: 'success',
          text1: 'Signed In!',
          text2: `Welcome back, ${name}`,
        });
      }
      setShowAuth(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: isSignUp ? 'Sign Up Failed' : 'Sign In Failed',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Toast.show({
                type: 'success',
                text1: 'Signed Out',
                text2: 'See you next time!',
              });
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Sign Out Failed',
                text2: error.message,
              });
            }
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'This will clear your selected components. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearInventory();
            Toast.show({
              type: 'success',
              text1: 'Data Cleared',
              text2: 'Component inventory cleared',
            });
          },
        },
      ]
    );
  };

  const stats = {
    components: inventory.length,
    projects: savedProjects.length,
    completed: savedProjects.filter(p => p.status === 'completed').length,
  };

  if (!isAuthenticated) {
    return (
      <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {/* Header */}
        <Surface style={[styles.headerSection, {backgroundColor: theme.colors.surface}]}>
          <View style={styles.headerContent}>
            <Avatar.Icon
              size={80}
              icon="person"
              style={[styles.avatar, {backgroundColor: theme.colors.primary}]}
            />
            <Title style={[styles.headerTitle, {color: theme.colors.text}]}>
              Welcome to Atal Ideas
            </Title>
            <Paragraph style={[styles.headerSubtitle, {color: theme.colors.onSurface}]}>
              Sign in to save your projects and sync across devices
            </Paragraph>
          </View>
        </Surface>

        {/* Auth Form */}
        {!showAuth ? (
          <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
            <Card.Content style={styles.authButtons}>
              <Button
                mode="contained"
                onPress={() => {
                  setIsSignUp(false);
                  setShowAuth(true);
                }}
                style={styles.authButton}
                contentStyle={styles.buttonContent}>
                Sign In
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setIsSignUp(true);
                  setShowAuth(true);
                }}
                style={styles.authButton}
                contentStyle={styles.buttonContent}>
                Create Account
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
            <Card.Content>
              <Title style={[styles.authTitle, {color: theme.colors.text}]}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Title>
              
              {isSignUp && (
                <TextInput
                  mode="outlined"
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              )}
              
              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              
              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              
              <View style={styles.authActions}>
                <Button
                  mode="text"
                  onPress={() => setShowAuth(false)}
                  style={styles.cancelButton}>
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAuth}
                  loading={loading}
                  disabled={loading}
                  style={styles.submitButton}
                  contentStyle={styles.buttonContent}>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </View>
              
              <Button
                mode="text"
                onPress={() => setIsSignUp(!isSignUp)}
                style={styles.switchAuthButton}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Guest Features */}
        <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
              Continue as Guest
            </Title>
            <Paragraph style={[styles.guestText, {color: theme.colors.onSurface}]}>
              You can still use all features, but your data won't be saved across devices.
            </Paragraph>
            <View style={styles.guestStats}>
              <View style={styles.statItem}>
                <Title style={[styles.statValue, {color: theme.colors.primary}]}>
                  {stats.components}
                </Title>
                <Paragraph style={[styles.statLabel, {color: theme.colors.onSurface}]}>
                  Components
                </Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={[styles.statValue, {color: theme.colors.secondary}]}>
                  {stats.projects}
                </Title>
                <Paragraph style={[styles.statLabel, {color: theme.colors.onSurface}]}>
                  Projects
                </Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* User Profile */}
      <Surface style={[styles.headerSection, {backgroundColor: theme.colors.surface}]}>
        <View style={styles.headerContent}>
          <Avatar.Icon
            size={80}
            icon="person"
            style={[styles.avatar, {backgroundColor: theme.colors.primary}]}
          />
          <Title style={[styles.headerTitle, {color: theme.colors.text}]}>
            {user?.name}
          </Title>
          <Paragraph style={[styles.headerSubtitle, {color: theme.colors.onSurface}]}>
            {user?.email}
          </Paragraph>
        </View>
      </Surface>

      {/* Stats */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Your Progress
          </Title>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Title style={[styles.statValue, {color: theme.colors.primary}]}>
                {stats.components}
              </Title>
              <Paragraph style={[styles.statLabel, {color: theme.colors.onSurface}]}>
                Components Selected
              </Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={[styles.statValue, {color: theme.colors.secondary}]}>
                {stats.projects}
              </Title>
              <Paragraph style={[styles.statLabel, {color: theme.colors.onSurface}]}>
                Projects Saved
              </Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={[styles.statValue, {color: '#10b981'}]}>
                {stats.completed}
              </Title>
              <Paragraph style={[styles.statLabel, {color: theme.colors.onSurface}]}>
                Completed
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Settings
          </Title>
          
          <List.Item
            title="Clear Component Inventory"
            description="Remove all selected components"
            left={(props) => <List.Icon {...props} icon="delete-outline" />}
            onPress={handleClearData}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.onSurface}}
          />
          
          <Divider style={styles.divider} />
          
          <List.Item
            title="App Info"
            description="Version 1.0.0"
            left={(props) => <List.Icon {...props} icon="info-outline" />}
            titleStyle={{color: theme.colors.text}}
            descriptionStyle={{color: theme.colors.onSurface}}
          />
        </Card.Content>
      </Card>

      {/* Logout */}
      <Card style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={[styles.logoutButton, {borderColor: theme.colors.error}]}
            contentStyle={styles.buttonContent}
            textColor={theme.colors.error}>
            <Icon name="logout" size={16} />
            {' Sign Out'}
          </Button>
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
  avatar: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
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
  authButtons: {
    gap: 12,
  },
  authButton: {
    marginBottom: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  authActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
  },
  switchAuthButton: {
    marginTop: 16,
  },
  guestText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  guestStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statsGrid: {
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
    textAlign: 'center',
  },
  divider: {
    marginVertical: 8,
  },
  logoutButton: {
    marginTop: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default ProfileScreen;