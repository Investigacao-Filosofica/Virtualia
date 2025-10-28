import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { v4 as uuid } from "uuid";
import {
  useMintedItems,
  ContentType,
  EducationLevel,
  StorageProtocol,
} from "./MintedItemsContext";
import { mintContentMock } from "../services/solana";
import { uploadToDecentralizedStorage } from "../services/storage";

interface MintFormProps {
  onMinted?: () => void;
}

const contentOptions: { value: ContentType; label: string }[] = [
  { value: "artigo", label: "Artigo" },
  { value: "resenha", label: "Resenha" },
  { value: "tradução", label: "Tradução" },
  { value: "certificado", label: "Certificado" },
  { value: "outro", label: "Outro" },
];

const educationLevelOptions: { value: EducationLevel | string; label: string }[] = [
  { value: "extensão", label: "Extensão" },
  { value: "graduação", label: "Graduação" },
  { value: "pós-graduação", label: "Pós-graduação" },
  { value: "pesquisa", label: "Pesquisa" },
  { value: "outro", label: "Outro" },
];

const storageOptions: { value: StorageProtocol; label: string }[] = [
  { value: "ipfs", label: "IPFS" },
  { value: "arweave", label: "Arweave" },
];

const MintForm = ({ onMinted }: MintFormProps) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { addItem } = useMintedItems();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uri, setUri] = useState("");
  const [contentType, setContentType] = useState<ContentType>("artigo");
  const [year, setYear] = useState<string>("");
  const [institution, setInstitution] = useState("");
  const [knowledgeArea, setKnowledgeArea] = useState("");
  const [knowledgeSubarea, setKnowledgeSubarea] = useState("");
  const [educationLevel, setEducationLevel] = useState<EducationLevel | string>("extensão");
  const [storageProtocol, setStorageProtocol] = useState<StorageProtocol>("ipfs");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const isDisabled = useMemo(
    () =>
      loading ||
      uploading ||
      !publicKey ||
      !title.trim() ||
      !uri.trim() ||
      !year.trim() ||
      !institution.trim() ||
      !knowledgeArea.trim() ||
      !knowledgeSubarea.trim(),
    [
      educationLevel,
      institution,
      knowledgeArea,
      knowledgeSubarea,
      loading,
      publicKey,
      title,
      uploading,
      uri,
      year,
    ]
  );

  useEffect(() => {
    setUploadStatus(null);
  }, [storageProtocol]);

  const handleMint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!publicKey) {
      return;
    }

    try {
      setLoading(true);
      const { rewardLamports, mintAddress, metadataSignature } = await mintContentMock(
        connection,
        publicKey,
        {
          title,
          description,
          uri,
          contentType,
          year,
          institution,
          educationLevel,
          knowledgeArea,
          knowledgeSubarea,
          storageProtocol,
        }
      );

      addItem({
        id: uuid(),
        title,
        description,
        uri,
        contentType,
        reward: rewardLamports / LAMPORTS_PER_SOL,
        ownerAddress: publicKey.toBase58(),
        mintedAt: new Date().toISOString(),
        year,
        institution,
        educationLevel,
        knowledgeArea,
        knowledgeSubarea,
        storageProtocol,
        mintAddress,
        metadataSignature,
      });

      setTitle("");
      setDescription("");
      setUri("");
      setContentType("artigo");
      setYear("");
      setInstitution("");
      setKnowledgeArea("");
      setKnowledgeSubarea("");
      setEducationLevel("extensão");
      setStorageProtocol("ipfs");
      onMinted?.();
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
    setUploading(true);
    setUploadStatus("Realizando upload descentralizado...");

    uploadToDecentralizedStorage(file, storageProtocol)
      .then((result) => {
        setUri(result.uri);
        setUploadStatus(
          `Upload concluído no ${result.protocol.toUpperCase()} (${result.filename})`
        );
      })
      .catch((error) => {
        console.error("Falha ao enviar arquivo", error);
        setUploadStatus("Falha ao enviar arquivo. Tente novamente.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <form onSubmit={handleMint}>
      <h2>Registrar nova produção</h2>
      <p>
        Faça o upload de artigos, resenhas, certificados ou projetos de extensão para
        armazená-los no IPFS/Arweave e registrar a metadata on-chain.
      </p>
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
      <div className="multi-input">
        <div className="input-group">
          <label htmlFor="year">Ano da produção</label>
          <input
            id="year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder="2024"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="educationLevel">Nível</label>
          <select
            id="educationLevel"
            value={educationLevel}
            onChange={(event) => setEducationLevel(event.target.value)}
          >
            {educationLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="institution">Instituição</label>
        <input
          id="institution"
          value={institution}
          onChange={(event) => setInstitution(event.target.value)}
          placeholder="Universidade Federal do Paraná"
          required
        />
      </div>
      <div className="multi-input">
        <div className="input-group">
          <label htmlFor="knowledgeArea">Área do conhecimento</label>
          <input
            id="knowledgeArea"
            value={knowledgeArea}
            onChange={(event) => setKnowledgeArea(event.target.value)}
            placeholder="Ciências Exatas e da Terra"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="knowledgeSubarea">Subárea</label>
          <input
            id="knowledgeSubarea"
            value={knowledgeSubarea}
            onChange={(event) => setKnowledgeSubarea(event.target.value)}
            placeholder="Computação Quântica"
            required
          />
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="storageProtocol">Protocolo de armazenamento</label>
        <select
          id="storageProtocol"
          value={storageProtocol}
          onChange={(event) => {
            setStorageProtocol(event.target.value as StorageProtocol);
            setUri("");
            setUploadStatus(null);
          }}
        >
          {storageOptions.map((option) => (
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
        <small>
          O arquivo será enviado para o {storageProtocol.toUpperCase()} e o link será associado ao NFT.
        </small>
        {uploadStatus && <small className="upload-status">{uploadStatus}</small>}
      </div>
      <button className="primary-button" type="submit" disabled={isDisabled}>
        {loading ? "Mintando..." : "Registrar na Solana"}
      </button>
      {!publicKey && <p>Conecte sua carteira para liberar o mint.</p>}
    </form>
  );
};

export default MintForm;
