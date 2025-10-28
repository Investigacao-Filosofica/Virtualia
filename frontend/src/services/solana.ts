import type { Connection, PublicKey } from "@solana/web3.js";
import type { ContentType } from "../components/MintedItemsContext";

interface MintRequest {
  title: string;
  description: string;
  uri: string;
  contentType: ContentType;
}

/**
 * TODO: substituir por chamada real ao programa Anchor.
 * Atualmente simula a interação e retorna recompensa fictícia.
 */
export const mintContentMock = async (
  _connection: Connection,
  _authority: PublicKey,
  _payload: MintRequest
): Promise<number> => {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const simulatedReward = 0.02 + Math.random() * 0.03;
  return simulatedReward * 1_000_000_000; // lamports
};
