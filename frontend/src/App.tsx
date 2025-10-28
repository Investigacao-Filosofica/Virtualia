import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useMemo, useState } from "react";
import WalletConnection from "./components/WalletConnection";
import WalletGate from "./components/WalletGate";
import { MintedItemProvider } from "./components/MintedItemsContext";
import { ProfileProvider } from "./components/ProfileContext";
import ProfilePage from "./components/ProfilePage";
import MintingPage from "./components/MintingPage";
import ProfileEditModal from "./components/ProfileEditModal";

import "@solana/wallet-adapter-react-ui/styles.css";

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    ],
    []
  );

  const [view, setView] = useState<"profile" | "mint">("profile");
  const [globalSearch, setGlobalSearch] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);

  const goToProfile = () => {
    setView("profile");
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MintedItemProvider>
            <ProfileProvider>
              <WalletGate>
                <div className="app-shell">
                  <header className="app-header">
                    <div>
                      <h1>Virtualia</h1>
                      <p>Currículos acadêmicos como NFTs na Solana.</p>
                    </div>
                    <div className="header-tools">
                      <div className="header-search">
                        <label htmlFor="globalSearch" className="sr-only">
                          Buscar produções ou usuários
                        </label>
                        <input
                          id="globalSearch"
                          value={globalSearch}
                          onChange={(event) => setGlobalSearch(event.target.value)}
                          placeholder="Buscar produções ou usuários"
                        />
                      </div>
                      <WalletConnection />
                    </div>
                  </header>
                  <main className="page-area">
                    {view === "profile" ? (
                      <ProfilePage
                        onCreate={() => setView("mint")}
                        onEditProfile={() => setEditingProfile(true)}
                        globalSearchTerm={globalSearch}
                      />
                    ) : (
                      <MintingPage onBackToProfile={goToProfile} onMintSuccess={goToProfile} />
                    )}
                  </main>
                  <p className="footer-note">
                    Roadmap: suporte a vídeos, trilhas de workshops e emissão de certificados tokenizados.
                  </p>
                  <ProfileEditModal open={editingProfile} onClose={() => setEditingProfile(false)} />
                </div>
              </WalletGate>
            </ProfileProvider>
          </MintedItemProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
