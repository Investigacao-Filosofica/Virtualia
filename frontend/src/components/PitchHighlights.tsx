import clsx from "clsx";

type PitchHighlightsProps = {
  variant?: "full" | "compact";
};

type Section = {
  id: string;
  title: string;
  description?: string;
  items: string[];
};

const sections: Section[] = [
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
];

const PitchHighlights = ({ variant = "full" }: PitchHighlightsProps) => {
  const visibleSections =
    variant === "compact"
      ? sections.filter((section) => section.id !== "problem")
      : sections;

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
