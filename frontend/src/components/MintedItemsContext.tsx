import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type ContentType = "artigo" | "resenha" | "tradução" | "certificado" | "outro";
export type StorageProtocol = "ipfs" | "arweave";

export type EducationLevel =
  | "extensão"
  | "graduação"
  | "pós-graduação"
  | "pesquisa"
  | "outro";

export interface MintedItem {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  uri: string;
  reward: number;
  ownerAddress: string;
  mintedAt: string;
  year: string;
  institution: string;
  educationLevel: EducationLevel | string;
  knowledgeArea: string;
  knowledgeSubarea: string;
  storageProtocol: StorageProtocol;
  mintAddress: string;
  metadataSignature: string;
}

interface MintedItemContextValue {
  items: MintedItem[];
  addItem: (item: MintedItem) => void;
}

const MintedItemContext = createContext<MintedItemContextValue | undefined>(undefined);

export const MintedItemProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<MintedItem[]>([]);

  const value = useMemo(
    () => ({
      items,
      addItem: (item: MintedItem) => setItems((prev) => [item, ...prev]),
    }),
    [items]
  );

  return <MintedItemContext.Provider value={value}>{children}</MintedItemContext.Provider>;
};

export const useMintedItems = () => {
  const context = useContext(MintedItemContext);
  if (!context) {
    throw new Error("useMintedItems must be used within a MintedItemProvider");
  }
  return context;
};
