import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMintedItems } from "./MintedItemsContext";

const MintedItemList = () => {
  const { items } = useMintedItems();

  if (!items.length) {
    return (
      <div>
        <h2>Repositório on-chain</h2>
        <p>Ainda não há conteúdos mintados. Seja o pioneiro!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Repositório on-chain</h2>
      <div className="minted-list">
        {items.map((item) => (
          <article key={item.id} className="minted-card">
            <header>
              <strong>{item.title}</strong>
              <span className="badge">
                {item.contentType} · {formatDistanceToNow(new Date(item.mintedAt), { locale: ptBR })} atrás
              </span>
            </header>
            <p>{item.description || "Sem descrição adicionada."}</p>
            <p>
              <span className="badge badge--success">+{item.reward.toFixed(4)} SOL</span>
            </p>
            <p>
              <a href={item.uri} target="_blank" rel="noreferrer">
                Ver arquivo
              </a>
            </p>
            {item.owner && <small>Autor: {item.owner.toBase58()}</small>}
          </article>
        ))}
      </div>
    </div>
  );
};

export default MintedItemList;
