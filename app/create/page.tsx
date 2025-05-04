'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount, useWalletClient } from "wagmi";
import { createCoin } from "@zoralabs/coins-sdk";
import { base } from "viem/chains";
import { createPublicClient, http } from "viem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FormData {
  name: string;
  symbol: string;
  uri: string;
}

export default function CreateCoinPage() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const publicClient = createPublicClient({ chain: base, transport: http() });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    symbol: "",
    uri: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ hash: string; address: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.symbol.trim()) {
      setError("Symbol is required");
      return false;
    }
    if (!formData.uri.trim()) {
      setError("Metadata URI is required");
      return false;
    }
    if (!formData.uri.startsWith("ipfs://")) {
      setError("Metadata URI must start with ipfs://");
      return false;
    }
    return true;
  };

  const handleCreateCoin = async () => {
    if (!walletClient || !address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await createCoin(
        {
          name: formData.name,
          symbol: formData.symbol,
          uri: formData.uri,
          payoutRecipient: address,
          initialPurchaseWei: BigInt(0),
        },
        walletClient,
        publicClient
      );
      setSuccess(result);
      setFormData({ name: "", symbol: "", uri: "" });
    } catch (e) {
      console.error(e);
      setError("Failed to create coin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto"
      >
        <h1 className="text-3xl font-bold mb-8">Create Your Coin</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">Coin created successfully!</p>
              <p className="text-sm mt-1">Transaction Hash: {success.hash}</p>
              <p className="text-sm">Coin Address: {success.address}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              name="name"
              placeholder="My Creator Coin"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Symbol</label>
            <Input
              name="symbol"
              placeholder="MCC"
              value={formData.symbol}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Metadata URI</label>
            <Input
              name="uri"
              placeholder="ipfs://..."
              value={formData.uri}
              onChange={handleInputChange}
              disabled={loading}
            />
            <p className="text-sm text-gray-400 mt-1">
              Must be a valid IPFS URI starting with ipfs://
            </p>
          </div>
          <Button
            onClick={handleCreateCoin}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Coin"
            )}
          </Button>
        </div>
      </motion.div>
    </main>
  );
} 