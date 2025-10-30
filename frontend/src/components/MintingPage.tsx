import MintForm from "./MintForm";
import { useLanguage } from "./LanguageContext";

interface MintingPageProps {
  onBackToProfile: () => void;
  onMintSuccess: () => void;
}

const MintingPage = ({ onBackToProfile, onMintSuccess }: MintingPageProps) => {
  const { language } = useLanguage();

  const translations = {
    en: {
      back: "← Back to profile",
      title: "Minting studio",
      description:
        "Upload your academic work to generate an NFT with verifiable metadata. Once finished, it will automatically appear in your profile and wallet.",
    },
    pt: {
      back: "← Voltar para o perfil",
      title: "Estúdio de mintagem",
      description:
        "Faça o upload da sua produção acadêmica para gerar um NFT com metadata verificável. Após a conclusão, ele aparecerá automaticamente no seu perfil e na sua carteira.",
    },
  } as const;

  const t = translations[language];

  return (
    <div className="minting-page">
      <div className="minting-header">
        <button className="outline-button" onClick={onBackToProfile} type="button">
          {t.back}
        </button>
        <h2>{t.title}</h2>
        <p>{t.description}</p>
      </div>
      <div className="minting-layout">
        <section className="card">
          <MintForm onMinted={onMintSuccess} />
        </section>
      </div>
    </div>
  );
};

export default MintingPage;
