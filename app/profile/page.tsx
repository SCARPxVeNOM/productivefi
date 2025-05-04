'use client';

import React, { useEffect, useState } from "react";
import { updateCoinURI, updatePayoutRecipient } from "@zoralabs/coins-sdk";
import { useAccount, useWalletClient } from "wagmi";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { WalletDisplay } from "@/components/client/WalletDisplay";

interface Coin {
  address: `0x${string}`;
  name: string;
  symbol: string;
  uri?: string;
}

// Mock the missing profileCoins function
const profileCoins = async ({ address }: { address: string | `0x${string}` }): Promise<{ coins: Coin[] }> => {
  // Return empty array for now as this is a mock
  return {
    coins: []
  };
};

interface EditState {
  newUri: string;
  newPayout: string;
}

export default function ProfilePage() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = createPublicClient({ 
    chain: base, 
    transport: http() 
  });

  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<Record<string, EditState>>({});

  useEffect(() => {
    if (!address) return;
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await profileCoins({ address: address });
        setCoins(result.coins || []);
        const editMap: Record<string, EditState> = {};
        for (const coin of result.coins) {
          editMap[coin.address] = { 
            newUri: coin.uri || "", 
            newPayout: address 
          };
        }
        setEditStates(editMap);
      } catch (err) {
        console.error("Failed to load profile coins", err);
        setError("Failed to load your coins. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [address]);

  const handleUpdate = async (coin: Coin) => {
    if (!walletClient || !address) {
      setError("Please connect your wallet first");
      return;
    }

    const updates = editStates[coin.address];
    if (!updates.newUri || !updates.newPayout) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await updateCoinURI(
        {
          coin: coin.address,
          newURI: updates.newUri,
        },
        walletClient,
        publicClient
      );
      const newPayoutAddress = updates.newPayout as `0x${string}`;
      await updatePayoutRecipient(
        {
          coin: coin.address,
          newPayoutRecipient: newPayoutAddress,
        },
        walletClient,
        publicClient
      );
      const result = await profileCoins({ address: address });
      setCoins(result.coins || []);
    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to update coin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <main className="min-h-screen bg-black text-white py-16 px-6">
        <Alert variant="destructive">
          <AlertDescription>Please connect your wallet to view your coins</AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white py-16 px-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Your Created Coins</h1>
        <WalletDisplay />
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && coins.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : coins.length === 0 ? (
        <Alert>
          <AlertDescription>You haven't created any coins yet</AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coins.map((coin) => (
            <Card key={coin.address} className="bg-gray-900 border border-gray-700">
              <CardContent className="p-4">
                <p className="text-lg font-semibold mb-2">{coin.name} ({coin.symbol})</p>
                <p className="text-xs text-gray-400 mb-4 truncate">{coin.address}</p>
                <div className="space-y-2">
                  <Input
                    placeholder="New Metadata URI"
                    value={editStates[coin.address]?.newUri || ""}
                    onChange={(e) =>
                      setEditStates((prev) => ({
                        ...prev,
                        [coin.address]: {
                          ...prev[coin.address],
                          newUri: e.target.value,
                        },
                      }))
                    }
                    disabled={loading}
                  />
                  <Input
                    placeholder="New Payout Recipient"
                    value={editStates[coin.address]?.newPayout || ""}
                    onChange={(e) =>
                      setEditStates((prev) => ({
                        ...prev,
                        [coin.address]: {
                          ...prev[coin.address],
                          newPayout: e.target.value,
                        },
                      }))
                    }
                    disabled={loading}
                  />
                  <Button
                    onClick={() => handleUpdate(coin)}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {loading ? "Updating..." : "Update Coin"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
} 