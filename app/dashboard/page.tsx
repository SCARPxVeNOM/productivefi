'use client';

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/client/WalletContext";
import { WalletDisplay } from "@/components/client/WalletDisplay";
import { RefreshCw } from "lucide-react";
import styles from "./dashboard.module.css";
import Image from "next/image";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  ChartDataset
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler
);

// Define the chart dataset type
interface ChartDataProps {
  labels: string[];
  datasets: ChartDataset<'line', number[]>[];
}

export default function Dashboard() {
  const router = useRouter();
  const { isWalletConnected, setRequiresConnection } = useWallet();
  const [price, setPrice] = useState("$0.0142");  // Default to fallback value
  const [volume, setVolume] = useState("$21.50M");  // Default to fallback value
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [dataSource, setDataSource] = useState('fixed');
  const [chartData, setChartData] = useState<ChartDataProps>({
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        type: 'line',
        label: "Price",
        data: [1.32, 1.36, 1.38, 1.29, 1.42, 1.45, 1.40],
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.2)",
      },
    ],
  });

  // Wrap the data fetching functions in useCallback to reuse them
  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/market-data?type=current');
      
      if (!res.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      const data = await res.json();
      
      if (data.status === 'success') {
        // Always format with the correct number of decimal places
        const priceValue = parseFloat(String(data.price));
        if (!isNaN(priceValue)) {
          if (priceValue < 0.001) {
            setPrice(`$${priceValue.toFixed(6)}`);
          } else if (priceValue < 0.01) {
            setPrice(`$${priceValue.toFixed(5)}`);
          } else if (priceValue < 0.1) {
            setPrice(`$${priceValue.toFixed(4)}`);
          } else if (priceValue < 1) {
            setPrice(`$${priceValue.toFixed(4)}`);
          } else {
            setPrice(`$${priceValue.toFixed(2)}`);
          }
        }
        
        // Format volume with proper suffix (K, M, B)
        const volumeValue = parseFloat(String(data.volume));
        if (!isNaN(volumeValue)) {
          if (volumeValue >= 1e9) {
            setVolume(`$${(volumeValue / 1e9).toFixed(2)}B`);
          } else if (volumeValue >= 1e6) {
            setVolume(`$${(volumeValue / 1e6).toFixed(2)}M`);
          } else if (volumeValue >= 1e3) {
            setVolume(`$${(volumeValue / 1e3).toFixed(2)}K`);
          } else {
            setVolume(`$${volumeValue.toFixed(2)}`);
          }
        }
        
        setDataSource(data.source || 'fixed');
        setDataError(false);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      // Don't change the values - keep using defaults
      setDataError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistoricalData = useCallback(async () => {
    try {
      const res = await fetch('/api/market-data?type=historical');
      
      if (!res.ok) {
        throw new Error('Failed to fetch historical data');
      }
      
      const data = await res.json();
      
      if (data.status === 'success' && data.quotes && Array.isArray(data.quotes) && data.quotes.length > 0) {
        // Ensure we sort by date (ascending)
        const sortedQuotes = [...data.quotes].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setChartData({
          labels: sortedQuotes.map((q) => {
            // Format date in a user-friendly way
            const date = new Date(q.date);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              type: 'line',
              label: "Price",
              data: sortedQuotes.map((q) => q.close),
              borderColor: "#4ade80",
              backgroundColor: "rgba(74, 222, 128, 0.2)",
              fill: true,
              tension: 0.2,
              pointRadius: 4,
              pointBackgroundColor: "#4ade80",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              pointHoverRadius: 6,
            },
          ],
        });
        
        setDataSource(data.source || 'fixed');
        setDataError(false);
      }
    } catch (err) {
      console.error("Error fetching historical data:", err);
      setDataError(true);
      // Keep using the default chart data
    }
  }, []);

  // Function to refresh all market data
  const refreshData = useCallback(() => {
    fetchMarketData();
    fetchHistoricalData();
  }, [fetchMarketData, fetchHistoricalData]);

  useEffect(() => {
    if (!isWalletConnected) {
      setRequiresConnection(true);
      router.push('/');
      return;
    }

    refreshData();
  }, [isWalletConnected, router, setRequiresConnection, refreshData]);

  if (!isWalletConnected) {
    return null; // This will prevent any flashing of content before redirect
  }

  return (
    <div className={`relative flex h-screen overflow-hidden ${styles.dashboard3d}`}>
      {/* 3D Rotating Zora Coin Background */}
      <div className={styles.orbBackground}>
        {/* Background blur/texture */}
        <div className={styles.orbImage}></div>
        
        {/* Rotating coin container */}
        <div className={styles.orbContainer}>
          <div className={styles.zoraCoin}>
            {/* Inline SVG for the Zora coin to ensure it's visible */}
            <svg width="380" height="380" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', top: 0, left: 0}}>
              <circle cx="200" cy="200" r="195" fill="#000000" stroke="#00C2FF" strokeWidth="10"/>
              <circle cx="200" cy="200" r="150" fill="url(#paint0_radial_1_2)" stroke="#FF5C00" strokeWidth="4"/>
              <path d="M130 130L270 270M130 270L270 130" stroke="white" strokeWidth="10" strokeLinecap="round"/>
              <defs>
                <radialGradient id="paint0_radial_1_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(170 170) rotate(45) scale(200)">
                  <stop offset="0" stopColor="#4D78FF"/>
                  <stop offset="0.5" stopColor="#3D49FF"/>
                  <stop offset="1" stopColor="#312BCC"/>
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div className={styles.coinShadow}></div>
        </div>
        
        <div className={styles.glowOverlay}></div>
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-64 bg-black/70 backdrop-blur-sm text-white p-6 shadow-xl shadow-blue-500/10 border-r border-white/10 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-10 text-center">ProductiveFi</h2>
        <nav className="space-y-8 w-full flex flex-col justify-between flex-1">
          <Link href="/dashboard" passHref>
            <Button variant="ghost" className={`w-full text-white hover:bg-blue-500/20 font-medium rounded-xl py-3 border border-blue-500/30 transition-all duration-300 h-14 flex items-center justify-center ${styles.sidebarButton3d}`}>
              <span className="mr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </span>
              Dashboard
            </Button>
          </Link>
          <Link href="/explore" passHref>
            <Button variant="ghost" className={`w-full text-white hover:bg-blue-500/20 font-medium rounded-xl py-3 border border-blue-500/30 transition-all duration-300 h-14 flex items-center justify-center ${styles.sidebarButton3d}`}>
              <span className="mr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </span>
              Explore Coins
            </Button>
          </Link>
          <Link href="/tokenized-engagement-dashboard" passHref>
            <Button variant="ghost" className={`w-full text-white hover:bg-blue-500/20 font-medium rounded-xl py-3 border border-blue-500/30 transition-all duration-300 h-14 flex items-center justify-center ${styles.sidebarButton3d}`}>
              <span className="mr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </span>
              Tokenized Engagement
            </Button>
          </Link>
          <Link href="/studyfi" passHref>
            <Button variant="ghost" className={`w-full text-white hover:bg-purple-500/20 font-medium rounded-xl py-3 border border-blue-500/30 transition-all duration-300 h-14 flex items-center justify-center ${styles.sidebarButton3d}`}>
              <span className="mr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </span>
              StudyFi
            </Button>
          </Link>
          <Link href="/profile" passHref>
            <Button variant="ghost" className={`w-full text-white hover:bg-green-500/20 font-medium rounded-xl py-3 border border-blue-500/30 transition-all duration-300 h-14 flex items-center justify-center ${styles.sidebarButton3d}`}>
              <span className="mr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              Profile
            </Button>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`relative z-10 flex-1 p-6 overflow-y-auto bg-black/30 backdrop-blur-md ${styles.mainContent3d}`}>
        {/* Header */}
        <header className="mb-6 flex justify-between items-center">
          <div className="flex-1 text-center">
            <h1 className="text-3xl text-white font-bold">ProductiveFi  Dashboard</h1>
          </div>
          <WalletDisplay />
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {/* Top-left card (Leaderboard) */}
          <Card className={`${styles.card3d} bg-black/70 backdrop-blur-md text-white row-span-1 col-span-2 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30`}>
            <CardContent className={styles.cardContent3d}>
              <h2 className="text-xl font-semibold mb-4">Leaderboard - Zora Holdings</h2>
              <ul className="space-y-2">
                <li>0xabc...123 - 500 ZORA</li>
                <li>0xdef...456 - 420 ZORA</li>
                <li>0xghi...789 - 350 ZORA</li>
              </ul>
            </CardContent>
          </Card>

          {/* Large card (Market Data) */}
          <Card className={`${styles.card3d} bg-black/70 backdrop-blur-md text-white row-span-2 col-span-1 rounded-xl border border-cyan-500/20 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30`}>
            <CardContent className={styles.cardContent3d}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Zora Market Data</h2>
                <Button 
                  variant="outline" 
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-800"
                  onClick={refreshData}
                  disabled={isLoading}
                >
                  <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-24 py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
                  <p className="text-gray-400 text-sm">Loading market data...</p>
                </div>
              ) : null}
              
              <div className={isLoading ? 'opacity-50' : ''}>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Price:</span>
                    <span className="text-xl font-semibold text-white">{price}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">Volume:</span>
                    <span className="text-xl font-semibold text-white">{volume}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-black/40 p-2 rounded-lg">
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        labels: {
                          color: 'rgba(255, 255, 255, 0.7)',
                          font: {
                            size: 10
                          }
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleFont: {
                          size: 10
                        },
                        bodyFont: {
                          size: 10
                        },
                        callbacks: {
                          label: function(context) {
                            return `Price: $${context.raw}`;
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                          font: {
                            size: 8
                          }
                        }
                      },
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: 'rgba(255, 255, 255, 0.7)',
                          font: {
                            size: 10
                          },
                          callback: function(value) {
                            return '$' + value;
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-end mt-4">
                <a 
                  href="https://coinmarketcap.com/currencies/zora/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  View on CoinMarketCap →
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Bottom two cards */}
          <Card className={`${styles.card3d} bg-black/70 backdrop-blur-md text-white rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/30`}>
            <CardContent className={styles.cardContent3d}>
              <h2 className="text-xl font-semibold mb-2">GameFi</h2>
              <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0" onClick={() => window.location.href = "/gamefi"}>Explore GameFi</Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer" onClick={() => window.location.href = 'https://683caf45083d3e7c75641d06--musical-tarsier-3e2be3.netlify.app/'}>
            <CardContent className="text-white p-4 flex items-center justify-center h-full">
              <button className="text-xl font-bold">Tokenized Engagement</button>
            </CardContent>
          </Card>
          <Card className={`${styles.card3d} bg-black/70 backdrop-blur-md text-white rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30`}>
            <CardContent className={styles.cardContent3d}>
              <h2 className="text-xl font-semibold mb-2">StudyFi</h2>
              <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0" onClick={() => window.location.href = "/studyfi"}>Explore StudyFi</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}