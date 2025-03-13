
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBluetooth } from '@/hooks/useBluetooth';
import { Bluetooth, BluetoothConnected, BluetoothOff, RefreshCw } from 'lucide-react';

const BluetoothConnect: React.FC = () => {
  const { isConnected, isConnecting, connect, disconnect, device } = useBluetooth();

  return (
    <Card className="glass-panel animate-slide-up transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="bg-green-100 p-2 rounded-lg">
                <BluetoothConnected className="h-5 w-5 text-green-600" />
              </div>
            ) : isConnecting ? (
              <div className="bg-amber-100 p-2 rounded-lg">
                <RefreshCw className="h-5 w-5 text-amber-600 animate-spin" />
              </div>
            ) : (
              <div className="bg-slate-100 p-2 rounded-lg">
                <Bluetooth className="h-5 w-5 text-slate-600" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-sm">Bluetooth Status</h3>
              <p className="text-sm text-muted-foreground">
                {isConnected
                  ? `Connected to ${device?.name || 'HC-05'}`
                  : isConnecting
                  ? 'Connecting...'
                  : 'Disconnected'}
              </p>
            </div>
          </div>
          <Button 
            variant={isConnected ? "outline" : "default"}
            size="sm"
            onClick={isConnected ? disconnect : connect}
            disabled={isConnecting}
            className="transition-all duration-300"
          >
            {isConnected ? (
              <span className="flex items-center gap-1">
                <BluetoothOff className="h-4 w-4" />
                Disconnect
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Bluetooth className="h-4 w-4" />
                Connect
              </span>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          <p>
            {isConnected
              ? "Successfully connected to HC-05 module. Ready to receive data."
              : "Connect to your HC-05 Bluetooth module to start tracking people flow."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BluetoothConnect;
