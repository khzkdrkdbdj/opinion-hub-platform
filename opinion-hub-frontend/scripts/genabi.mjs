#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const contractsRoot = join(projectRoot, '..', 'fhevm-hardhat-template');

// Contract deployment info
const deploymentPaths = {
  localhost: join(contractsRoot, 'deployments', 'localhost'),
  sepolia: join(contractsRoot, 'deployments', 'sepolia'),
};

// Output paths
const abiDir = join(projectRoot, 'abi');
const abiFile = join(abiDir, 'OpinionResearchPlatformABI.ts');
const addressFile = join(abiDir, 'OpinionResearchPlatformAddresses.ts');

function generateABI() {
  console.log('🔄 Generating ABI files...');

  try {
    // Read contract ABI from deployments
    let contractABI = null;
    let addresses = {};

    // Try to read from localhost first, then sepolia
    for (const [network, deploymentPath] of Object.entries(deploymentPaths)) {
      const contractFile = join(deploymentPath, 'OpinionResearchPlatform.json');
      
      if (existsSync(contractFile)) {
        console.log(`📄 Found contract deployment for ${network}`);
        const contractData = JSON.parse(readFileSync(contractFile, 'utf8'));
        
        if (!contractABI) {
          contractABI = contractData.abi;
        }
        
        addresses[network] = contractData.address;
      }
    }

    if (!contractABI) {
      console.log('⚠️  No contract deployments found. Using fallback ABI.');
      // Fallback ABI with basic structure
      contractABI = [
        {
          "type": "constructor",
          "inputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "launchSurvey",
          "inputs": [
            {"name": "_topic", "type": "string"},
            {"name": "_description", "type": "string"},
            {"name": "_choices", "type": "string[]"},
            {"name": "_launchTime", "type": "uint256"},
            {"name": "_closeTime", "type": "uint256"},
            {"name": "_isOpenAccess", "type": "bool"}
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "getSurveyInfo",
          "inputs": [{"name": "_surveyId", "type": "uint256"}],
          "outputs": [
            {"name": "topic", "type": "string"},
            {"name": "description", "type": "string"},
            {"name": "choices", "type": "string[]"},
            {"name": "researcher", "type": "address"},
            {"name": "launchTime", "type": "uint256"},
            {"name": "closeTime", "type": "uint256"},
            {"name": "isActive", "type": "bool"},
            {"name": "isOpenAccess", "type": "bool"},
            {"name": "totalResponses", "type": "uint256"}
          ],
          "stateMutability": "view"
        }
      ];
    }

    // Generate ABI file
    const abiContent = `// Auto-generated ABI file
// Generated at: ${new Date().toISOString()}

export const OpinionResearchPlatformABI = ${JSON.stringify(contractABI, null, 2)} as const;

export type OpinionResearchPlatformABI = typeof OpinionResearchPlatformABI;
`;

    // Generate addresses file
    const addressContent = `// Auto-generated addresses file
// Generated at: ${new Date().toISOString()}

export const OpinionResearchPlatformAddresses = ${JSON.stringify(addresses, null, 2)} as const;

export function getContractAddress(chainId: number): string | undefined {
  switch (chainId) {
    case 31337: // Localhost
      return OpinionResearchPlatformAddresses.localhost;
    case 11155111: // Sepolia
      return OpinionResearchPlatformAddresses.sepolia;
    default:
      return undefined;
  }
}
`;

    // Write files
    writeFileSync(abiFile, abiContent);
    writeFileSync(addressFile, addressContent);

    console.log('✅ ABI files generated successfully!');
    console.log(`📁 ABI: ${abiFile}`);
    console.log(`📁 Addresses: ${addressFile}`);
    
    if (Object.keys(addresses).length > 0) {
      console.log('🏠 Contract addresses:');
      for (const [network, address] of Object.entries(addresses)) {
        console.log(`   ${network}: ${address}`);
      }
    }

  } catch (error) {
    console.error('❌ Error generating ABI files:', error);
    process.exit(1);
  }
}

// Create abi directory if it doesn't exist
import { mkdirSync } from 'fs';
if (!existsSync(abiDir)) {
  mkdirSync(abiDir, { recursive: true });
}

generateABI();

