'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { ChartData } from 'chart.js';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { WalletDisplay } from '@/components/client/WalletDisplay';
import { useAccount } from 'wagmi';

interface EngagementData {
  totalEngagements: number;
  weeklyGrowth: number;
  tokensEarned: number;
  history: {
    date: string;
    engagements: number;
    tokens: number;
  }[];
}

// Define a type for mixed chart data that can have both line and bar charts
type MixedChartData = ChartData<'line' | 'bar'>;

export default function TokenizedEngagementDashboard() {
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [chartData, setChartData] = useState<MixedChartData | null>(null);
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // Mock data for demonstration
    setTokenBalance(450);
    setUserRank(7);

    // Simulating API call for engagement data
    const fetchEngagementData = async () => {
      try {
        // In a real app, this would be an API call to your backend
        // For now, using mock data
        const mockData: EngagementData = {
          totalEngagements: 1250,
          weeklyGrowth: 15,
          tokensEarned: 450,
          history: Array.from({ length: 30 }, (_, i) => ({
            date: `2023-${(i % 12) + 1}-${(i % 28) + 1}`,
            engagements: 20 + Math.floor(Math.random() * 30),
            tokens: 10 + Math.floor(Math.random() * 20)
          }))
        };

        setEngagementData(mockData);

        // Create chart data from mock data
        const data: MixedChartData = {
          labels: mockData.history.map(item => item.date),
          datasets: [
            {
              label: 'Engagements',
              data: mockData.history.map(item => item.engagements),
              borderColor: 'rgb(0, 255, 255)',
              backgroundColor: 'rgba(0, 255, 255, 0.2)',
              tension: 0.4,
              yAxisID: 'y1',
              type: 'line' as const
            },
            {
              label: 'Tokens Earned',
              data: mockData.history.map(item => item.tokens),
              type: 'bar' as const,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              yAxisID: 'y2'
            },
          ],
        };
        
        setChartData(data);
      } catch (error) {
        console.error('Error fetching engagement data:', error);
      }
    };

    fetchEngagementData();
  }, []);

  return (
    <div className="min-h-screen bg-black p-6 grid grid-cols-2 gap-6">
      <Card className="bg-black rounded-2xl shadow-xl hover:shadow-cyan-500/50 transition duration-300">
        <CardContent className="text-white p-4">
          <h2 className="text-xl font-bold mb-4">Your Engagement Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Wallet:</span> 
              <WalletDisplay />
            </div>
            <p>Token Balance: {tokenBalance} TOKENS</p>
            <p>Community Rank: #{userRank}</p>
            <p>Engagement Level: {tokenBalance > 400 ? 'Gold' : tokenBalance > 200 ? 'Silver' : 'Bronze'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black rounded-2xl shadow-xl hover:shadow-cyan-500/50 transition duration-300">
        <CardContent className="text-white p-4">
          <h2 className="text-xl font-bold mb-2">Top Engagers</h2>
          <ul className="space-y-2">
            <li className="flex justify-between border-b border-gray-700 pb-1">
              <span>0xAbc1... </span>
              <span>1200 TOKENS</span>
            </li>
            <li className="flex justify-between border-b border-gray-700 pb-1">
              <span>0xDef2... </span>
              <span>950 TOKENS</span>
            </li>
            <li className="flex justify-between border-b border-gray-700 pb-1">
              <span>0xGhi3... </span>
              <span>870 TOKENS</span>
            </li>
            <li className="flex justify-between border-b border-gray-700 pb-1">
              <span>0xJkl4... </span>
              <span>760 TOKENS</span>
            </li>
            <li className="flex justify-between border-b border-gray-700 pb-1">
              <span>0xMno5... </span>
              <span>650 TOKENS</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-black col-span-2 rounded-2xl shadow-xl hover:shadow-cyan-500/50 transition duration-300">
        <CardContent className="text-white p-4">
          <h2 className="text-xl font-bold mb-2">Engagement Analytics</h2>
          {engagementData && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-400">Total Engagements</p>
                <p className="text-2xl font-bold">{engagementData.totalEngagements}</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-400">Weekly Growth</p>
                <p className="text-2xl font-bold text-green-400">+{engagementData.weeklyGrowth}%</p>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <p className="text-gray-400">Tokens Earned</p>
                <p className="text-2xl font-bold text-cyan-400">{engagementData.tokensEarned}</p>
              </div>
            </div>
          )}
          {chartData && (
            <div className="h-80">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y1: {
                      type: 'linear',
                      position: 'left',
                      title: {
                        display: true,
                        text: 'Engagements'
                      },
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    },
                    y2: {
                      type: 'linear',
                      position: 'right',
                      title: {
                        display: true,
                        text: 'Tokens'
                      },
                      grid: {
                        drawOnChartArea: false,
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: 'white'
                      }
                    }
                  }
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300">
        <CardContent className="text-white p-4 flex items-center justify-center h-full">
          <button className="text-xl font-bold" onClick={() => router.push('/claim-rewards')}>Claim Rewards</button>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300">
        <CardContent className="text-white p-4 flex items-center justify-center h-full">
          <button className="text-xl font-bold" onClick={() => router.push('/engagement-tasks')}>Engagement Tasks</button>
        </CardContent>
      </Card>
    </div>
  );
} 