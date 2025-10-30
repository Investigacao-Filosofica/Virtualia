import clsx from "clsx";
import { useLanguage } from "./LanguageContext";

type PitchHighlightsProps = {
  variant?: "full" | "compact";
};

type Section = {
  id: string;
  title: string;
  description?: string;
  items: string[];
};

const sectionTranslations: Record<"en" | "pt", Section[]> = {
  en: [
    {
      id: "problem",
      title: "The Problem",
      items: [
        "Academic credentials are easy to forge.",
        "Verification systems are slow, centralized, and expensive.",
        "Students and researchers don't control their own histories.",
        "Diplomas and publications lack transparency and trust.",
      ],
    },
    {
      id: "solution",
      title: "The Solution",
      items: [
        "Platform to mint, verify, and share credentials as NFTs on Solana.",
        "Tokenization of certificates, diplomas, papers, and academic projects.",
        "Authenticated metadata: author, institution, and issuance date.",
        "Personal on-chain portfolio with open access for verification.",
      ],
    },
    {
      id: "impact",
      title: "Impact",
      description: "For students, researchers, and institutions:",
      items: [
        "Portable, decentralized, and verifiable academic portfolio.",
        "Proof of authorship and authenticity in seconds.",
        "Anti-fraud system accessible to universities and organizations.",
        "Greater visibility for scientific output across the Web3 ecosystem.",
      ],
    },
    {
      id: "technology",
      title: "Technology",
      items: [
        "Blockchain: Solana (fast, scalable, and low cost).",
        "Smart contracts: Rust using the Anchor framework.",
        "NFT standards: Metaplex and SPL Tokens.",
        "Decentralized storage: Arweave and IPFS.",
        "Compatible wallets: Phantom and Solflare.",
      ],
    },
  ],
  pt: [
    {
      id: "problem",
      title: "O Problema",
      items: [
        "Credenciais acadêmicas são fáceis de falsificar.",
        "Sistemas de verificação são lentos, centralizados e caros.",
        "Estudantes e pesquisadores não possuem seus próprios históricos.",
        "Falta transparência e confiança em diplomas e publicações.",
      ],
    },
    {
      id: "solution",
      title: "A Solução",
      items: [
        "Plataforma para cunhar, verificar e compartilhar credenciais como NFTs na Solana.",
        "Tokenização de certificados, diplomas, artigos e projetos acadêmicos.",
        "Metadados autenticados: autor, instituição e data de emissão.",
        "Portfólio pessoal on-chain com acesso aberto para consulta.",
      ],
    },
    {
      id: "impact",
      title: "Impacto",
      description: "Para estudantes, pesquisadores e instituições:",
      items: [
        "Portfólio acadêmico portátil, descentralizado e verificável.",
        "Comprovação de autoria e autenticidade em segundos.",
        "Sistema antifraude acessível para universidades e organizações.",
        "Maior visibilidade para produções científicas no ecossistema Web3.",
      ],
    },
    {
      id: "technology",
      title: "Tecnologia",
      items: [
        "Blockchain: Solana (rápida, escalável e de baixo custo).",
        "Smart contracts: Rust com padrão Anchor.",
        "NFT standards: Metaplex e SPL Tokens.",
        "Armazenamento descentralizado: Arweave e IPFS.",
        "Carteiras compatíveis: Phantom e Solflare.",
      ],
    },
  ],
};

const PitchHighlights = ({ variant = "full" }: PitchHighlightsProps) => {
  const { language } = useLanguage();
  const localizedSections = sectionTranslations[language];
  const visibleSections =
    variant === "compact"
      ? localizedSections.filter((section) => section.id !== "problem")
      : localizedSections;

  return (
    <div className={clsx("pitch-highlights", `pitch-highlights-${variant}`)}>
      {visibleSections.map((section) => (
        <article key={section.id} className="pitch-section">
          <h2>{section.title}</h2>
          {section.description && <p className="pitch-description">{section.description}</p>}
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
};

export default PitchHighlights;
