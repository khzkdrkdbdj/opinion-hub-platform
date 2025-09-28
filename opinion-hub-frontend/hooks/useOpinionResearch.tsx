"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { OpinionResearchPlatformABI } from "@/abi/OpinionResearchPlatformABI";
import { getContractAddress } from "@/abi/OpinionResearchPlatformAddresses";
import type { FhevmInstance } from "@/fhevm/fhevmTypes";

// Types
export interface SurveyInfo {
  id: number;
  topic: string;
  description: string;
  choices: string[];
  researcher: string;
  launchTime: number;
  closeTime: number;
  isActive: boolean;
  isOpenAccess: boolean;
  totalResponses: number;
}

export type SurveyStatus = "active" | "closed" | "upcoming";

export interface SurveyResults {
  surveyId: number;
  results: number[];
  isDecrypted: boolean;
}

export function useOpinionResearch(config: {
  instance?: FhevmInstance;
  fhevmDecryptionSignatureStorage?: any;
  eip1193Provider?: any;
  chainId?: number;
  ethersSigner?: any;
  ethersReadonlyProvider?: any;
  sameChain?: boolean;
  sameSigner?: boolean;
}) {
  const [surveys, setSurveys] = useState<SurveyInfo[]>([]);
  const [surveyResults, setSurveyResults] = useState<Map<number, SurveyResults>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [message, setMessage] = useState<string>("");

  const contractAddress = getContractAddress(config.chainId || 31337);
  const isDeployed = !!contractAddress;
  const canInteract = isDeployed && (config.ethersSigner || config.ethersReadonlyProvider);

  // Load surveys from contract
  const loadSurveys = useCallback(async () => {
    if (!canInteract || !contractAddress) return;

    setIsLoading(true);
    try {
      const provider = config.ethersReadonlyProvider || config.ethersSigner?.provider;
      if (!provider) return;

      const contract = new ethers.Contract(contractAddress, OpinionResearchPlatformABI, provider);
      
      // Get total surveys count
      const totalSurveys = await contract.getTotalSurveys();
      const surveyList: SurveyInfo[] = [];

      // Load each survey
      for (let i = 0; i < Number(totalSurveys); i++) {
        try {
          const surveyInfo = await contract.getSurveyInfo(i);
          
          surveyList.push({
            id: i,
            topic: surveyInfo.topic,
            description: surveyInfo.description,
            choices: surveyInfo.choices,
            researcher: surveyInfo.researcher,
            launchTime: Number(surveyInfo.launchTime),
            closeTime: Number(surveyInfo.closeTime),
            isActive: surveyInfo.isActive,
            isOpenAccess: surveyInfo.isOpenAccess,
            totalResponses: Number(surveyInfo.totalResponses),
          });
        } catch (error) {
          console.error(`Failed to load survey ${i}:`, error);
        }
      }

      setSurveys(surveyList);
      setMessage(`Loaded ${surveyList.length} surveys from contract`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to load surveys:", error);
      setMessage("Failed to load surveys from contract");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [canInteract, contractAddress, config.ethersReadonlyProvider, config.ethersSigner]);

  // Load surveys on mount and when dependencies change
  useEffect(() => {
    loadSurveys();
  }, [loadSurveys]);

  const refreshSurveys = useCallback(async () => {
    await loadSurveys();
  }, [loadSurveys]);

  const launchSurvey = useCallback(async (
    topic: string,
    description: string,
    choices: string[],
    launchTime: number,
    closeTime: number,
    isOpenAccess: boolean
  ) => {
    if (!config.ethersSigner || !contractAddress) {
      throw new Error("Wallet not connected or contract not deployed");
    }

    setIsCreating(true);
    try {
      const contract = new ethers.Contract(contractAddress, OpinionResearchPlatformABI, config.ethersSigner);
      
      const tx = await contract.launchSurvey(
        topic,
        description,
        choices,
        launchTime,
        closeTime,
        isOpenAccess
      );
      
      await tx.wait();
      
      setMessage("Survey launched successfully!");
      setTimeout(() => setMessage(""), 3000);
      
      // Reload surveys
      await loadSurveys();
    } catch (error) {
      console.error("Failed to launch survey:", error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [config.ethersSigner, contractAddress, loadSurveys]);

  const submitResponse = useCallback(async (surveyId: number, choiceIndex: number) => {
    if (!config.ethersSigner || !contractAddress || !config.instance) {
      throw new Error("Wallet not connected, contract not deployed, or FHEVM not ready");
    }

    setIsParticipating(true);
    setMessage("Preparing encrypted response...");

    try {
      const contract = new ethers.Contract(contractAddress, OpinionResearchPlatformABI, config.ethersSigner);
      
      // Create encrypted input using FHEVM
      const input = config.instance.createEncryptedInput(
        contractAddress,
        config.ethersSigner.address
      );
      input.add8(choiceIndex);

      setMessage("Encrypting response...");
      const encryptedInput = await input.encrypt();

      setMessage("Submitting response...");
      
      // Submit the encrypted response
      const tx = await contract.submitResponse(
        surveyId,
        encryptedInput.handles[0],
        encryptedInput.inputProof
      );
      
      setMessage(`Transaction submitted: ${tx.hash}`);
      const receipt = await tx.wait();
      setMessage("Response submitted successfully!");
      
      // Reload surveys to update response count
      setTimeout(() => loadSurveys(), 1000);
      
      return receipt;
    } catch (error) {
      console.error("Failed to submit response:", error);
      setMessage("Failed to submit response");
      throw error;
    } finally {
      setIsParticipating(false);
    }
  }, [config.ethersSigner, config.instance, contractAddress, loadSurveys]);

  const closeSurvey = useCallback(async (surveyId: number) => {
    setIsLoading(true);
    try {
      // Simulate survey closure
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSurveys(prev => prev.map(survey => 
        survey.id === surveyId 
          ? { ...survey, isActive: false }
          : survey
      ));
      
      setMessage("Survey closed successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to close survey:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const decryptSurveyResults = useCallback(async (surveyId: number) => {
    if (!config.instance || !contractAddress || !config.ethersSigner) {
      throw new Error("FHEVM not ready, contract not deployed, or wallet not connected");
    }

    setIsLoading(true);
    setMessage("Preparing to decrypt results...");

    try {
      const contract = new ethers.Contract(contractAddress, OpinionResearchPlatformABI, config.ethersSigner);
      const survey = surveys.find(s => s.id === surveyId);
      
      if (!survey) {
        throw new Error("Survey not found");
      }

      // Check if user is the researcher (creator)
      const isResearcher = survey.researcher.toLowerCase() === config.ethersSigner.address.toLowerCase();
      
      if (!isResearcher) {
        // If not researcher, make results public first
        setMessage("Making results public...");
        const makePublicTx = await contract.publishInsights(surveyId);
        setMessage(`Transaction submitted: ${makePublicTx.hash}`);
        await makePublicTx.wait();
      }

      setMessage("Preparing decryption...");

      // Get decryption signature
      const { FhevmDecryptionSignature } = await import("@/fhevm/FhevmDecryptionSignature");
      
      const sig = await FhevmDecryptionSignature.loadOrSign(
        config.instance,
        [contractAddress as `0x${string}`],
        config.ethersSigner,
        config.fhevmDecryptionSignatureStorage
      );

      if (!sig) {
        setMessage("Unable to build FHEVM decryption signature");
        throw new Error("Unable to build FHEVM decryption signature");
      }

      setMessage("Decrypting results...");

      // Get encrypted response counts and decrypt them
      const decryptPromises = [];
      for (let i = 0; i < survey.choices.length; i++) {
        const encryptedCount = await contract.getEncryptedResponseCount(surveyId, i);
        if (encryptedCount !== ethers.ZeroHash) {
          decryptPromises.push(
            config.instance.userDecrypt(
              [{ handle: encryptedCount, contractAddress: contractAddress }],
              sig.privateKey,
              sig.publicKey,
              sig.signature,
              sig.contractAddresses,
              sig.userAddress,
              sig.startTimestamp,
              sig.durationDays
            ).then(result => Number(result[encryptedCount]))
          );
        } else {
          decryptPromises.push(Promise.resolve(0));
        }
      }

      const decryptedResults = await Promise.all(decryptPromises);

      const results: SurveyResults = {
        surveyId,
        results: decryptedResults,
        isDecrypted: true,
      };
      
      setSurveyResults(prev => new Map(prev.set(surveyId, results)));
      setMessage("Results decrypted successfully!");
      setTimeout(() => setMessage(""), 3000);
      
      return results;
    } catch (error) {
      console.error("Failed to decrypt results:", error);
      setMessage("Failed to decrypt results");
      setTimeout(() => setMessage(""), 3000);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [config.instance, contractAddress, config.ethersSigner, config.fhevmDecryptionSignatureStorage, config.chainId, surveys]);

  const hasParticipated = useCallback(async (surveyId: number, address: string): Promise<boolean> => {
    if (!contractAddress) return false;
    
    try {
      const provider = config.ethersReadonlyProvider || config.ethersSigner?.provider;
      if (!provider) return false;

      const contract = new ethers.Contract(contractAddress, OpinionResearchPlatformABI, provider);
      return await contract.hasResponded(surveyId, address);
    } catch (error) {
      console.error("Failed to check participation status:", error);
      return false;
    }
  }, [contractAddress, config.ethersReadonlyProvider, config.ethersSigner]);

  const canParticipate = useCallback(async (surveyId: number, address: string): Promise<boolean> => {
    if (!contractAddress) return false;
    
    try {
      const provider = config.ethersReadonlyProvider || config.ethersSigner?.provider;
      if (!provider) return false;

      const contract = new ethers.Contract(contractAddress, OpinionResearchPlatformABI, provider);
      return await contract.canParticipateInSurvey(surveyId, address);
    } catch (error) {
      console.error("Failed to check participation eligibility:", error);
      return false;
    }
  }, [contractAddress, config.ethersReadonlyProvider, config.ethersSigner]);

  const getSurveyStatus = useCallback((survey: SurveyInfo): SurveyStatus => {
    const now = Math.floor(Date.now() / 1000);
    
    if (now < survey.launchTime) {
      return "upcoming";
    } else if (now > survey.closeTime || !survey.isActive) {
      return "closed";
    } else {
      return "active";
    }
  }, []);

  return {
    // Contract info
    contractAddress,
    isDeployed,
    canInteract,
    
    // Data
    surveys,
    surveyResults,
    
    // Loading states
    isLoading,
    isCreating,
    isParticipating,
    message,
    
    // Actions
    refreshSurveys,
    launchSurvey,
    submitResponse,
    closeSurvey,
    decryptSurveyResults,
    hasParticipated,
    canParticipate,
    getSurveyStatus,
    
    // Access management
    grantAccess: useCallback(async (surveyId: number, addresses: string[]) => {
      if (!config.ethersSigner || !contractAddress) {
        throw new Error("Wallet not connected or contract not deployed");
      }

      const contract = new ethers.Contract(contractAddress, OpinionResearchPlatformABI, config.ethersSigner);
      const tx = await contract.grantAccess(surveyId, addresses);
      await tx.wait();
      
      setMessage(`Access granted to ${addresses.length} address${addresses.length > 1 ? 'es' : ''}`);
      setTimeout(() => setMessage(""), 3000);
    }, [config.ethersSigner, contractAddress]),

    revokeAccess: useCallback(async (surveyId: number, addresses: string[]) => {
      if (!config.ethersSigner || !contractAddress) {
        throw new Error("Wallet not connected or contract not deployed");
      }

      const contract = new ethers.Contract(contractAddress, OpinionResearchPlatformABI, config.ethersSigner);
      const tx = await contract.revokeAccess(surveyId, addresses);
      await tx.wait();
      
      setMessage(`Access revoked from ${addresses.length} address${addresses.length > 1 ? 'es' : ''}`);
      setTimeout(() => setMessage(""), 3000);
    }, [config.ethersSigner, contractAddress]),
  };
}

