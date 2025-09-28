#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function checkHardhatNode() {
  try {
    const { ethers } = await import('ethers');
    
    console.log('🔍 Checking if Hardhat node is running...');
    
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    
    // Try to get the network
    const network = await provider.getNetwork();
    
    if (network.chainId === 31337n) {
      console.log('✅ Hardhat node is running on localhost:8545');
      console.log(`📊 Chain ID: ${network.chainId}`);
      
      // Get block number to confirm it's responsive
      const blockNumber = await provider.getBlockNumber();
      console.log(`🧱 Current block: ${blockNumber}`);
      
      process.exit(0);
    } else {
      console.log(`⚠️  Node is running but chain ID is ${network.chainId}, expected 31337`);
      process.exit(1);
    }
    
  } catch (error) {
    console.log('❌ Hardhat node is not running or not accessible');
    console.log('💡 Start it with: npx hardhat node');
    console.log(`🔧 Error: ${error.message}`);
    process.exit(1);
  }
}

checkHardhatNode();

