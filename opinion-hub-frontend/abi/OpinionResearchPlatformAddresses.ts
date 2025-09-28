// Auto-generated addresses file
// Generated at: 2025-09-28T17:36:33.680Z

export const OpinionResearchPlatformAddresses = {
  "localhost": "0x5c653ca4AeA7F2Da07f0AABf75F85766EAFDA615",
  "sepolia": "0x19F3581962E2D120107F0aF7817e7cdb32369Be6"
} as const;

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
