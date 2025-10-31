import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import type { ContentType, EducationLevel, StorageProtocol } from "../components/MintedItemsContext";
import { SOLANA_CONFIG, PROGRAM_ID_VALIDATED } from "../config/solana";

// Import the IDL (this would be generated from the Anchor program)
import { IDL } from "../../../contracts/target/types/virtualia";

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
    } catch {
      // Profile doesn't exist, initialize it
      const tx = await program.methods
        .initializeUser(bump)
        .accounts({
          authority: publicKey,
          profile: profilePda,
        })
        .rpc();

      return profilePda.toBase58();
    }
  } catch (error) {
    console.error("Failed to initialize user profile:", error);
    throw new Error("Failed to initialize user profile on blockchain");
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
  try {
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
      })
      .rpc();

    return {
      rewardLamports: metadata.rewardLamports.toNumber(),
      mintAddress: contentPda.toBase58(),
      metadataSignature: txSignature,
    };
  } catch (error) {
    console.error("Failed to mint content:", error);
    throw new Error(`Failed to mint content on blockchain: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Legacy mock function - kept for backward compatibility during transition
 * TODO: Remove this once all references are updated to use mintContent
 */
export const mintContentMock = mintContent;
