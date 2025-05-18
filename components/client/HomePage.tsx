'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Users, Zap, Wallet } from "lucide-react";
import { WalletConnect } from "./WalletConnect";
import { useWallet } from "./WalletContext";

export function HomePageContent() {
  const router = useRouter();
  const { isWalletConnected, setRequiresConnection } = useWallet();
  
  const handleProtectedAction = (e, path) => {
    if (!isWalletConnected) {
      e.preventDefault();
      setRequiresConnection(true);
      return;
    }
    
    router.push(path);
  };
  
  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 blur-2xl" />
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Header with wallet connect */}
      <header className="relative z-20 flex justify-end p-4">
        <WalletConnect />
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Empower Creators with Coins
        </motion.h1>
        <motion.p
          className="max-w-2xl text-lg md:text-xl mb-8 text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Mint tokens. Launch creator coins. Engage your fans with Web3 tools on Zora.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex gap-4"
        >
          <Button 
            className="text-lg px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700"
            onClick={(e) => handleProtectedAction(e, '/create')}
          >
            Sneak Peek <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            className="text-lg px-6 py-3 rounded-2xl border-purple-500 text-purple-400 hover:bg-purple-500/10"
            onClick={(e) => handleProtectedAction(e, '/dashboard')}
          >
            Dashboard
          </Button>
        </motion.div>
        
        {!isWalletConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-purple-500/20 max-w-md"
          >
            <p className="text-center text-gray-300 mb-4">
              Connect your wallet to access all features
            </p>
            <div className="flex justify-center">
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                onClick={() => setRequiresConnection(true)}
              >
                <Wallet className="mr-2 h-5 w-5" />
                Connect Wallet
              </Button>
            </div>
          </motion.div>
        )}
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose ProductiveFi ?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 cursor-pointer transition-transform hover:scale-105"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              onClick={(e) => handleProtectedAction(e, '/tokenized-engagement-dashboard')}
            >
              <Coins className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Tokenized Engagement (under development)</h3>
              <p className="text-gray-400">Create unique tokens that represent your brand and engage with your community.</p>
            </motion.div>
            <motion.div
              className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Users className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community Building</h3>
              <p className="text-gray-400">Foster a strong community by rewarding your most dedicated supporters.</p>
            </motion.div>
            <motion.div
              className="p-6 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Zap className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Trading</h3>
              <p className="text-gray-400">Enable instant trading of your coins with built-in liquidity pools.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
} 