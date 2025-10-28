import type { StorageProtocol } from "../components/MintedItemsContext";

export interface UploadResult {
  uri: string;
  filename: string;
  protocol: StorageProtocol;
}

const createSyntheticHash = () =>
  Array.from({ length: 4 })
    .map(() => Math.random().toString(36).slice(2, 12))
    .join("")
    .slice(0, 46);

export const uploadToDecentralizedStorage = async (
  file: File,
  protocol: StorageProtocol
): Promise<UploadResult> => {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const syntheticHash = createSyntheticHash();

  if (protocol === "arweave") {
    return {
      uri: `https://arweave.net/${syntheticHash}`,
      filename: file.name,
      protocol,
    };
  }

  return {
    uri: `ipfs://${syntheticHash}/${encodeURIComponent(file.name)}`,
    filename: file.name,
    protocol,
  };
};
