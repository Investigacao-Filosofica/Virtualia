import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { v4 as uuid } from "uuid";
import { useMintedItems, ContentType } from "./MintedItemsContext";
import { mintContentMock } from "../services/solana";

const contentOptions: { value: ContentType; label: string }[] = [
  { value: "artigo", label: "Artigo" },
  { value: "resenha", label: "Resenha" },
  { value: "tradução", label: "Tradução" },
  { value: "certificado", label: "Certificado" },
  { value: "outro", label: "Outro" },
];

const MintForm = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { addItem } = useMintedItems();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uri, setUri] = useState("");
  const [contentType, setContentType] = useState<ContentType>("artigo");
  const [loading, setLoading] = useState(false);
  const isDisabled = useMemo(() => loading || !publicKey || !title || !uri, [loading, publicKey, title, uri]);

  const handleMint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publicKey) {
      return;
    }

    try {
      setLoading(true);
      const rewardLamports = await mintContentMock(connection, publicKey, {
        title,
        description,
        uri,
        contentType,
      });

      addItem({
        id: uuid(),
        title,
        description,
        uri,
        contentType,
        reward: rewardLamports / LAMPORTS_PER_SOL,
        owner: publicKey,
        mintedAt: new Date().toISOString(),
      });

      setTitle("");
      setDescription("");
      setUri("");
      setContentType("artigo");
    } catch (error) {
      console.error("Falha ao mintar conteúdo", error);
      // Substituir por toast/alert na UI real.
      alert("Não foi possível mintar. Verifique o console para detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Nesta fase inicial utilizamos um placeholder para simular upload.
    const fakeCdnUrl = `https://example.com/uploads/${encodeURIComponent(file.name)}`;
    setUri(fakeCdnUrl);
  };

  return (
    <form onSubmit={handleMint}>
      <h2>Mintar conteúdo</h2>
      <p>Cadastre artigos, traduções, cursos e certificados diretamente na blockchain.</p>
      <div className="input-group">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex.: Introdução à Computação Quântica"
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Contextualize o conteúdo em até 400 caracteres"
          rows={4}
        />
      </div>
      <div className="input-group">
        <label htmlFor="contentType">Categoria</label>
        <select id="contentType" value={contentType} onChange={(event) => setContentType(event.target.value as ContentType)}>
          {contentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
        <label htmlFor="uri">Link/IPFS</label>
        <input
          id="uri"
          value={uri}
          onChange={(event) => setUri(event.target.value)}
          placeholder="https://..."
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="file">Upload (opcional)</label>
        <input id="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.mp4" onChange={handleFileUpload} />
        <small>Integre com IPFS/Arweave na fase seguinte para gerar URIs permanentes.</small>
      </div>
      <button className="primary-button" type="submit" disabled={isDisabled}>
        {loading ? "Mintando..." : "Registrar na Solana"}
      </button>
      {!publicKey && <p>Conecte sua carteira para liberar o mint.</p>}
    </form>
  );
};

export default MintForm;
