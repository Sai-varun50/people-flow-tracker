
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatisticsProps {
  entrances: number;
  exits: number;
}

// Mock data for the chart
const generateHourlyData = (entrances: number, exits: number) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Create time slots for the last 8 hours
  return Array.from({ length: 8 }, (_, i) => {
    const hour = (currentHour - 7 + i + 24) % 24;
    const hourLabel = `${hour}:00`;
    
    // Scale the entrances and exits based on the hour
    // This creates a realistic distribution throughout the day
    const factor = Math.sin((hour / 24) * Math.PI) * 0.5 + 0.5;
    const hourEntrances = Math.floor((entrances / 8) * factor * (1 + Math.random() * 0.4));
    const hourExits = Math.floor((exits / 8) * factor * (1 + Math.random() * 0.4));
    
    return {
      hour: hourLabel,
      entrances: hourEntrances,
      exits: hourExits,
      total: hourEntrances - hourExits
    };
  });
};

const Statistics: React.FC<StatisticsProps> = ({ entrances, exits }) => {
  const data = generateHourlyData(entrances, exits);
  
  return (
    <Card className="glass-panel mt-6 animate-scale-in">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium">Today's Traffic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="hour" fontSize={12} tickMargin={10} />
              <YAxis fontSize={12} tickMargin={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '0.5rem',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem'
                }}
              />
              <Bar dataKey="entrances" fill="rgba(52, 211, 153, 0.8)" radius={[4, 4, 0, 0]} name="Entrances" />
              <Bar dataKey="exits" fill="rgba(248, 113, 113, 0.8)" radius={[4, 4, 0, 0]} name="Exits" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800">Avg. Occupancy Rate</p>
            <p className="text-2xl font-semibold text-green-700 mt-1">
              {Math.round((entrances - exits) / Math.max(1, entrances) * 100)}%
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-800">Peak Hour</p>
            <p className="text-2xl font-semibold text-blue-700 mt-1">
              {data.reduce((max, item) => item.entrances > max.entrances ? item : max, data[0]).hour}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Statistics;
