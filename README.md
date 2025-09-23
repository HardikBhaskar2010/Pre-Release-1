# 🚀 Atal Idea Generator - React Native

> **Transform your electronic components into amazing STEM projects with AI-powered suggestions!** ⚡

![React Native](https://img.shields.io/badge/React%20Native-0.72.7-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green?style=for-the-badge&logo=fastapi)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange?style=for-the-badge&logo=firebase)
![TypeScript](https://img.shields.io/badge/TypeScript-4.8.4-blue?style=for-the-badge&logo=typescript)

## ✨ What is Atal Idea Generator?

Atal Idea Generator is a **React Native mobile app** with **FastAPI backend** that helps students, educators, and makers turn their electronic components into buildable, educational projects. No more staring at a box of components wondering "what can I build?" 🤔

### 🎯 Key Features

| Feature | Description | Status |
|---------|-------------|---------|
| 📱 **React Native App** | Cross-platform mobile app for iOS and Android | ✅ Active |
| 🔍 **Component Database** | Browse 500+ electronic components with detailed specs | ✅ Active |
| 🤖 **AI Project Generator** | Get personalized project ideas based on your components | ✅ Active |
| 📚 **Project Library** | Save, organize, and track your project ideas | ✅ Active |
| 🔥 **Firebase Integration** | Real-time data storage and synchronization | ✅ Active |
| ➕ **Component Addition** | Add new components to the database | ✅ Active |
| 🚀 **FastAPI Backend** | High-performance Python backend with automatic API docs | ✅ Active |

## 🏗️ Architecture

```
Atal Idea Generator/
├── 📱 React Native Frontend (Mobile App)
│   ├── 🎨 React Native Paper UI
│   ├── 🧭 React Navigation
│   ├── 🔄 TanStack Query for API calls
│   └── 🔥 Firebase Client SDK
├── ⚡ FastAPI Backend
│   ├── 🐍 Python FastAPI server
│   ├── 🔥 Firebase Admin SDK
│   ├── 📊 Automatic API documentation
│   └── 🤖 AI project generation
└── 🔥 Firebase Database
    ├── 📦 Components collection
    ├── 📝 Projects collection
    └── 👥 Users collection
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- React Native development environment
- Firebase project
- Git

### 🔧 Setup Instructions

#### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/atal-idea-generator-rn.git
cd atal-idea-generator-rn

# Install React Native dependencies
yarn install

# Install Python dependencies for backend
cd backend
pip install -r requirements.txt
cd ..
```

#### 2. Firebase Configuration

**IMPORTANT**: You need to configure Firebase for the app to work.

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database
3. Create a service account and download the JSON key
4. Update configuration files:

**Backend Firebase Config** (`/backend/main.py`):
```python
# Replace this section in main.py with your Firebase service account
FIREBASE_CONFIG = {
    "type": "service_account",
    "project_id": "YOUR_PROJECT_ID",
    "private_key_id": "YOUR_PRIVATE_KEY_ID",
    "private_key": "YOUR_PRIVATE_KEY",
    "client_email": "YOUR_CLIENT_EMAIL",
    "client_id": "YOUR_CLIENT_ID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "YOUR_CLIENT_CERT_URL"
}
```

**Frontend Firebase Config** (`/src/services/firebase.ts`):
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

#### 3. Start the Backend

```bash
# Start FastAPI backend
yarn backend

# Or manually:
# cd backend && uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

Backend will be available at:
- API: http://localhost:8001
- Auto-generated docs: http://localhost:8001/docs
- Redoc: http://localhost:8001/redoc

#### 4. Start the Mobile App

```bash
# Start Metro bundler
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

## 📱 App Structure

### Core Screens
- **🏠 Home**: Dashboard with stats and quick actions
- **🔧 Components**: Browse and manage electronic components
- **🤖 Generator**: AI-powered project idea generation
- **📚 Library**: Saved projects with status tracking
- **👤 Profile**: User authentication and settings

### Key Features

#### 🔍 Component Database
- Browse 500+ electronic components
- Detailed specifications and pricing
- Category filtering and search
- Add components to project inventory
- Contribute new components to database

#### 🤖 AI Project Generator
- Select your available components
- Choose skill level and time commitment
- Pick project categories of interest
- Get personalized project ideas with:
  - Step-by-step instructions
  - Required components list
  - Difficulty assessment
  - Time estimates

#### 📚 Project Library
- Save interesting project ideas
- Track project status (Saved → In Progress → Completed)
- Add personal notes and modifications
- Filter and sort projects
- Export project details

## 🛠️ API Endpoints

The FastAPI backend provides a comprehensive REST API:

### Components API
```bash
GET    /api/components          # List all components
POST   /api/components          # Add new component
GET    /api/components/{id}      # Get specific component
PUT    /api/components/{id}      # Update component
DELETE /api/components/{id}      # Remove component
```

### Projects API  
```bash
POST   /api/projects/generate   # Generate project ideas
GET    /api/projects           # List saved projects
POST   /api/projects           # Save new project
PUT    /api/projects/{id}       # Update project
DELETE /api/projects/{id}       # Delete project
```

### Users API
```bash
POST   /api/users              # Create user
GET    /api/users/{id}          # Get user profile
```

Visit http://localhost:8001/docs for interactive API documentation.

## 🎨 Technology Stack

### Frontend (React Native)
- **React Native 0.72.7**: Cross-platform mobile framework
- **React Navigation 6**: Navigation library
- **React Native Paper 5**: Material Design components
- **TanStack Query 5**: Server state management
- **Firebase 10**: Authentication and database
- **TypeScript**: Type safety
- **Vector Icons**: Beautiful icons

### Backend (Python)
- **FastAPI 0.104.1**: Modern, fast web framework
- **Firebase Admin SDK**: Server-side Firebase integration
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server

### Database
- **Firebase Firestore**: NoSQL document database
- **Firebase Auth**: User authentication
- **Real-time sync**: Automatic data synchronization

## 🔥 Firebase Collections Structure

### Components Collection
```json
{
  "id": "arduino-uno",
  "name": "Arduino Uno R3",
  "description": "A microcontroller board...",
  "category": "Microcontrollers",
  "price_range": "$20-30",
  "availability": "Available",
  "specifications": {
    "microcontroller": "ATmega328P",
    "operating_voltage": "5V",
    // ... more specs
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Projects Collection
```json
{
  "id": "project-123",
  "title": "Smart Plant Watering System",
  "category": "IoT",
  "difficulty": "intermediate",
  "status": "in-progress",
  "instructions": "Step by step guide...",
  "requirements": ["Arduino Uno", "Soil Sensor", "Pump"],
  "tags": ["arduino", "plants", "automation"],
  "notes": "User's personal notes...",
  "dateSaved": "2024-01-01T00:00:00Z",
  "user_id": "user123"
}
```

## 🚀 Deployment

### Backend Deployment
The FastAPI backend can be deployed to:
- **Heroku**: Easy deployment with Procfile
- **Railway**: Modern deployment platform
- **DigitalOcean App Platform**: Container deployment
- **AWS/GCP/Azure**: Cloud platform deployment

### Mobile App Deployment
- **Expo**: Easy deployment to app stores
- **React Native CLI**: Native deployment
- **CodePush**: Over-the-air updates

## 🤝 Contributing

We love contributions! Here's how you can help:

### 🐛 Report Bugs
Found a bug? [Open an issue](https://github.com/your-username/atal-idea-generator-rn/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable

### ✨ Suggest Features
Have an idea? [Create a feature request](https://github.com/your-username/atal-idea-generator-rn/issues) describing:
- The problem you're solving
- Your proposed solution
- How it would help other users

### 🛠️ Submit Code
Ready to code? Here's our workflow:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📚 Add Components
Help expand our component database:
1. Use the "Add Component" feature in the app
2. Fill in detailed specifications
3. Test that it appears in searches
4. Submit a PR with any additional metadata

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support & Community

- 📧 **Email**: support@atal-idea-generator.com
- 💬 **Discord**: Join our [community server](https://discord.gg/atal-ideas)  
- 🐦 **Twitter**: [@AtalIdeaGen](https://twitter.com/AtalIdeaGen)
- 📖 **Documentation**: [Full docs available here](https://docs.atal-idea-generator.com)

## 🏆 Recognition

Special thanks to all contributors who make this project possible:

- **Students & Educators**: For testing and feedback
- **Open Source Community**: For the amazing tools and libraries
- **STEM Enthusiasts**: For sharing project ideas and improvements
- **React Native Community**: For the incredible ecosystem

---

<div align="center">

**Made with ❤️ for the STEM community**

*Turn your components into creations!* 🚀

[⭐ Star this repo](https://github.com/your-username/atal-idea-generator-rn/stargazers) | [🍴 Fork it](https://github.com/your-username/atal-idea-generator-rn/fork) | [📖 Documentation](https://docs.atal-idea-generator.com)

</div>