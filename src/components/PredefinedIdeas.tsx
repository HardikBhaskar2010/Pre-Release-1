"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Lightbulb, 
  Zap, 
  Thermometer, 
  Car, 
  Home, 
  Plant,
  Gamepad2,
  Shield,
  Timer,
  Wifi
} from "lucide-react";
import { ProjectIdea } from "@/components/AIProjectGenerator";

export const PREDEFINED_IDEAS: ProjectIdea[] = [
  {
    id: "idea-1",
    title: "Smart Home Temperature Monitor",
    description: "Build a WiFi-enabled temperature and humidity monitor with real-time alerts and data logging capabilities.",
    difficulty: "beginner",
    estimatedTime: "2-5h",
    components: ["ESP32", "DHT22", "OLED Display", "Breadboard", "Resistors"],
    category: "IoT",
    instructions: [
      "Connect DHT22 sensor to ESP32 GPIO pins (VCC, GND, Data to GPIO4)",
      "Wire OLED display using I2C connection (SDA to GPIO21, SCL to GPIO22)",
      "Upload Arduino code to read sensor data and display on OLED",
      "Configure WiFi credentials and connect to your network",
      "Set up web server to display data remotely",
      "Add alert thresholds for temperature and humidity",
      "Test the system and monitor readings for 24 hours",
      "Create a simple web dashboard for data visualization"
    ]
  },
  {
    id: "idea-2", 
    title: "Obstacle-Avoiding Robot Car",
    description: "Create an autonomous robot that navigates around obstacles using ultrasonic sensors and servo-controlled steering.",
    difficulty: "intermediate",
    estimatedTime: "5-10h", 
    components: ["Arduino Uno", "Ultrasonic Sensor", "Servo Motor", "DC Motors", "Motor Driver", "Chassis", "Wheels"],
    category: "Robotics",
    instructions: [
      "Assemble the robot chassis and mount wheels with DC motors",
      "Install motor driver board and connect to Arduino",
      "Mount ultrasonic sensor on servo motor for 180° scanning",
      "Wire all components according to circuit diagram",
      "Program basic movement functions (forward, backward, turn)",
      "Implement obstacle detection using ultrasonic readings", 
      "Add decision-making logic for path planning",
      "Test and calibrate sensor sensitivity and turning angles",
      "Add LED indicators for status feedback"
    ]
  },
  {
    id: "idea-3",
    title: "Automated Plant Watering System", 
    description: "Design a smart irrigation system that waters plants based on soil moisture levels with mobile notifications.",
    difficulty: "intermediate",
    estimatedTime: "2-5h",
    components: ["Arduino Nano", "Soil Moisture Sensor", "Water Pump", "Relay Module", "LCD Display", "Buzzer"],
    category: "Automation",
    instructions: [
      "Set up soil moisture sensor in plant pot at appropriate depth",
      "Connect water pump to relay module for automated control",
      "Wire LCD display to show moisture levels and pump status",
      "Program moisture threshold detection (typically 30-40%)",
      "Implement pump activation when soil is dry",
      "Add safety features: pump timeout and overflow protection",
      "Include buzzer alerts for low water reservoir",
      "Calibrate moisture sensor for different soil types",
      "Create watering schedule with manual override option"
    ]
  },
  {
    id: "idea-4", 
    title: "Digital Security Access System",
    description: "Build a keypad-controlled door lock with RFID card access and entry logging functionality.",
    difficulty: "advanced",
    estimatedTime: "10h-plus",
    components: ["ESP32", "RFID Reader", "Keypad", "Servo Motor", "LCD Display", "Buzzer", "LEDs"],
    category: "Security",
    instructions: [
      "Install servo motor as door lock mechanism",
      "Wire RFID reader and keypad for dual authentication",
      "Set up LCD display for user interface and feedback",
      "Program RFID card enrollment and validation system",
      "Implement secure keypad PIN verification",
      "Add access logging with timestamp storage",
      "Create admin mode for user management",
      "Include lockout features for failed attempts",
      "Add remote access via WiFi web interface",
      "Test security features and fail-safes thoroughly"
    ]
  },
  {
    id: "idea-5",
    title: "Digital Dice Gaming System",
    description: "Create an electronic dice system with LED matrix display, sound effects, and multiple game modes.",
    difficulty: "beginner", 
    estimatedTime: "lt-2h",
    components: ["Arduino Nano", "LED Matrix", "Push Button", "Buzzer", "Battery Pack", "Resistors"],
    category: "Entertainment",
    instructions: [
      "Connect 8x8 LED matrix to Arduino using shift registers",
      "Wire push button with pull-up resistor for dice rolling",
      "Add buzzer for sound effects during roll animation",
      "Program random number generation (1-6) for fair dice",
      "Create animated rolling effect on LED display",
      "Add different dice faces using LED patterns",
      "Include multiple game modes (single, double dice)",
      "Implement roll history and statistics tracking"
    ]
  },
  {
    id: "idea-6",
    title: "Smart Countdown Timer",
    description: "Build a programmable countdown timer with multiple alarms, LED indicators, and mobile app control.",
    difficulty: "intermediate",
    estimatedTime: "2-5h", 
    components: ["ESP8266", "7-Segment Display", "Push Buttons", "Buzzer", "RGB LEDs", "Resistors"],
    category: "Productivity",
    instructions: [
      "Wire 4-digit 7-segment display for time visualization",
      "Connect push buttons for time setting and control",
      "Add RGB LEDs for visual countdown indicators",
      "Program multiple timer presets (Pomodoro, cooking, exercise)",
      "Implement WiFi connectivity for smartphone control",
      "Create progressive alert system (LED → Buzzer → Vibration)",
      "Add pause, resume, and reset functionality",
      "Include timer completion statistics and tracking"
    ]
  }
];

interface PredefinedIdeasProps {
  selectedComponents: string[];
  onSelectIdea: (idea: ProjectIdea) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'iot': return Wifi;
    case 'robotics': return Car;
    case 'automation': return Home;
    case 'security': return Shield;
    case 'entertainment': return Gamepad2;
    case 'productivity': return Timer;
    default: return Lightbulb;
  }
};

export default function PredefinedIdeas({ selectedComponents, onSelectIdea }: PredefinedIdeasProps) {
  // Filter ideas based on selected components
  const matchedIdeas = PREDEFINED_IDEAS.filter(idea => {
    if (selectedComponents.length === 0) return true;
    
    // Check if any selected components match the idea's components
    const matches = selectedComponents.some(selected =>
      idea.components.some(required =>
        required.toLowerCase().includes(selected.toLowerCase()) ||
        selected.toLowerCase().includes(required.toLowerCase())
      )
    );
    
    return matches;
  });

  const allIdeas = matchedIdeas.length > 0 ? matchedIdeas : PREDEFINED_IDEAS.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {selectedComponents.length > 0 ? "Matching Project Ideas" : "Popular Project Ideas"}
          </h3>
        </div>
        {selectedComponents.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {matchedIdeas.length} match{matchedIdeas.length !== 1 ? 'es' : ''} found
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {allIdeas.map((idea, index) => {
          const Icon = getCategoryIcon(idea.category);
          const matchingComponents = selectedComponents.filter(selected =>
            idea.components.some(required =>
              required.toLowerCase().includes(selected.toLowerCase()) ||
              selected.toLowerCase().includes(required.toLowerCase())
            )
          );

          return (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => onSelectIdea(idea)}
            >
              <div className="p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-md h-full">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-base group-hover:text-primary transition-colors line-clamp-1">
                      {idea.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {idea.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {idea.category}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                    {idea.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                    {idea.estimatedTime.replace('lt-', '< ').replace('h', ' hrs')}
                  </span>
                </div>

                {matchingComponents.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      Your matching components:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {matchingComponents.slice(0, 3).map((comp, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium"
                        >
                          ✓ {comp}
                        </span>
                      ))}
                      {matchingComponents.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                          +{matchingComponents.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  {idea.instructions.length} step{idea.instructions.length !== 1 ? 's' : ''} • Click to use this idea
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}