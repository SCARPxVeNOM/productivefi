'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function ClaimRewards() {
  const [claiming, setClaiming] = useState(false);
  const router = useRouter();
  
  const handleClaim = async () => {
    setClaiming(true);
    // Simulate API call
    setTimeout(() => {
      setClaiming(false);
      alert('Rewards claimed successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <button 
        onClick={() => router.push('/tokenized-engagement-dashboard')}
        className="mb-6 text-cyan-400 hover:text-cyan-300"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-white mb-8">Claim Your Engagement Rewards</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black rounded-2xl shadow-xl border border-cyan-500">
          <CardContent className="text-white p-6">
            <h2 className="text-2xl font-bold mb-4">Available Rewards</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Weekly Engagement</p>
                  <p className="text-sm text-gray-400">Complete 5 daily tasks</p>
                </div>
                <p className="text-xl font-bold text-cyan-400">75 TOKENS</p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Content Creation</p>
                  <p className="text-sm text-gray-400">Created 2 posts this week</p>
                </div>
                <p className="text-xl font-bold text-cyan-400">50 TOKENS</p>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium">Community Bonus</p>
                  <p className="text-sm text-gray-400">Top 10 community member</p>
                </div>
                <p className="text-xl font-bold text-cyan-400">100 TOKENS</p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-between items-center p-4 bg-gray-900 rounded-lg">
              <p className="text-xl font-bold">Total Available:</p>
              <p className="text-2xl font-bold text-cyan-400">225 TOKENS</p>
            </div>
            
            <button 
              onClick={handleClaim}
              disabled={claiming}
              className={`w-full mt-6 py-3 px-4 rounded-xl font-bold ${
                claiming 
                ? 'bg-gray-700 text-gray-400' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
              } transition duration-300`}
            >
              {claiming ? 'Processing...' : 'Claim All Rewards'}
            </button>
          </CardContent>
        </Card>
        
        <Card className="bg-black rounded-2xl shadow-xl border border-gray-700">
          <CardContent className="text-white p-6">
            <h2 className="text-2xl font-bold mb-4">Reward History</h2>
            <div className="space-y-3">
              {[
                { date: '2023-06-15', amount: 150, reason: 'Weekly Engagement' },
                { date: '2023-06-08', amount: 200, reason: 'Content Creation' },
                { date: '2023-06-01', amount: 75, reason: 'Community Bonus' },
                { date: '2023-05-25', amount: 100, reason: 'Weekly Engagement' },
                { date: '2023-05-18', amount: 125, reason: 'Content Creation' },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-medium">{item.reason}</p>
                    <p className="text-sm text-gray-400">{item.date}</p>
                  </div>
                  <p className="text-xl font-bold text-green-400">+{item.amount} TOKENS</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center p-4 bg-gray-900 rounded-lg">
              <p className="text-xl font-bold">Total Earned:</p>
              <p className="text-2xl font-bold text-green-400">650 TOKENS</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 