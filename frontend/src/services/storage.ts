import type { StorageProtocol } from "../components/MintedItemsContext";

export interface UploadResult {
  uri: string;
  filename: string;
  protocol: StorageProtocol;
}

const PINATA_ENDPOINT = "https://api.pinata.cloud/pinning/pinFileToIPFS";

const resolvePinataJwt = (): string | undefined => {
  const env = import.meta.env as Record<string, string | undefined>;
  return env.VITE_PINATA_JWT ?? env.PINATA_JWT;
};

const createPinataFormData = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "pinataMetadata",
    JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedBy: "virtualia-frontend",
      },
    })
  );
  return formData;
};

export const uploadToDecentralizedStorage = async (
  file: File,
  protocol: StorageProtocol
): Promise<UploadResult> => {
  const pinataJwt = resolvePinataJwt();
  if (!pinataJwt) {
    throw new Error("PINATA_JWT não configurado. Defina VITE_PINATA_JWT no arquivo .env.");
  }

  const body = createPinataFormData(file);

  const response = await fetch(PINATA_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pinataJwt}`,
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Erro desconhecido no Pinata.");
    throw new Error(`Falha ao enviar arquivo: ${response.status} - ${errorText}`);
  }

  const payload: { IpfsHash: string } = await response.json();
  const encodedName = encodeURIComponent(file.name);

  return {
    uri: `ipfs://${payload.IpfsHash}/${encodedName}`,
    filename: file.name,
    protocol: "ipfs",
  };
};
