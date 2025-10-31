// Solana configuration constants
export const SOLANA_CONFIG = {
  // Network configuration
  NETWORK: (import.meta.env.VITE_SOLANA_NETWORK as 'devnet' | 'mainnet-beta') || 'devnet',
  RPC_URL: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',

  // Program configuration
  // This should be replaced with the actual deployed program ID
  PROGRAM_ID: import.meta.env.VITE_VIRTUALIA_PROGRAM_ID || '11111111111111111111111111111111',

  // Commitment level for transactions
  COMMITMENT: 'confirmed' as const,
} as const;

// Validate program ID at startup
import { PublicKey } from '@solana/web3.js';

let validatedProgramId: PublicKey;

try {
  validatedProgramId = new PublicKey(SOLANA_CONFIG.PROGRAM_ID);
} catch (error) {
  console.error('Invalid VIRTUALIA_PROGRAM_ID in environment:', SOLANA_CONFIG.PROGRAM_ID);
  throw new Error('Invalid program ID configuration. Please check VITE_VIRTUALIA_PROGRAM_ID in your .env file');
}

export { validatedProgramId as PROGRAM_ID_VALIDATED };
