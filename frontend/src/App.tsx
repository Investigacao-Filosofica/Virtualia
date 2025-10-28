import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import WalletConnection from "./components/WalletConnection";
import WalletGate from "./components/WalletGate";
import MintForm from "./components/MintForm";
import MintedItemList from "./components/MintedItemList";
import { MintedItemProvider } from "./components/MintedItemsContext";
import PitchHighlights from "./components/PitchHighlights";

import "@solana/wallet-adapter-react-ui/styles.css";

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: "devnet" }),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MintedItemProvider>
            <WalletGate>
              <div className="app-shell">
                <header>
                  <div>
                    <h1>Virtualia</h1>
                    <p>Mint seu currículo acadêmico on-chain na Solana.</p>
                  </div>
                  <WalletConnection />
                </header>
                <main className="main-grid">
                  <section className="card">
                    <MintForm />
                  </section>
                  <section className="card">
                    <MintedItemList />
                  </section>
                  <section className="card pitch-card">
                    <PitchHighlights variant="compact" />
                  </section>
                </main>
                <p className="footer-note">
                  Roadmap: suporte a vídeos, trilhas de workshops e emissão de certificados tokenizados.
                </p>
              </div>
            </WalletGate>
          </MintedItemProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
