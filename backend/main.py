from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
from datetime import datetime
import uuid
import asyncio
import httpx

# Initialize FastAPI app
app = FastAPI(
    title="Atal Idea Generator API",
    description="AI-powered STEM project generator API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your React Native app URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Firebase initialization
# TODO: Replace with your Firebase service account key
FIREBASE_CONFIG = {
    # Add your Firebase service account key here
    "type": "service_account",
    "project_id": "your-project-id",
    "private_key_id": "your-private-key-id",
    "private_key": "your-private-key",
    "client_email": "your-client-email",
    "client_id": "your-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "your-client-cert-url"
}

# Initialize Firebase (only if not already initialized)
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(FIREBASE_CONFIG)
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase initialized successfully")
except Exception as e:
    print(f"Firebase initialization failed: {e}")
    print("Running in development mode without Firebase")
    db = None

# Pydantic Models
class ComponentSpec(BaseModel):
    microcontroller: Optional[str] = None
    operating_voltage: Optional[str] = None
    input_voltage: Optional[str] = None
    digital_io_pins: Optional[str] = None
    analog_input_pins: Optional[str] = None
    flash_memory: Optional[str] = None
    processor: Optional[str] = None
    frequency: Optional[str] = None
    sram: Optional[str] = None
    wifi: Optional[str] = None
    bluetooth: Optional[str] = None
    ram: Optional[str] = None
    connectivity: Optional[str] = None
    usb_ports: Optional[str] = None
    hdmi: Optional[str] = None
    measuring_range: Optional[str] = None
    measuring_angle: Optional[str] = None
    trigger_pulse: Optional[str] = None
    echo_pulse: Optional[str] = None
    temperature_range: Optional[str] = None
    humidity_range: Optional[str] = None
    accuracy_temperature: Optional[str] = None
    accuracy_humidity: Optional[str] = None
    torque: Optional[str] = None
    speed: Optional[str] = None
    rotation: Optional[str] = None
    weight: Optional[str] = None
    power_consumption: Optional[str] = None
    color_depth: Optional[str] = None
    data_transmission: Optional[str] = None
    pixels_per_meter: Optional[str] = None
    trigger_current: Optional[str] = None
    contact_voltage: Optional[str] = None
    contact_type: Optional[str] = None
    response_time: Optional[str] = None
    size: Optional[str] = None
    resolution: Optional[str] = None
    interface: Optional[str] = None
    colors: Optional[str] = None
    detection_range: Optional[str] = None
    detection_angle: Optional[str] = None
    delay_time: Optional[str] = None
    block_time: Optional[str] = None
    current: Optional[str] = None
    sound_level: Optional[str] = None
    step_angle: Optional[str] = None
    steps_per_revolution: Optional[str] = None
    gear_ratio: Optional[str] = None
    resistance_light: Optional[str] = None
    resistance_dark: Optional[str] = None
    peak_wavelength: Optional[str] = None
    probe_length: Optional[str] = None

class Component(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    category: str
    price_range: str
    availability: str = "Available"
    specifications: Optional[ComponentSpec] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ComponentCreate(BaseModel):
    name: str
    description: str
    category: str
    price_range: str
    specifications: Optional[Dict[str, str]] = None

class ProjectIdea(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    difficulty: str  # beginner, intermediate, advanced
    estimatedTime: str  # lt-2h, 2-5h, 5-10h, 10h-plus
    components: List[str]
    category: str
    instructions: List[str]
    created_at: Optional[datetime] = None

class GenerateProjectRequest(BaseModel):
    skill: Optional[str] = "beginner"
    categories: Optional[List[str]] = []
    components: Optional[List[str]] = []
    time: Optional[str] = "2-5h"
    notes: Optional[str] = ""

class Project(BaseModel):
    id: Optional[str] = None
    title: str
    category: str
    tags: List[str]
    difficulty: str
    status: str  # saved, in-progress, completed
    dateSaved: str
    instructions: str
    requirements: List[str]
    notes: Optional[str] = ""
    user_id: Optional[str] = None

class User(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None

# Default components data
DEFAULT_COMPONENTS = [
    {
        "id": "arduino-uno",
        "name": "Arduino Uno R3",
        "description": "A microcontroller board based on the ATmega328P. Perfect for beginners and prototyping.",
        "category": "Microcontrollers",
        "price_range": "$20-30",
        "availability": "Available",
        "specifications": {
            "microcontroller": "ATmega328P",
            "operating_voltage": "5V",
            "input_voltage": "7-12V",
            "digital_io_pins": "14",
            "analog_input_pins": "6",
            "flash_memory": "32KB"
        }
    },
    {
        "id": "esp32",
        "name": "ESP32 DevKit",
        "description": "Wi-Fi and Bluetooth enabled microcontroller with dual-core processor.",
        "category": "Microcontrollers",
        "price_range": "$15-25",
        "availability": "Available",
        "specifications": {
            "processor": "Dual-core Tensilica LX6",
            "frequency": "240MHz",
            "flash_memory": "4MB",
            "sram": "520KB",
            "wifi": "802.11 b/g/n",
            "bluetooth": "v4.2 BR/EDR and BLE"
        }
    },
    {
        "id": "hc-sr04",
        "name": "HC-SR04 Ultrasonic Sensor",
        "description": "Ultrasonic distance sensor with 2-400cm measurement range.",
        "category": "Sensors",
        "price_range": "$2-5",
        "availability": "Available",
        "specifications": {
            "operating_voltage": "5V",
            "measuring_range": "2cm - 4m",
            "measuring_angle": "15°",
            "trigger_pulse": "10µs TTL pulse",
            "echo_pulse": "Proportional to distance"
        }
    },
    {
        "id": "dht22",
        "name": "DHT22 Temperature & Humidity Sensor",
        "description": "Digital sensor for measuring temperature and humidity with high accuracy.",
        "category": "Sensors",
        "price_range": "$5-10",
        "availability": "Available",
        "specifications": {
            "operating_voltage": "3.3-6V",
            "temperature_range": "-40°C to 80°C",
            "humidity_range": "0-100% RH",
            "accuracy_temperature": "±0.5°C",
            "accuracy_humidity": "±2-5% RH"
        }
    }
]

# Helper Functions
async def initialize_default_data():
    """Initialize default components if collection is empty"""
    try:
        if db is None:
            print("Firebase not initialized, skipping default data initialization")
            return
            
        components_ref = db.collection('components')
        docs = components_ref.limit(1).stream()
        
        # Check if collection is empty
        if not any(docs):
            print("Initializing default components...")
            for comp_data in DEFAULT_COMPONENTS:
                comp_data['created_at'] = datetime.now()
                comp_data['updated_at'] = datetime.now()
                components_ref.document(comp_data['id']).set(comp_data)
            print(f"Added {len(DEFAULT_COMPONENTS)} default components")
    except Exception as e:
        print(f"Error initializing default data: {e}")

# API Endpoints

@app.on_event("startup")
async def startup_event():
    await initialize_default_data()

@app.get("/")
async def root():
    return {"message": "Atal Idea Generator API", "version": "1.0.0"}

@app.get("/api/components", response_model=List[Component])
async def get_components(
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: Optional[int] = 100
):
    """Get all components with optional filtering"""
    try:
        if db is None:
            # Return default components when Firebase is not available
            components = DEFAULT_COMPONENTS.copy()
        else:
            components_ref = db.collection('components')
            query = components_ref.limit(limit)
            
            # Apply category filter
            if category and category.lower() != 'all':
                query = query.where('category', '==', category)
            
            docs = query.stream()
            components = []
            
            for doc in docs:
                data = doc.to_dict()
                data['id'] = doc.id
                components.append(data)
        
        # Apply search filter
        if search:
            search_term = search.lower()
            filtered_components = []
            for comp in components:
                if (search_term in comp['name'].lower() or 
                    search_term in comp['description'].lower() or 
                    search_term in comp['category'].lower()):
                    filtered_components.append(comp)
            components = filtered_components
        
        return components
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch components: {str(e)}")

@app.post("/api/components", response_model=Component)
async def create_component(component: ComponentCreate):
    """Create a new component"""
    try:
        component_id = str(uuid.uuid4())
        component_data = component.dict()
        component_data.update({
            'id': component_id,
            'availability': 'Available',
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        })
        
        db.collection('components').document(component_id).set(component_data)
        return component_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create component: {str(e)}")

@app.get("/api/components/{component_id}", response_model=Component)
async def get_component(component_id: str):
    """Get a specific component by ID"""
    try:
        doc = db.collection('components').document(component_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Component not found")
        
        data = doc.to_dict()
        data['id'] = doc.id
        return data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to fetch component: {str(e)}")

@app.put("/api/components/{component_id}", response_model=Component)
async def update_component(component_id: str, component: ComponentCreate):
    """Update a component"""
    try:
        doc_ref = db.collection('components').document(component_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Component not found")
        
        component_data = component.dict()
        component_data['updated_at'] = datetime.now()
        
        doc_ref.update(component_data)
        
        # Return updated component
        updated_doc = doc_ref.get()
        data = updated_doc.to_dict()
        data['id'] = updated_doc.id
        return data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to update component: {str(e)}")

@app.delete("/api/components/{component_id}")
async def delete_component(component_id: str):
    """Delete a component"""
    try:
        doc_ref = db.collection('components').document(component_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Component not found")
        
        doc_ref.delete()
        return {"message": "Component deleted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to delete component: {str(e)}")

@app.post("/api/projects/generate", response_model=List[ProjectIdea])
async def generate_project_ideas(request: GenerateProjectRequest):
    """Generate AI project ideas based on user preferences"""
    try:
        # Mock AI generation for now - replace with actual AI service
        await asyncio.sleep(0.5)  # Simulate API delay
        
        components = request.components or ["ESP32", "DHT22", "Servo Motor"]
        categories = request.categories or ["IoT", "Automation", "Environmental"]
        difficulty = request.skill or "beginner"
        time = request.time or "2-5h"
        
        # Generate mock ideas
        ideas = [
            {
                "id": str(uuid.uuid4()),
                "title": "Smart Home Air Quality Monitor",
                "description": "Build a connected monitor that tracks temperature and humidity, displays status, and sends alerts when thresholds are exceeded.",
                "difficulty": difficulty,
                "estimatedTime": time,
                "components": components + ["OLED Display"],
                "category": categories[0] if categories else "IoT",
                "instructions": [
                    "Wire the sensor to the microcontroller and verify readings via serial monitor.",
                    "Display live metrics on the OLED with color-coded thresholds.",
                    "Push readings to a cloud endpoint and configure alert rules.",
                    "Enclose the device and test in different rooms."
                ],
                "created_at": datetime.now()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Automated Plant Watering System",
                "description": "Create a soil-moisture-based watering setup that irrigates plants automatically and logs activity.",
                "difficulty": difficulty,
                "estimatedTime": time,
                "components": components + ["Soil Moisture Sensor", "Relay Module", "Pump"],
                "category": "Automation",
                "instructions": [
                    "Calibrate the moisture sensor to determine dry thresholds.",
                    "Control a pump using a relay and implement safety delays.",
                    "Log watering events and moisture trends for analysis.",
                    "Add a manual override and status LED."
                ],
                "created_at": datetime.now()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Obstacle-Avoiding Robot",
                "description": "Assemble a simple robot that navigates autonomously by detecting obstacles and adjusting its path.",
                "difficulty": difficulty,
                "estimatedTime": time,
                "components": components + ["Ultrasonic Sensor", "Motor Driver"],
                "category": "Robotics",
                "instructions": [
                    "Mount motors and connect the driver to the controller.",
                    "Integrate the ultrasonic sensor and read distance values.",
                    "Implement basic avoidance logic with turn-and-forward behavior.",
                    "Tune speed and sensitivity; test in a small course."
                ],
                "created_at": datetime.now()
            }
        ]
        
        return ideas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate project ideas: {str(e)}")

@app.get("/api/projects", response_model=List[Project])
async def get_projects(user_id: Optional[str] = None):
    """Get all saved projects for a user"""
    try:
        projects_ref = db.collection('projects')
        
        if user_id:
            query = projects_ref.where('user_id', '==', user_id)
        else:
            query = projects_ref
        
        docs = query.stream()
        projects = []
        
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id
            projects.append(data)
        
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")

@app.post("/api/projects", response_model=Project)
async def save_project(project: Project):
    """Save a new project"""
    try:
        project_id = str(uuid.uuid4())
        project_data = project.dict()
        project_data.update({
            'id': project_id,
            'dateSaved': datetime.now().isoformat()
        })
        
        db.collection('projects').document(project_id).set(project_data)
        return project_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save project: {str(e)}")

@app.put("/api/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project: Project):
    """Update a project"""
    try:
        doc_ref = db.collection('projects').document(project_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        
        project_data = project.dict()
        doc_ref.update(project_data)
        
        # Return updated project
        updated_doc = doc_ref.get()
        data = updated_doc.to_dict()
        data['id'] = updated_doc.id
        return data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to update project: {str(e)}")

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    """Delete a project"""
    try:
        doc_ref = db.collection('projects').document(project_id)
        doc = doc_ref.get()
        
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Project not found")
        
        doc_ref.delete()
        return {"message": "Project deleted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")

@app.post("/api/users", response_model=User)
async def create_user(user: User):
    """Create a new user"""
    try:
        user_id = str(uuid.uuid4())
        user_data = user.dict()
        user_data.update({
            'id': user_id,
            'created_at': datetime.now()
        })
        
        db.collection('users').document(user_id).set(user_data)
        return user_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

@app.get("/api/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user by ID"""
    try:
        doc = db.collection('users').document(user_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        data = doc.to_dict()
        data['id'] = doc.id
        return data
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to fetch user: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)