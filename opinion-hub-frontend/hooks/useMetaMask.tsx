"use client";

import { useState, useEffect, useCallback } from "react";

export interface MetaMaskState {
  provider: any;
  chainId: number | null;
  accounts: string[] | null;
  isConnected: boolean;
  ethersSigner: any;
  ethersReadonlyProvider: any;
  sameChain: boolean;
  sameSigner: boolean;
  initialMockChains: any;
  status: "idle" | "connecting" | "connected" | "disconnected";
  error: Error | null;
}

export function useMetaMask(): MetaMaskState & {
  connect: () => Promise<void>;
  disconnect: () => void;
} {
  const [state, setState] = useState<MetaMaskState>({
    provider: null,
    chainId: null,
    accounts: null,
    isConnected: false,
    ethersSigner: null,
    ethersReadonlyProvider: null,
    sameChain: true,
    sameSigner: true,
    initialMockChains: null,
    status: "idle",
    error: null,
  });

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          
          if (accounts.length > 0) {
            const chainId = await window.ethereum.request({
              method: "eth_chainId",
            });
            
            // Create ethers provider and signer for existing connection
            const ethersProvider = new (await import("ethers")).BrowserProvider(window.ethereum);
            const ethersSigner = await ethersProvider.getSigner();

            setState(prev => ({
              ...prev,
              provider: window.ethereum,
              chainId: parseInt(chainId, 16),
              accounts,
              isConnected: true,
              ethersSigner,
              ethersReadonlyProvider: ethersProvider,
              status: "connected",
              error: null,
            }));
          }
        } catch (error) {
          console.error("Failed to check existing connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, status: "connecting", error: null }));
    
    try {
      // Check if MetaMask is installed
      if (typeof window !== "undefined" && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        
        // Create ethers provider and signer
        const ethersProvider = new (await import("ethers")).BrowserProvider(window.ethereum);
        const ethersSigner = await ethersProvider.getSigner();

        setState(prev => ({
          ...prev,
          provider: window.ethereum,
          chainId: parseInt(chainId, 16),
          accounts,
          isConnected: true,
          ethersSigner,
          ethersReadonlyProvider: ethersProvider,
          status: "connected",
          error: null,
        }));
      } else {
        throw new Error("MetaMask is not installed");
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: "disconnected",
        error: error as Error,
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      provider: null,
      chainId: null,
      accounts: null,
      isConnected: false,
      ethersSigner: null,
      ethersReadonlyProvider: null,
      sameChain: true,
      sameSigner: true,
      initialMockChains: null,
      status: "disconnected",
      error: null,
    });
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setState(prev => ({
            ...prev,
            accounts,
            isConnected: true,
          }));
        }
      };

      const handleChainChanged = (chainId: string) => {
        setState(prev => ({
          ...prev,
          chainId: parseInt(chainId, 16),
        }));
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
  };
}

