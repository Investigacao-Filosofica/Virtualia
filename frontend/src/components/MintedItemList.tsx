import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";
import { useMintedItems, ContentType } from "./MintedItemsContext";

interface MintedItemListProps {
  searchTerm?: string;
}

const categoryLabels: Record<ContentType, string> = {
  artigo: "Artigos e papers",
  resenha: "Resenhas e recensões",
  tradução: "Traduções publicadas",
  certificado: "Certificados e formações",
  outro: "Outras produções",
};

const MintedItemList = ({ searchTerm = "" }: MintedItemListProps) => {
  const { items } = useMintedItems();

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const groupedItems = useMemo(() => {
    const matchesSearch = (value: string | number | undefined) => {
      if (!normalizedSearch) return true;
      if (!value) return false;
      return value.toString().toLowerCase().includes(normalizedSearch);
    };

    return items.reduce<Record<ContentType, typeof items>>((accumulator, item) => {
      const candidateFields = [
        item.title,
        item.description,
        item.institution,
        item.knowledgeArea,
        item.knowledgeSubarea,
        item.educationLevel,
        item.ownerAddress,
        item.mintAddress,
        item.metadataSignature,
        item.year,
      ];

      if (normalizedSearch && !candidateFields.some(matchesSearch)) {
        return accumulator;
      }

      if (!accumulator[item.contentType]) {
        accumulator[item.contentType] = [];
      }

      accumulator[item.contentType].push(item);
      return accumulator;
    }, {
      artigo: [],
      resenha: [],
      tradução: [],
      certificado: [],
      outro: [],
    });
  }, [items, normalizedSearch]);

  const hasAnyItem = useMemo(
    () => Object.values(groupedItems).some((collection) => collection.length > 0),
    [groupedItems]
  );

  if (!hasAnyItem) {
    return (
      <div className="empty-state">
        <h3>Nenhum NFT encontrado</h3>
        <p>Comece mintando produções para popular sua vitrine acadêmica.</p>
      </div>
    );
  }

  return (
    <div className="profile-categories">
      {Object.entries(groupedItems).map(([category, entries]) => {
        if (!entries.length) {
          return null;
        }

        return (
          <section key={category} className="category-section">
            <header className="category-header">
              <h3>{categoryLabels[category as ContentType]}</h3>
              <span className="badge">{entries.length}</span>
            </header>
            <div className="category-row">
              {entries.map((item) => (
                <article key={item.id} className="minted-card">
                  <header>
                    <div>
                      <strong>{item.title}</strong>
                      <p className="minted-meta">
                        {item.year} · {item.institution} · {item.educationLevel}
                      </p>
                    </div>
                    <span className="badge badge--success">+{item.reward.toFixed(4)} SOL</span>
                  </header>
                  <p>{item.description || "Sem descrição adicionada."}</p>
                  <p className="minted-meta">
                    Área do conhecimento: {item.knowledgeArea} · {item.knowledgeSubarea}
                  </p>
                  <p className="minted-meta">
                    Protocolo: {item.storageProtocol.toUpperCase()} · NFT {shorten(item.mintAddress)}
                  </p>
                  <p className="minted-meta">Tx: {shorten(item.metadataSignature)}</p>
                  <footer>
                    <a href={item.uri} target="_blank" rel="noreferrer">
                      Abrir mídia on-chain ↗
                    </a>
                    <span>{format(new Date(item.mintedAt), "dd/MM/yyyy", { locale: ptBR })}</span>
                    <span className="minted-owner">Autor: {shorten(item.ownerAddress)}</span>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

const shorten = (value: string) => {
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
};

export default MintedItemList;
