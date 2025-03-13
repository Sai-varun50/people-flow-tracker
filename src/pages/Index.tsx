
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BluetoothConnect from '@/components/BluetoothConnect';
import Counter from '@/components/Counter';
import Statistics from '@/components/Statistics';
import { useBluetooth } from '@/hooks/useBluetooth';

const Index = () => {
  const { isConnected } = useBluetooth();
  const [entrances, setEntrances] = useState(0);
  const [exits, setExits] = useState(0);
  
  // Update stats from Counter component
  useEffect(() => {
    const intervalId = setInterval(() => {
      // This would be replaced with actual data in a real app
      // For demo purposes, we're just incrementing slowly
      if (!isConnected) {
        setEntrances(prev => prev + Math.floor(Math.random() * 2));
        setExits(prev => prev + Math.floor(Math.random() * 2));
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container max-w-5xl mx-auto px-4 pb-20 pt-4">
        <div className="mb-8">
          <BluetoothConnect />
        </div>
        
        <section className="mb-10">
          <h2 className="text-xl font-medium mb-4">Live Count</h2>
          <Counter useMockData={!isConnected} />
        </section>
        
        <section>
          <h2 className="text-xl font-medium mb-4">Analytics</h2>
          <Statistics entrances={entrances} exits={exits} />
        </section>
      </main>
    </div>
  );
};

export default Index;
