import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace with your actual backend URL
const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:8001' // Android emulator
  : 'https://your-production-api.com';

export interface ComponentSpec {
  [key: string]: string;
}

export interface Component {
  id?: string;
  name: string;
  description: string;
  category: string;
  price_range: string;
  availability: string;
  specifications?: ComponentSpec;
  created_at?: string;
  updated_at?: string;
}

export interface ComponentCreate {
  name: string;
  description: string;
  category: string;
  price_range: string;
  specifications?: {[key: string]: string};
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: 'lt-2h' | '2-5h' | '5-10h' | '10h-plus';
  components: string[];
  category: string;
  instructions: string[];
  created_at?: string;
}

export interface GenerateProjectRequest {
  skill?: string;
  categories?: string[];
  components?: string[];
  time?: string;
  notes?: string;
}

export interface Project {
  id?: string;
  title: string;
  category: string;
  tags: string[];
  difficulty: string;
  status: 'saved' | 'in-progress' | 'completed';
  dateSaved: string;
  instructions: string;
  requirements: string[];
  notes?: string;
  user_id?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Service Class
class ApiService {
  // Components
  async getComponents(category?: string, search?: string): Promise<Component[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const response = await api.get(`/api/components?${params.toString()}`);
    return response.data;
  }

  async createComponent(component: ComponentCreate): Promise<Component> {
    const response = await api.post('/api/components', component);
    return response.data;
  }

  async getComponent(id: string): Promise<Component> {
    const response = await api.get(`/api/components/${id}`);
    return response.data;
  }

  async updateComponent(id: string, component: ComponentCreate): Promise<Component> {
    const response = await api.put(`/api/components/${id}`, component);
    return response.data;
  }

  async deleteComponent(id: string): Promise<void> {
    await api.delete(`/api/components/${id}`);
  }

  // Projects
  async generateProjectIdeas(request: GenerateProjectRequest): Promise<ProjectIdea[]> {
    const response = await api.post('/api/projects/generate', request);
    return response.data;
  }

  async getProjects(userId?: string): Promise<Project[]> {
    const params = userId ? `?user_id=${userId}` : '';
    const response = await api.get(`/api/projects${params}`);
    return response.data;
  }

  async saveProject(project: Project): Promise<Project> {
    const response = await api.post('/api/projects', project);
    return response.data;
  }

  async updateProject(id: string, project: Project): Promise<Project> {
    const response = await api.put(`/api/projects/${id}`, project);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/api/projects/${id}`);
  }

  // Users
  async createUser(user: User): Promise<User> {
    const response = await api.post('/api/users', user);
    return response.data;
  }

  async getUser(id: string): Promise<User> {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;