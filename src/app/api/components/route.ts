import { NextRequest, NextResponse } from 'next/server';

// Sample components database - expanded with more components
const COMPONENTS = [
  {
    id: 'arduino-uno',
    name: 'Arduino Uno R3',
    description: 'A microcontroller board based on the ATmega328P. Perfect for beginners and prototyping.',
    category: 'Microcontrollers',
    price_range: '$20-30',
    availability: 'Available',
    specifications: {
      microcontroller: 'ATmega328P',
      operating_voltage: '5V',
      input_voltage: '7-12V',
      digital_io_pins: '14',
      analog_input_pins: '6',
      flash_memory: '32KB'
    }
  },
  {
    id: 'esp32',
    name: 'ESP32 DevKit',
    description: 'Wi-Fi and Bluetooth enabled microcontroller with dual-core processor.',
    category: 'Microcontrollers',
    price_range: '$15-25',
    availability: 'Available',
    specifications: {
      processor: 'Dual-core Tensilica LX6',
      frequency: '240MHz',
      flash_memory: '4MB',
      sram: '520KB',
      wifi: '802.11 b/g/n',
      bluetooth: 'v4.2 BR/EDR and BLE'
    }
  },
  {
    id: 'raspberry-pi-4',
    name: 'Raspberry Pi 4 Model B',
    description: 'Single-board computer with quad-core ARM processor, perfect for advanced projects.',
    category: 'Microcontrollers',
    price_range: '$55-85',
    availability: 'Available',
    specifications: {
      processor: 'Quad-core ARM Cortex-A72',
      frequency: '1.5GHz',
      ram: '4GB LPDDR4',
      connectivity: 'Wi-Fi 802.11ac, Bluetooth 5.0',
      usb_ports: '2x USB 3.0, 2x USB 2.0',
      hdmi: '2x micro-HDMI'
    }
  },
  {
    id: 'hc-sr04',
    name: 'HC-SR04 Ultrasonic Sensor',
    description: 'Ultrasonic distance sensor with 2-400cm measurement range.',
    category: 'Sensors',
    price_range: '$2-5',
    availability: 'Available',
    specifications: {
      operating_voltage: '5V',
      measuring_range: '2cm - 4m',
      measuring_angle: '15°',
      trigger_pulse: '10µs TTL pulse',
      echo_pulse: 'Proportional to distance'
    }
  },
  {
    id: 'dht22',
    name: 'DHT22 Temperature & Humidity Sensor',
    description: 'Digital sensor for measuring temperature and humidity with high accuracy.',
    category: 'Sensors',
    price_range: '$5-10',
    availability: 'Available',
    specifications: {
      operating_voltage: '3.3-6V',
      temperature_range: '-40°C to 80°C',
      humidity_range: '0-100% RH',
      accuracy_temperature: '±0.5°C',
      accuracy_humidity: '±2-5% RH'
    }
  },
  {
    id: 'servo-sg90',
    name: 'SG90 Micro Servo Motor',
    description: 'Small and lightweight servo motor for precise angular control.',
    category: 'Actuators',
    price_range: '$3-8',
    availability: 'Available',
    specifications: {
      operating_voltage: '4.8-6V',
      torque: '2.5kg·cm',
      speed: '0.1s/60°',
      rotation: '180°',
      weight: '9g'
    }
  },
  {
    id: 'led-strip',
    name: 'WS2812B LED Strip',
    description: 'Addressable RGB LED strip with individual pixel control.',
    category: 'Displays',
    price_range: '$10-20',
    availability: 'Available',
    specifications: {
      operating_voltage: '5V',
      power_consumption: '60mA per LED',
      color_depth: '24-bit',
      data_transmission: 'Single-wire',
      pixels_per_meter: '60'
    }
  },
  {
    id: 'relay-module',
    name: '5V Relay Module',
    description: 'Single channel relay module for controlling high voltage devices.',
    category: 'Actuators',
    price_range: '$2-5',
    availability: 'Available',
    specifications: {
      operating_voltage: '5V',
      trigger_current: '15-20mA',
      contact_voltage: '10A 250VAC, 10A 30VDC',
      contact_type: 'Normally Open',
      response_time: '10ms'
    }
  },
  {
    id: 'oled-display',
    name: '0.96" OLED Display',
    description: 'Small OLED display with I2C interface for showing text and graphics.',
    category: 'Displays',
    price_range: '$5-12',
    availability: 'Available',
    specifications: {
      size: '0.96 inch',
      resolution: '128x64',
      interface: 'I2C',
      operating_voltage: '3.3-5V',
      colors: 'White/Blue/Yellow'
    }
  },
  {
    id: 'pir-sensor',
    name: 'PIR Motion Sensor',
    description: 'Passive infrared sensor for detecting motion and presence.',
    category: 'Sensors',
    price_range: '$2-6',
    availability: 'Partially Available',
    specifications: {
      operating_voltage: '5-20V',
      detection_range: '7m',
      detection_angle: '110°',
      delay_time: '5-200s',
      block_time: '2.5s'
    }
  },
  // Additional components
  {
    id: 'mq2-sensor',
    name: 'MQ-2 Gas Sensor',
    description: 'Detects LPG, propane, methane, alcohol, hydrogen, and smoke.',
    category: 'Sensors',
    price_range: '$3-7',
    availability: 'Available',
    specifications: {
      operating_voltage: '5V',
      detection_range: '300-10000ppm',
      response_time: '<10s',
      recovery_time: '<30s'
    }
  },
  {
    id: 'buzzer',
    name: 'Active Buzzer 5V',
    description: 'Simple buzzer for audio alerts and notifications.',
    category: 'Actuators',
    price_range: '$1-3',
    availability: 'Available',
    specifications: {
      operating_voltage: '3.5-5.5V',
      current: '30mA',
      frequency: '2300±300Hz',
      sound_level: '≥85dB'
    }
  },
  {
    id: 'stepper-motor',
    name: '28BYJ-48 Stepper Motor',
    description: '5V stepper motor with ULN2003 driver board for precise positioning.',
    category: 'Actuators',
    price_range: '$5-10',
    availability: 'Available',
    specifications: {
      operating_voltage: '5V',
      step_angle: '5.625°',
      steps_per_revolution: '64',
      gear_ratio: '1:64',
      torque: '34.3mN·m'
    }
  },
  {
    id: 'ldr-sensor',
    name: 'LDR Light Sensor',
    description: 'Light dependent resistor for detecting light intensity.',
    category: 'Sensors',
    price_range: '$1-2',
    availability: 'Available',
    specifications: {
      resistance_light: '1-10kΩ',
      resistance_dark: '1MΩ',
      response_time: '20-30ms',
      peak_wavelength: '540nm'
    }
  },
  {
    id: 'soil-moisture',
    name: 'Soil Moisture Sensor',
    description: 'Capacitive soil moisture sensor for plant monitoring.',
    category: 'Sensors',
    price_range: '$3-6',
    availability: 'Available',
    specifications: {
      operating_voltage: '3.3-5.5V',
      current: '5mA',
      interface: 'Analog',
      probe_length: '60mm'
    }
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  try {
    let filteredComponents = COMPONENTS;
    
    // Filter by category
    if (category && category !== 'All') {
      filteredComponents = filteredComponents.filter(comp => 
        comp.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search query
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredComponents = filteredComponents.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm) ||
        comp.description.toLowerCase().includes(searchTerm) ||
        comp.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    return NextResponse.json({
      success: true,
      data: filteredComponents,
      total: filteredComponents.length
    });
  } catch (error) {
    console.error('Components API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch components' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real app, you'd save to a database here
    const newComponent = {
      id: 'comp-' + Date.now(),
      ...body,
      availability: 'Available'
    };
    
    return NextResponse.json({
      success: true,
      data: newComponent,
      message: 'Component added successfully'
    });
  } catch (error) {
    console.error('Add Component Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add component' },
      { status: 500 }
    );
  }
}