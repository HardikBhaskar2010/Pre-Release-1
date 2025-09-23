import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar, StyleSheet} from 'react-native';
import {PaperProvider, DefaultTheme} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ComponentsScreen from './src/screens/ComponentsScreen';
import ProjectGeneratorScreen from './src/screens/ProjectGeneratorScreen';
import ProjectLibraryScreen from './src/screens/ProjectLibraryScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ComponentDetailScreen from './src/screens/ComponentDetailScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';
import AddComponentScreen from './src/screens/AddComponentScreen';

// Providers
import {AuthProvider} from './src/contexts/AuthContext';
import {ComponentProvider} from './src/contexts/ComponentContext';
import {ProjectProvider} from './src/contexts/ProjectContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    onSurface: '#e2e8f0',
    outline: '#475569',
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Components') {
            iconName = 'memory';
          } else if (route.name === 'Generator') {
            iconName = 'auto-awesome';
          } else if (route.name === 'Library') {
            iconName = 'folder';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else {
            iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{title: 'Atal Ideas'}}
      />
      <Tab.Screen 
        name="Components" 
        component={ComponentsScreen}
        options={{title: 'Components'}}
      />
      <Tab.Screen 
        name="Generator" 
        component={ProjectGeneratorScreen}
        options={{title: 'AI Generator'}}
      />
      <Tab.Screen 
        name="Library" 
        component={ProjectLibraryScreen}
        options={{title: 'My Projects'}}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <ComponentProvider>
            <ProjectProvider>
              <NavigationContainer>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={theme.colors.surface}
                />
                <Stack.Navigator
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: theme.colors.surface,
                    },
                    headerTintColor: theme.colors.text,
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}>
                  <Stack.Screen 
                    name="Main" 
                    component={TabNavigator}
                    options={{headerShown: false}}
                  />
                  <Stack.Screen 
                    name="ComponentDetail" 
                    component={ComponentDetailScreen}
                    options={{title: 'Component Details'}}
                  />
                  <Stack.Screen 
                    name="ProjectDetail" 
                    component={ProjectDetailScreen}
                    options={{title: 'Project Details'}}
                  />
                  <Stack.Screen 
                    name="AddComponent" 
                    component={AddComponentScreen}
                    options={{title: 'Add Component'}}
                  />
                </Stack.Navigator>
              </NavigationContainer>
              <Toast />
            </ProjectProvider>
          </ComponentProvider>
        </AuthProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;