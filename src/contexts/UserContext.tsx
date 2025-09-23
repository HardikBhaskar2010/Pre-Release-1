"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  price_range: string;
  availability: 'Available' | 'Partially Available' | 'Not Available';
  specifications?: { [key: string]: string };
}

interface UserPreferences {
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  selected_themes: string[];
  preferred_duration: string;
  team_size: string;
  interests: string[];
}

interface UserStats {
  ideas_generated: number;
  components_selected: number;
  projects_completed: number;
  last_active_date?: string;
}

interface UserContextType {
  userPreferences: UserPreferences | null;
  userStats: UserStats | null;
  selectedComponents: Component[];
  loading: boolean;
  updateUserPreferences: (preferences: UserPreferences) => Promise<UserPreferences>;
  updateSelectedComponents: (components: Component[]) => void;
  incrementStat: (statKey: keyof UserStats, increment?: number) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load from localStorage
      const savedPreferences = localStorage.getItem('userPreferences');
      const savedStats = localStorage.getItem('userStats');
      const savedComponents = localStorage.getItem('selectedComponents');
      
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      } else {
        const defaultPrefs: UserPreferences = {
          skill_level: 'Beginner',
          selected_themes: [],
          preferred_duration: '1-2 hours',
          team_size: 'Individual',
          interests: []
        };
        setUserPreferences(defaultPrefs);
        localStorage.setItem('userPreferences', JSON.stringify(defaultPrefs));
      }
      
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      } else {
        const defaultStats: UserStats = {
          ideas_generated: 0,
          components_selected: 0,
          projects_completed: 0
        };
        setUserStats(defaultStats);
        localStorage.setItem('userStats', JSON.stringify(defaultStats));
      }

      if (savedComponents) {
        setSelectedComponents(JSON.parse(savedComponents));
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserPreferences = async (newPreferences: UserPreferences): Promise<UserPreferences> => {
    try {
      setUserPreferences(newPreferences);
      localStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      toast.success('Preferences updated');
      return newPreferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
      throw error;
    }
  };

  const updateSelectedComponents = (components: Component[]) => {
    setSelectedComponents(components);
    localStorage.setItem('selectedComponents', JSON.stringify(components));
  };

  const incrementStat = async (statKey: keyof UserStats, increment = 1) => {
    try {
      setUserStats(prev => {
        if (!prev) return null;
        const updated = {
          ...prev,
          [statKey]: (prev[statKey] as number || 0) + increment,
          last_active_date: new Date().toISOString()
        };
        localStorage.setItem('userStats', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Error updating stat:', error);
    }
  };

  const value: UserContextType = {
    userPreferences,
    userStats,
    selectedComponents,
    loading,
    updateUserPreferences,
    updateSelectedComponents,
    incrementStat,
    refreshUserData: loadUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};