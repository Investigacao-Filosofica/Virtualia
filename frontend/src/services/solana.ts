import type { Connection, PublicKey } from "@solana/web3.js";
import type { ContentType, EducationLevel, StorageProtocol } from "../components/MintedItemsContext";

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

/**
 * TODO: substituir por chamada real ao programa Anchor.
 * Atualmente simula a interação e retorna recompensa fictícia.
 */
export const mintContentMock = async (
  _connection: Connection,
  _authority: PublicKey,
  payload: MintRequest
): Promise<MintResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const simulatedReward = 0.02 + Math.random() * 0.03;
  const rewardLamports = simulatedReward * 1_000_000_000;
  const mintAddress = `Mint${Array.from({ length: 3 })
    .map(() => Math.random().toString(36).slice(2, 12))
    .join("")
    .slice(0, 32)}`;
  const metadataSignature = `Sig${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36)}`;

  return {
    rewardLamports,
    mintAddress,
    metadataSignature,
  };
};
