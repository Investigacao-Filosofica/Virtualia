import MintForm from "./MintForm";
import PitchHighlights from "./PitchHighlights";

interface MintingPageProps {
  onBackToProfile: () => void;
  onMintSuccess: () => void;
}

const MintingPage = ({ onBackToProfile, onMintSuccess }: MintingPageProps) => {
  return (
    <div className="minting-page">
      <div className="minting-header">
        <button className="outline-button" onClick={onBackToProfile} type="button">
          ← Voltar para o perfil
        </button>
        <h2>Estúdio de mintagem</h2>
        <p>
          Faça o upload da sua produção acadêmica para gerar um NFT com metadata verificável.
          Após a conclusão, ele aparecerá automaticamente no seu perfil e na sua carteira.
        </p>
      </div>
      <div className="minting-layout">
        <section className="card">
          <MintForm onMinted={onMintSuccess} />
        </section>
        <section className="card minting-side">
          <h3>O que é registrado on-chain?</h3>
          <ul className="minting-checklist">
            <li>Ano, instituição e categoria da produção.</li>
            <li>Área e subárea do conhecimento associadas.</li>
            <li>URI permanente no IPFS ou Arweave.</li>
            <li>Assinatura da transação e endereço do NFT.</li>
          </ul>
          <PitchHighlights variant="compact" />
        </section>
      </div>
    </div>
  );
};

export default MintingPage;
