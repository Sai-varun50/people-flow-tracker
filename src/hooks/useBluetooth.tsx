
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BluetoothState {
  device: BluetoothDevice | null;
  server: BluetoothRemoteGATTServer | null;
  characteristic: BluetoothRemoteGATTCharacteristic | null;
  isConnected: boolean;
  isConnecting: boolean;
  errorMessage: string | null;
}

interface UseBluetoothReturn extends BluetoothState {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendData: (data: string) => Promise<void>;
}

const HC05_SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const HC05_CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

export function useBluetooth(): UseBluetoothReturn {
  const { toast } = useToast();
  const [state, setState] = useState<BluetoothState>({
    device: null,
    server: null,
    characteristic: null,
    isConnected: false,
    isConnecting: false,
    errorMessage: null,
  });

  // Cleanup function to handle disconnection
  const cleanup = useCallback(() => {
    if (state.server && state.server.connected) {
      state.server.disconnect();
    }
    setState(prev => ({
      ...prev,
      server: null,
      characteristic: null,
      isConnected: false,
      isConnecting: false,
    }));
  }, [state.server]);

  // Handle device disconnection event
  useEffect(() => {
    const onDisconnected = () => {
      toast({
        title: "Disconnected",
        description: "Bluetooth device was disconnected",
        variant: "destructive",
      });
      cleanup();
    };

    if (state.device) {
      state.device.addEventListener('gattserverdisconnected', onDisconnected);
      return () => {
        state.device?.removeEventListener('gattserverdisconnected', onDisconnected);
      };
    }
  }, [state.device, cleanup, toast]);

  // Connect to Bluetooth device
  const connect = async () => {
    if (!navigator.bluetooth) {
      toast({
        title: "Bluetooth not supported",
        description: "Web Bluetooth API is not supported in your browser",
        variant: "destructive",
      });
      setState(prev => ({ 
        ...prev, 
        errorMessage: "Web Bluetooth API is not supported",
        isConnecting: false,
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isConnecting: true, errorMessage: null }));

      // Request device
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [HC05_SERVICE_UUID] },
          { namePrefix: 'HC-05' } // Fallback for some devices
        ],
        optionalServices: [HC05_SERVICE_UUID]
      });

      toast({
        title: "Device selected",
        description: `Connecting to ${device.name || 'HC-05 device'}...`,
      });

      // Connect to GATT server
      const server = await device.gatt?.connect();
      if (!server) throw new Error("Failed to connect to GATT server");

      // Get primary service
      const service = await server.getPrimaryService(HC05_SERVICE_UUID);

      // Get characteristic
      const characteristic = await service.getCharacteristic(HC05_CHARACTERISTIC_UUID);

      // Start notifications
      await characteristic.startNotifications();
      
      setState({
        device,
        server,
        characteristic,
        isConnected: true,
        isConnecting: false,
        errorMessage: null,
      });

      toast({
        title: "Connected",
        description: `Successfully connected to ${device.name || 'HC-05 device'}`,
      });

    } catch (error) {
      console.error('Bluetooth connection error:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect to device",
        variant: "destructive",
      });
      setState(prev => ({ 
        ...prev, 
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        isConnecting: false 
      }));
      cleanup();
    }
  };

  // Disconnect from Bluetooth device
  const disconnect = () => {
    if (state.isConnected) {
      toast({
        title: "Disconnecting",
        description: "Disconnecting from Bluetooth device...",
      });
      cleanup();
    }
  };

  // Send data to Bluetooth device
  const sendData = async (data: string) => {
    if (!state.characteristic || !state.isConnected) {
      toast({
        title: "Not connected",
        description: "Connect to a Bluetooth device first",
        variant: "destructive",
      });
      return;
    }

    try {
      const encoder = new TextEncoder();
      const dataArray = encoder.encode(data);
      await state.characteristic.writeValue(dataArray);
    } catch (error) {
      console.error('Send data error:', error);
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Failed to send data",
        variant: "destructive",
      });
    }
  };

  return {
    ...state,
    connect,
    disconnect,
    sendData,
  };
}
