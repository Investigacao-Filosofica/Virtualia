import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Buffer } from "buffer";
import type { ContentType, EducationLevel, StorageProtocol } from "../components/MintedItemsContext";
import { SOLANA_CONFIG, PROGRAM_ID_VALIDATED } from "../config/solana";

// Import the IDL (versioned in frontend for build compatibility)
import { IDL } from "../idl/virtualia";

interface MintRequest {
  title: string;
  description: string;
  uri: string;
  contentType: ContentType;
  year: string;
  institution: string;
  educationLevel: EducationLevel | string;
  knowledgeArea: string;
  knowledgeSubarea: string;
  storageProtocol: StorageProtocol;
}

export interface MintResponse {
  rewardLamports: number;
  mintAddress: string;
  metadataSignature: string;
}

interface ContentMetadata {
  title: string;
  description: string;
  uri: string;
  contentType: string;
  rewardLamports: BN;
}

// Virtualia program ID - loaded from configuration
const PROGRAM_ID = PROGRAM_ID_VALIDATED;

/**
 * Initialize the Virtualia program
 */
const getVirtualiaProgram = (connection: Connection, wallet: any): Program => {
  try {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });

    return new Program(IDL as any, PROGRAM_ID, provider);
  } catch (error) {
    console.error("Failed to initialize Virtualia program:", error);
    throw new Error("Failed to initialize blockchain connection");
  }
};

/**
 * Initialize user profile if it doesn't exist
 */
export const initializeUserProfile = async (
  connection: Connection,
  wallet: any
): Promise<string> => {
  try {
    if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet not connected");
    }

    const program = getVirtualiaProgram(connection, wallet);
    const publicKey = wallet.publicKey;

    const [profilePda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), publicKey.toBuffer()],
      PROGRAM_ID
    );

    try {
      // Check if profile already exists
      await program.account.profile.fetch(profilePda);
      return profilePda.toBase58(); // Already exists
    } catch (fetchError: any) {
      // Check if error is because account doesn't exist vs network error
      // If account doesn't exist, error code will be specific
      // If it's a network/RPC error, we should throw it properly
      
      // Account not found - safe to initialize
      if (fetchError.code === -32602 || fetchError.message?.includes("Account does not exist") || fetchError.message?.includes("Invalid param")) {
        try {
          // Profile doesn't exist, initialize it
          const tx = await program.methods
            .initializeUser(bump)
            .accounts({
              authority: publicKey,
              profile: profilePda,
              systemProgram: SystemProgram.programId,
            })
            .rpc();

          return profilePda.toBase58();
        } catch (initError: any) {
          // If initialization fails with "already in use", profile was created concurrently
          // or fetch failed but account exists - try to fetch again
          
          // Check all possible locations where "already in use" error might appear
          const hasAlreadyInUseError = 
            initError.message?.includes("already in use") || 
            initError.logs?.some((log: string) => log.includes("already in use")) ||
            initError.transactionLogs?.some((log: string) => log.includes("already in use")) ||
            JSON.stringify(initError).includes("already in use");
          
          if (hasAlreadyInUseError) {
            try {
              // Account exists, fetch it
              await program.account.profile.fetch(profilePda);
              return profilePda.toBase58();
            } catch (refetchError) {
              // If fetch still fails, throw the original init error
              console.error("Profile initialization failed:", initError);
              console.error("Refetch also failed:", refetchError);
              throw initError;
            }
          }
          // Otherwise, throw the initialization error
          console.error("Profile initialization failed:", initError);
          throw initError;
        }
      } else {
        // Network/RPC error or other issue - rethrow
        console.error("Failed to fetch profile:", fetchError);
        throw fetchError;
      }
    }
  } catch (error) {
    console.error("Failed to initialize user profile:", error);
    // Re-throw the original error, don't mask it
    throw error;
  }
};

/**
 * Mint content on the Solana blockchain
 */
export const mintContent = async (
  connection: Connection,
  wallet: any,
  payload: MintRequest
): Promise<MintResponse> => {
  // Check if using System Program (placeholder) - use mock instead
  if (PROGRAM_ID.toBase58() === "11111111111111111111111111111111") {
    console.warn("⚠️ Using mock mint - Deploy contract and update VITE_VIRTUALIA_PROGRAM_ID");
    return mintContentMockInternal(connection, wallet, payload);
  }

  try {
    if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet not connected");
    }

    const program = getVirtualiaProgram(connection, wallet);
    const publicKey = wallet.publicKey;

    // Ensure user profile exists
    await initializeUserProfile(connection, wallet);

    // Get profile account to determine the next content index
    const [profilePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), publicKey.toBuffer()],
      PROGRAM_ID
    );

    const profileAccount = await program.account.profile.fetch(profilePda);
    const currentTotalMints = (profileAccount.totalMints as any).toNumber();

    // Generate content PDA
    const [contentPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("content"),
        publicKey.toBuffer(),
        new BN(currentTotalMints).toArrayLike(Buffer, "le", 8)
      ],
      PROGRAM_ID
    );

    // Prepare metadata
    const metadata: ContentMetadata = {
      title: payload.title,
      description: payload.description,
      uri: payload.uri,
      contentType: payload.contentType,
      rewardLamports: new BN(1_000_000), // 0.001 SOL reward
    };

    // Mint the content
    const txSignature = await program.methods
      .mintContent(metadata)
      .accounts({
        authority: publicKey,
        profile: profilePda,
        content: contentPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return {
      rewardLamports: metadata.rewardLamports.toNumber(),
      mintAddress: contentPda.toBase58(),
      metadataSignature: txSignature,
    };
  } catch (error) {
    console.error("Failed to mint content:", error);
    // Re-throw the original error, don't mask it
    throw error;
  }
};

/**
 * Internal mock function for testing without deployed contract
 * This is called automatically by mintContent when Program ID is placeholder
 */
const mintContentMockInternal = async (
  _connection: Connection,
  wallet: any,
  payload: MintRequest
): Promise<MintResponse> => {
  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }
  
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const simulatedReward = 0.02 + Math.random() * 0.03;
  const rewardLamports = simulatedReward * 1_000_000_000;
  const mintAddress = `Mock${Array.from({ length: 3 })
    .map(() => Math.random().toString(36).slice(2, 12))
    .join("")
    .slice(0, 32)}`;
  const metadataSignature = `MockSig${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36)}`;

  return {
    rewardLamports,
    mintAddress,
    metadataSignature,
  };
};
