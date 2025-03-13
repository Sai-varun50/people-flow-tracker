
// This function parses the raw data from the HC-05 module
// Expected format: "IN" or "OUT" indicating direction

export type Direction = 'in' | 'out' | null;

export function parseBluetoothData(data: DataView): Direction {
  try {
    // Convert DataView to string
    const decoder = new TextDecoder('utf-8');
    const value = decoder.decode(data);
    
    // Trim and normalize to lowercase
    const normalizedValue = value.trim().toLowerCase();
    
    // Check if it's a valid direction
    if (normalizedValue === 'in') {
      return 'in';
    } else if (normalizedValue === 'out') {
      return 'out';
    }
    
    console.warn('Unknown data format received:', value);
    return null;
  } catch (error) {
    console.error('Error parsing Bluetooth data:', error);
    return null;
  }
}

// This is a mock function for testing without an actual HC-05 device
export function generateMockData(): Direction {
  // Randomly generate 'in' or 'out' with some null values to simulate errors
  const random = Math.random();
  if (random < 0.45) return 'in';
  if (random < 0.9) return 'out';
  return null; // 10% chance of error
}
