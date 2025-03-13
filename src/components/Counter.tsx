
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Users } from 'lucide-react';
import { useBluetooth } from '@/hooks/useBluetooth';
import { Direction, parseBluetoothData, generateMockData } from '@/utils/dataParser';

interface CounterProps {
  useMockData?: boolean;
}

const Counter: React.FC<CounterProps> = ({ useMockData = false }) => {
  const [entrances, setEntrances] = useState(0);
  const [exits, setExits] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [lastDirection, setLastDirection] = useState<Direction>(null);
  const [recentActivity, setRecentActivity] = useState<{ time: Date; direction: Direction }[]>([]);
  
  const { isConnected, characteristic } = useBluetooth();

  useEffect(() => {
    if (!isConnected || !characteristic) return;

    const handleCharacteristicValueChanged = (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const dataView = target.value;
      if (!dataView) return;
      
      const direction = parseBluetoothData(dataView);
      processDirectionData(direction);
    };

    characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    
    return () => {
      characteristic.removeEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);
    };
  }, [isConnected, characteristic]);

  // Mock data generator for testing
  useEffect(() => {
    if (!useMockData || isConnected) return;
    
    const interval = setInterval(() => {
      const direction = generateMockData();
      processDirectionData(direction);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [useMockData, isConnected]);

  const processDirectionData = (direction: Direction) => {
    if (direction === null) return;
    
    setLastDirection(direction);
    
    if (direction === 'in') {
      setEntrances(prev => prev + 1);
      setCurrentCount(prev => prev + 1);
    } else if (direction === 'out') {
      setExits(prev => prev + 1);
      setCurrentCount(prev => Math.max(0, prev - 1));
    }
    
    setRecentActivity(prev => {
      const newActivity = [{ time: new Date(), direction }, ...prev].slice(0, 5);
      return newActivity;
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="stat-card">
          <CardContent className="p-0 flex flex-col items-center justify-center h-full">
            <ArrowRight className="h-8 w-8 text-green-500 mb-2" />
            <p className="count-value">{entrances}</p>
            <p className="count-label">Entrances</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card col-span-1 md:col-span-1">
          <CardContent className="p-0 flex flex-col items-center justify-center h-full">
            <Users className="h-8 w-8 text-primary mb-2" />
            <p className="count-value">{currentCount}</p>
            <p className="count-label">Current Count</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-0 flex flex-col items-center justify-center h-full">
            <ArrowLeft className="h-8 w-8 text-red-500 mb-2" />
            <p className="count-value">{exits}</p>
            <p className="count-label">Exits</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass-panel">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium mb-3">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <ul className="space-y-2">
              {recentActivity.map((activity, index) => (
                <li key={index} className="flex items-center text-sm gap-2 animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  {activity.direction === 'in' ? (
                    <ArrowRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowLeft className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-gray-500">{formatTime(activity.time)}</span>
                  <span className="font-medium">
                    Person {activity.direction === 'in' ? 'entered' : 'exited'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Counter;
