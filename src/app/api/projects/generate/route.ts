import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  skill?: 'beginner' | 'intermediate' | 'advanced';
  categories?: string[];
  components?: string[];
  time?: 'lt-2h' | '2-5h' | '5-10h' | '10h-plus';
  notes?: string;
}

interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: 'lt-2h' | '2-5h' | '5-10h' | '10h-plus';
  components: string[];
  category: string;
  instructions: string[];
}

// Comprehensive predefined project ideas database
const PROJECT_IDEAS: ProjectIdea[] = [
  // IoT Projects
  {
    id: 'iot-1',
    title: 'Smart Home Climate Control',
    description: 'Monitor and control temperature and humidity in your home with automated responses and mobile notifications.',
    difficulty: 'intermediate',
    estimatedTime: '5-10h',
    components: ['ESP32', 'DHT22', 'Relay Module', 'OLED Display'],
    category: 'IoT',
    instructions: [
      'Set up ESP32 with Wi-Fi connectivity',
      'Connect DHT22 sensor for temperature and humidity readings',
      'Add OLED display for local status monitoring',
      'Implement relay control for fans or heaters',
      'Create web interface for remote monitoring',
      'Add automated climate control logic',
      'Set up push notifications for extreme conditions'
    ]
  },
  {
    id: 'iot-2',
    title: 'Smart Door Lock System',
    description: 'Build a keyless entry system with RFID access control and mobile app integration.',
    difficulty: 'advanced',
    estimatedTime: '10h-plus',
    components: ['ESP32', 'RFID Reader', 'Servo Motor', 'Buzzer', 'OLED Display'],
    category: 'IoT',
    instructions: [
      'Connect RFID reader to ESP32 for card authentication',
      'Set up servo motor for lock mechanism',
      'Program user management system with RFID cards',
      'Add buzzer for audio feedback and alerts',
      'Create web dashboard for access log monitoring',
      'Implement mobile app control via Wi-Fi',
      'Add backup keypad entry option',
      'Set up encrypted communication protocols'
    ]
  },
  {
    id: 'iot-3',
    title: 'Smart Garden Monitoring',
    description: 'Automated plant care system with soil moisture sensing, watering, and growth tracking.',
    difficulty: 'intermediate',
    estimatedTime: '5-10h',
    components: ['ESP32', 'Soil Moisture Sensor', 'Relay Module', 'DHT22', 'LDR Sensor'],
    category: 'IoT',
    instructions: [
      'Install soil moisture sensors in plant containers',
      'Set up automated watering system with pump and relay',
      'Add environmental monitoring with DHT22 and LDR',
      'Create plant growth database with timestamp logging',
      'Implement smart watering schedule based on plant type',
      'Add web dashboard for multiple plant monitoring',
      'Set up mobile alerts for plant care reminders'
    ]
  },

  // Robotics Projects
  {
    id: 'robotics-1',
    title: 'Obstacle Avoiding Robot Car',
    description: 'Build an autonomous robot that navigates around obstacles using ultrasonic sensors.',
    difficulty: 'beginner',
    estimatedTime: '2-5h',
    components: ['Arduino Uno', 'HC-SR04', 'Servo Motor', 'Motor Driver', 'Buzzer'],
    category: 'Robotics',
    instructions: [
      'Assemble robot chassis with motors and wheels',
      'Connect motor driver to Arduino for wheel control',
      'Mount HC-SR04 sensor on servo for 180° scanning',
      'Program basic forward movement and turning logic',
      'Implement obstacle detection and avoidance algorithm',
      'Add buzzer alerts for obstacle detection',
      'Test and tune sensor sensitivity and movement speed'
    ]
  },
  {
    id: 'robotics-2',
    title: 'Line Following Robot',
    description: 'Create a robot that follows a black line using infrared sensors with speed optimization.',
    difficulty: 'intermediate',
    estimatedTime: '5-10h',
    components: ['Arduino Uno', 'IR Sensors', 'Motor Driver', 'Stepper Motor', 'OLED Display'],
    category: 'Robotics',
    instructions: [
      'Install array of IR sensors for line detection',
      'Program PID control algorithm for smooth following',
      'Implement variable speed control for curves',
      'Add display showing sensor readings and speed',
      'Create line intersection detection and handling',
      'Add start/stop functionality with button control',
      'Optimize performance for different line widths and surfaces'
    ]
  },
  {
    id: 'robotics-3',
    title: 'Voice Controlled Robot Assistant',
    description: 'Build a robot that responds to voice commands for movement and basic tasks.',
    difficulty: 'advanced',
    estimatedTime: '10h-plus',
    components: ['Raspberry Pi 4', 'Microphone', 'Speaker', 'Camera Module', 'Servo Motors'],
    category: 'Robotics',
    instructions: [
      'Set up Raspberry Pi with voice recognition software',
      'Connect microphone and speaker for audio interaction',
      'Program natural language processing for commands',
      'Add camera for basic computer vision capabilities',
      'Implement servo control for arm or head movement',
      'Create personality responses and conversation flow',
      'Add object recognition and interaction capabilities',
      'Integrate with smart home devices for expanded control'
    ]
  },

  // Home Automation Projects
  {
    id: 'home-1',
    title: 'Smart Lighting System',
    description: 'Automated lighting with motion detection, brightness control, and scheduled operation.',
    difficulty: 'beginner',
    estimatedTime: '2-5h',
    components: ['ESP32', 'PIR Motion Sensor', 'LDR Sensor', 'LED Strip', 'Relay Module'],
    category: 'Automation',
    instructions: [
      'Connect PIR sensor for motion-triggered lighting',
      'Add LDR sensor for automatic brightness adjustment',
      'Set up LED strip or relay-controlled lights',
      'Program motion detection with timeout functionality',
      'Implement sunrise/sunset scheduling',
      'Add manual override via mobile app',
      'Create energy usage monitoring and reporting'
    ]
  },
  {
    id: 'home-2',
    title: 'Smart Security System',
    description: 'Comprehensive home security with multiple sensors, alerts, and remote monitoring.',
    difficulty: 'advanced',
    estimatedTime: '10h-plus',
    components: ['ESP32', 'PIR Sensor', 'Door Sensor', 'Camera Module', 'Buzzer', 'OLED Display'],
    category: 'Automation',
    instructions: [
      'Install PIR sensors in multiple rooms for motion detection',
      'Add magnetic door/window sensors for entry monitoring',
      'Set up camera module for security footage recording',
      'Create central control panel with OLED display',
      'Program armed/disarmed modes with PIN access',
      'Implement real-time alerts via SMS and email',
      'Add mobile app for remote monitoring and control',
      'Create event logging with timestamp and location data'
    ]
  },

  // Environmental Projects
  {
    id: 'env-1',
    title: 'Air Quality Monitor',
    description: 'Monitor indoor air quality with multiple sensors and create health recommendations.',
    difficulty: 'intermediate',
    estimatedTime: '5-10h',
    components: ['ESP32', 'MQ-2 Gas Sensor', 'DHT22', 'OLED Display', 'Buzzer'],
    category: 'Environmental',
    instructions: [
      'Connect MQ-2 sensor for gas and smoke detection',
      'Add DHT22 for temperature and humidity monitoring',
      'Set up OLED display for real-time air quality readings',
      'Program air quality index calculation',
      'Add buzzer alerts for dangerous gas levels',
      'Create historical data logging and trends',
      'Implement recommendations for air quality improvement',
      'Add web dashboard for remote monitoring'
    ]
  },
  {
    id: 'env-2',
    title: 'Weather Station',
    description: 'Complete weather monitoring station with multiple environmental sensors.',
    difficulty: 'intermediate',
    estimatedTime: '5-10h',
    components: ['ESP32', 'DHT22', 'LDR Sensor', 'Rain Sensor', 'OLED Display'],
    category: 'Environmental',
    instructions: [
      'Set up DHT22 for temperature and humidity readings',
      'Add LDR sensor for light intensity measurement',
      'Install rain sensor for precipitation detection',
      'Create comprehensive weather display on OLED',
      'Program weather data logging with timestamps',
      'Add weather trend analysis and predictions',
      'Implement data upload to weather services',
      'Create weather alerts for extreme conditions'
    ]
  },

  // Beginner Projects
  {
    id: 'beginner-1',
    title: 'LED Traffic Light System',
    description: 'Simple traffic light simulator with pedestrian crossing and timing controls.',
    difficulty: 'beginner',
    estimatedTime: 'lt-2h',
    components: ['Arduino Uno', 'LED Strip', 'Push Button', 'Buzzer'],
    category: 'Automation',
    instructions: [
      'Connect red, yellow, and green LEDs to Arduino',
      'Program basic traffic light sequence timing',
      'Add push button for pedestrian crossing request',
      'Implement pedestrian crossing cycle with walk signal',
      'Add buzzer for audio pedestrian signals',
      'Create emergency mode for all-red operation',
      'Test timing sequences and adjust for realism'
    ]
  },
  {
    id: 'beginner-2',
    title: 'Temperature Alarm System',
    description: 'Simple temperature monitor with LED indicators and buzzer alerts.',
    difficulty: 'beginner',
    estimatedTime: 'lt-2h',
    components: ['Arduino Uno', 'DHT22', 'LED Strip', 'Buzzer', 'OLED Display'],
    category: 'Environmental',
    instructions: [
      'Connect DHT22 sensor for temperature readings',
      'Set up LED indicators for temperature ranges',
      'Program buzzer alerts for extreme temperatures',
      'Add OLED display for current temperature reading',
      'Create configurable temperature thresholds',
      'Implement visual and audio alarm combinations',
      'Test system with hot and cold temperature sources'
    ]
  },
  {
    id: 'beginner-3',
    title: 'Plant Watering Reminder',
    description: 'Soil moisture monitor that reminds you when plants need watering.',
    difficulty: 'beginner',
    estimatedTime: '2-5h',
    components: ['Arduino Uno', 'Soil Moisture Sensor', 'OLED Display', 'Buzzer', 'LED Strip'],
    category: 'Environmental',
    instructions: [
      'Insert soil moisture sensor into plant soil',
      'Connect sensor to Arduino for moisture readings',
      'Set up OLED display to show moisture percentage',
      'Program LED color coding for moisture levels',
      'Add buzzer alerts when watering is needed',
      'Create different thresholds for different plant types',
      'Test calibration with dry and wet soil conditions'
    ]
  },

  // Advanced Projects
  {
    id: 'advanced-1',
    title: 'AI-Powered Face Recognition Door Lock',
    description: 'Advanced security system using facial recognition for access control.',
    difficulty: 'advanced',
    estimatedTime: '10h-plus',
    components: ['Raspberry Pi 4', 'Camera Module', 'Servo Motor', 'OLED Display', 'Speaker'],
    category: 'AI/ML',
    instructions: [
      'Set up Raspberry Pi with OpenCV and face recognition libraries',
      'Train face recognition model with authorized user photos',
      'Implement real-time face detection and recognition',
      'Add servo motor control for lock mechanism',
      'Create user enrollment system with photo capture',
      'Add voice feedback for recognition status',
      'Implement security features like liveness detection',
      'Create access log with photo evidence and timestamps',
      'Add mobile notifications for access attempts'
    ]
  },
  {
    id: 'advanced-2',
    title: 'Smart Mirror with AI Assistant',
    description: 'Interactive mirror displaying weather, news, calendar, and voice control.',
    difficulty: 'advanced',
    estimatedTime: '10h-plus',
    components: ['Raspberry Pi 4', 'Two-Way Mirror', 'Display Screen', 'Microphone', 'Speaker'],
    category: 'AI/ML',
    instructions: [
      'Set up two-way mirror with embedded display system',
      'Install Raspberry Pi with voice recognition capabilities',
      'Create widget system for weather, news, calendar display',
      'Implement natural language processing for voice commands',
      'Add facial recognition for personalized information',
      'Create gesture control for touchless interaction',
      'Add smart home integration for device control',
      'Implement always-on wake word detection',
      'Create customizable dashboard layouts'
    ]
  },

  // Energy Projects
  {
    id: 'energy-1',
    title: 'Solar Power Monitor',
    description: 'Monitor solar panel efficiency and battery status with data logging.',
    difficulty: 'intermediate',
    estimatedTime: '5-10h',
    components: ['ESP32', 'Current Sensor', 'Voltage Sensor', 'OLED Display', 'MicroSD Card'],
    category: 'Energy',
    instructions: [
      'Connect current and voltage sensors to monitor solar output',
      'Set up battery voltage monitoring system',
      'Create power calculation algorithms for efficiency tracking',
      'Add OLED display for real-time power readings',
      'Implement data logging to SD card with timestamps',
      'Create web dashboard for historical power data',
      'Add efficiency analysis and optimization suggestions',
      'Implement alerts for system maintenance needs'
    ]
  },
  {
    id: 'energy-2',
    title: 'Smart Power Strip',
    description: 'Intelligent power strip with individual outlet control and energy monitoring.',
    difficulty: 'advanced',
    estimatedTime: '10h-plus',
    components: ['ESP32', 'Relay Modules', 'Current Sensors', 'OLED Display', 'Push Buttons'],
    category: 'Energy',
    instructions: [
      'Wire multiple relay modules for individual outlet control',
      'Add current sensors for per-outlet power monitoring',
      'Create OLED interface for outlet status and power readings',
      'Program manual control buttons for each outlet',
      'Implement Wi-Fi control via mobile app',
      'Add scheduling functionality for automated control',
      'Create energy usage reports and cost calculations',
      'Implement over-current protection and safety shutoffs'
    ]
  }
];

// Helper function to match components to projects
function matchProjects(request: GenerateRequest): ProjectIdea[] {
  let matchedProjects = [...PROJECT_IDEAS];
  
  // Filter by skill level
  if (request.skill) {
    matchedProjects = matchedProjects.filter(project => 
      project.difficulty === request.skill ||
      (request.skill === 'beginner' && project.difficulty === 'intermediate') ||
      (request.skill === 'advanced' && project.difficulty === 'intermediate')
    );
  }
  
  // Filter by time commitment
  if (request.time) {
    matchedProjects = matchedProjects.filter(project => 
      project.estimatedTime === request.time ||
      (request.time === '10h-plus' && project.estimatedTime === '5-10h')
    );
  }
  
  // Filter by categories
  if (request.categories && request.categories.length > 0) {
    matchedProjects = matchedProjects.filter(project =>
      request.categories!.some(cat => 
        project.category.toLowerCase().includes(cat.toLowerCase())
      )
    );
  }
  
  // Score projects based on component matches
  if (request.components && request.components.length > 0) {
    matchedProjects = matchedProjects.map(project => {
      const componentMatches = request.components!.filter(requestedComp =>
        project.components.some(projectComp =>
          projectComp.toLowerCase().includes(requestedComp.toLowerCase()) ||
          requestedComp.toLowerCase().includes(projectComp.toLowerCase())
        )
      ).length;
      
      return {
        ...project,
        matchScore: componentMatches / Math.max(request.components!.length, project.components.length)
      };
    }).filter((project: any) => project.matchScore > 0)
      .sort((a: any, b: any) => b.matchScore - a.matchScore);
  }
  
  // Consider notes for additional filtering
  if (request.notes && request.notes.trim()) {
    const keywords = request.notes.toLowerCase().split(' ');
    matchedProjects = matchedProjects.filter(project =>
      keywords.some(keyword =>
        project.title.toLowerCase().includes(keyword) ||
        project.description.toLowerCase().includes(keyword) ||
        project.category.toLowerCase().includes(keyword)
      )
    );
  }
  
  // Return top matches (limit to 6 projects)
  return matchedProjects.slice(0, 6).map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    difficulty: project.difficulty,
    estimatedTime: project.estimatedTime,
    components: project.components,
    category: project.category,
    instructions: project.instructions
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    const projects = matchProjects(body);
    
    // Add some randomization to project IDs to simulate new generations
    const projectsWithNewIds = projects.map(project => ({
      ...project,
      id: project.id + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
    }));
    
    return NextResponse.json({
      success: true,
      data: projectsWithNewIds,
      message: `Generated ${projectsWithNewIds.length} project ideas`,
      filters_applied: {
        skill: body.skill,
        categories: body.categories,
        components: body.components,
        time: body.time,
        has_notes: !!body.notes
      }
    });
  } catch (error) {
    console.error('Generate Ideas Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate project ideas' },
      { status: 500 }
    );
  }
}