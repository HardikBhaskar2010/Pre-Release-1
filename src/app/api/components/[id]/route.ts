import { NextRequest, NextResponse } from 'next/server';

// This would typically come from a database
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
  }
  // ... other components would be loaded from database
];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    
    const component = COMPONENTS.find(comp => comp.id === id);
    
    if (!component) {
      return NextResponse.json(
        { success: false, error: 'Component not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: component
    });
  } catch (error) {
    console.error('Get Component Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch component' },
      { status: 500 }
    );
  }
}