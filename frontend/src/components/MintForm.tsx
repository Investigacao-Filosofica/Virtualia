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
import { useLanguage } from "./LanguageContext";

interface MintFormProps {
  onMinted?: () => void;
}

const contentOptionDefinitions: {
  value: ContentType;
  label: { en: string; pt: string };
}[] = [
  { value: "artigo", label: { en: "Article", pt: "Artigo" } },
  { value: "resenha", label: { en: "Review", pt: "Resenha" } },
  { value: "tradução", label: { en: "Translation", pt: "Tradução" } },
  { value: "certificado", label: { en: "Certificate", pt: "Certificado" } },
  { value: "outro", label: { en: "Other", pt: "Outro" } },
];

const educationLevelOptionDefinitions: {
  value: EducationLevel | string;
  label: { en: string; pt: string };
}[] = [
  { value: "extensão", label: { en: "Extension", pt: "Extensão" } },
  { value: "graduação", label: { en: "Undergraduate", pt: "Graduação" } },
  { value: "pós-graduação", label: { en: "Graduate", pt: "Pós-graduação" } },
  { value: "pesquisa", label: { en: "Research", pt: "Pesquisa" } },
  { value: "outro", label: { en: "Other", pt: "Outro" } },
];

const storageOptions: { value: StorageProtocol; label: string }[] = [
  { value: "ipfs", label: "IPFS" },
  { value: "arweave", label: "Arweave" },
];

const translations = {
  en: {
    title: "Register a new work",
    description:
      "Upload papers, reviews, certificates, or extension projects to store them on IPFS/Arweave and register their on-chain metadata.",
    titleLabel: "Title",
    titlePlaceholder: "e.g. Introduction to Quantum Computing",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Describe the content in up to 400 characters",
    categoryLabel: "Category",
    yearLabel: "Year of creation",
    yearPlaceholder: "2024",
    educationLabel: "Level",
    institutionLabel: "Institution",
    institutionPlaceholder: "Federal University of Paraná",
    knowledgeAreaLabel: "Knowledge area",
    knowledgeAreaPlaceholder: "Exact and Earth Sciences",
    knowledgeSubareaLabel: "Subarea",
    knowledgeSubareaPlaceholder: "Quantum Computing",
    storageLabel: "Storage protocol",
    uriLabel: "Link / IPFS",
    fileLabel: "Upload (optional)",
    fileHint: "The file will be sent to {protocol} and the link will be associated with the NFT.",
    submitIdle: "Register on Solana",
    submitLoading: "Minting...",
    connectWallet: "Connect your wallet to enable minting.",
    uploadPreparing: "Uploading to decentralized storage...",
    uploadSuccess: (protocol: string, filename: string) =>
      `Upload completed on ${protocol} (${filename})`,
    uploadError: "Failed to upload file. Please try again.",
    mintError: "Failed to mint. Check the console for details.",
  },
  pt: {
    title: "Registrar nova produção",
    description:
      "Faça o upload de artigos, resenhas, certificados ou projetos de extensão para armazená-los no IPFS/Arweave e registrar a metadata on-chain.",
    titleLabel: "Título",
    titlePlaceholder: "Ex.: Introdução à Computação Quântica",
    descriptionLabel: "Descrição",
    descriptionPlaceholder: "Contextualize o conteúdo em até 400 caracteres",
    categoryLabel: "Categoria",
    yearLabel: "Ano da produção",
    yearPlaceholder: "2024",
    educationLabel: "Nível",
    institutionLabel: "Instituição",
    institutionPlaceholder: "Universidade Federal do Paraná",
    knowledgeAreaLabel: "Área do conhecimento",
    knowledgeAreaPlaceholder: "Ciências Exatas e da Terra",
    knowledgeSubareaLabel: "Subárea",
    knowledgeSubareaPlaceholder: "Computação Quântica",
    storageLabel: "Protocolo de armazenamento",
    uriLabel: "Link/IPFS",
    fileLabel: "Upload (opcional)",
    fileHint: "O arquivo será enviado para o {protocol} e o link será associado ao NFT.",
    submitIdle: "Registrar na Solana",
    submitLoading: "Mintando...",
    connectWallet: "Conecte sua carteira para liberar o mint.",
    uploadPreparing: "Realizando upload descentralizado...",
    uploadSuccess: (protocol: string, filename: string) =>
      `Upload concluído no ${protocol} (${filename})`,
    uploadError: "Falha ao enviar arquivo. Tente novamente.",
    mintError: "Não foi possível mintar. Verifique o console para detalhes.",
  },
} as const;

const MintForm = ({ onMinted }: MintFormProps) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { addItem } = useMintedItems();
  const { language } = useLanguage();
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

  const t = translations[language];

  const contentOptions = useMemo(
    () =>
      contentOptionDefinitions.map((option) => ({
        value: option.value,
        label: option.label[language],
      })),
    [language]
  );

  const educationLevelOptions = useMemo(
    () =>
      educationLevelOptionDefinitions.map((option) => ({
        value: option.value,
        label: option.label[language],
      })),
    [language]
  );

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
  }, [storageProtocol, language]);

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
      console.error("Failed to mint content", error);
      // Replace with toast/alert in a production UI.
      alert(t.mintError);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadStatus(t.uploadPreparing);

    uploadToDecentralizedStorage(file, storageProtocol)
      .then((result) => {
        setUri(result.uri);
        setUploadStatus(t.uploadSuccess(result.protocol.toUpperCase(), result.filename));
      })
      .catch((error) => {
        console.error("Failed to upload file", error);
        setUploadStatus(t.uploadError);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <form onSubmit={handleMint}>
      <h2>{t.title}</h2>
      <p>{t.description}</p>
      <div className="input-group">
        <label htmlFor="title">{t.titleLabel}</label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={t.titlePlaceholder}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="description">{t.descriptionLabel}</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t.descriptionPlaceholder}
          rows={4}
        />
      </div>
      <div className="input-group">
        <label htmlFor="contentType">{t.categoryLabel}</label>
        <select
          id="contentType"
          value={contentType}
          onChange={(event) => setContentType(event.target.value as ContentType)}
        >
          {contentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="multi-input">
        <div className="input-group">
          <label htmlFor="year">{t.yearLabel}</label>
          <input
            id="year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder={t.yearPlaceholder}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="educationLevel">{t.educationLabel}</label>
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
        <label htmlFor="institution">{t.institutionLabel}</label>
        <input
          id="institution"
          value={institution}
          onChange={(event) => setInstitution(event.target.value)}
          placeholder={t.institutionPlaceholder}
          required
        />
      </div>
      <div className="multi-input">
        <div className="input-group">
          <label htmlFor="knowledgeArea">{t.knowledgeAreaLabel}</label>
          <input
            id="knowledgeArea"
            value={knowledgeArea}
            onChange={(event) => setKnowledgeArea(event.target.value)}
            placeholder={t.knowledgeAreaPlaceholder}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="knowledgeSubarea">{t.knowledgeSubareaLabel}</label>
          <input
            id="knowledgeSubarea"
            value={knowledgeSubarea}
            onChange={(event) => setKnowledgeSubarea(event.target.value)}
            placeholder={t.knowledgeSubareaPlaceholder}
            required
          />
        </div>
      </div>
      {/* <div className="input-group">
        <label htmlFor="uri">{t.uriLabel}</label>
        <input
          id="uri"
          value={uri}
          onChange={(event) => setUri(event.target.value)}
          placeholder="https://..."
          required
        />
      </div> */}
      <div className="input-group">
        <label htmlFor="file">{t.fileLabel}</label>
        <input id="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.mp4" onChange={handleFileUpload} />
        <small>{t.fileHint.replace("{protocol}", storageProtocol.toUpperCase())}</small>
        {uploadStatus && <small className="upload-status">{uploadStatus}</small>}
      </div>
      <button className="primary-button" type="submit" disabled={isDisabled}>
        {loading ? t.submitLoading : t.submitIdle}
      </button>
      {!publicKey && <p>{t.connectWallet}</p>}
    </form>
  );
};

export default MintForm;
