import { useMemo, useState } from "react";
import MintedItemList from "./MintedItemList";
import { useProfile } from "./ProfileContext";
import { useMintedItems } from "./MintedItemsContext";
import { useLanguage } from "./LanguageContext";

interface ProfilePageProps {
  onCreate: () => void;
  onEditProfile: () => void;
  globalSearchTerm: string;
}

const ProfilePage = ({ onCreate, onEditProfile, globalSearchTerm }: ProfilePageProps) => {
  const { profile } = useProfile();
  const { items } = useMintedItems();
  const { language } = useLanguage();
  const [localSearch, setLocalSearch] = useState("");

  const translations = {
    en: {
      avatarAlt: "Profile avatar",
      editProfile: "Edit profile",
      create: "Mint new work",
      globalHeading: (term: string) => `Global results for “${term}”`,
      productions: "Works",
      noProductions: "No works found.",
      users: "Users",
      noUsers: "No matching users yet.",
      wallets: "Wallets with works",
      walletItems: (count: number) => `${count} items`,
      noWallets: "Mints will appear here.",
      profileSearchLabel: "Search résumé",
      profileSearchPlaceholder: "Search by title, institution, or area",
      fallbackWallet: "your wallet",
    },
    pt: {
      avatarAlt: "Avatar do perfil",
      editProfile: "Editar perfil",
      create: "Criar",
      globalHeading: (term: string) => `Resultados globais para “${term}”`,
      productions: "Produções",
      noProductions: "Nenhuma produção encontrada.",
      users: "Usuários",
      noUsers: "Sem usuários correspondentes ainda.",
      wallets: "Carteiras com produções",
      walletItems: (count: number) => `${count} itens`,
      noWallets: "Mintagens aparecerão aqui.",
      profileSearchLabel: "Pesquisar no currículo",
      profileSearchPlaceholder: "Busque por título, instituição ou área",
      fallbackWallet: "sua carteira",
    },
  } as const;

  const t = translations[language];

  const searchTerm = localSearch.trim() || globalSearchTerm.trim();

  const globalResults = useMemo(() => {
    const normalized = globalSearchTerm.trim().toLowerCase();
    if (!normalized) {
      return null;
    }

    const productionMatches = items.filter((item) => {
      const candidate = [
        item.title,
        item.description,
        item.institution,
        item.knowledgeArea,
        item.knowledgeSubarea,
        item.ownerAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return candidate.includes(normalized);
    });

    const ownerMap = new Map<string, { ownerAddress: string; productions: number }>();
    productionMatches.forEach((item) => {
      const entry = ownerMap.get(item.ownerAddress);
      if (entry) {
        entry.productions += 1;
      } else {
        ownerMap.set(item.ownerAddress, { ownerAddress: item.ownerAddress, productions: 1 });
      }
    });

    const userMatches = [] as { displayName: string; wallet: string }[];
    const normalizedProfile = `${profile.displayName} ${profile.headline} ${profile.bio}`
      .toLowerCase()
      .trim();

    if (normalizedProfile.includes(normalized)) {
      userMatches.push({ displayName: profile.displayName, wallet: items[0]?.ownerAddress ?? t.fallbackWallet });
    }

    return {
      productionMatches,
      ownerMatches: Array.from(ownerMap.values()),
      userMatches,
    };
  }, [globalSearchTerm, items, profile, t.fallbackWallet]);

  const initials = useMemo(() => {
    const [first = "", second = ""] = profile.displayName.split(" ");
    return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
  }, [profile.displayName]);

  return (
    <div className="profile-page">
      <section className="profile-hero card">
        <div className="avatar" aria-hidden>
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt={t.avatarAlt} /> : <span>{initials}</span>}
        </div>
        <div className="profile-headline">
          <div className="profile-headline-top">
            <h2>{profile.displayName}</h2>
            <div className="profile-actions">
              <button className="outline-button" type="button" onClick={onEditProfile}>
                {t.editProfile}
              </button>
              <button className="primary-button" type="button" onClick={onCreate}>
                {t.create}
              </button>
            </div>
          </div>
          <p className="profile-tagline">{profile.headline}</p>
          <p className="profile-bio">{profile.bio}</p>
          <div className="profile-meta">
            {profile.location && <span className="badge">{profile.location}</span>}
            {profile.focusAreas.map((area) => (
              <span key={area} className="badge badge--outline">
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {globalResults && (
        <section className="card search-results">
          <h3>{t.globalHeading(globalSearchTerm)}</h3>
          <div className="search-results-grid">
            <div>
              <h4>{t.productions}</h4>
              {globalResults.productionMatches.length ? (
                <ul>
                  {globalResults.productionMatches.slice(0, 6).map((item) => (
                    <li key={item.id}>
                      <strong>{item.title}</strong>
                      <span>{item.institution}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t.noProductions}</p>
              )}
            </div>
            <div>
              <h4>{t.users}</h4>
              {globalResults.userMatches.length ? (
                <ul>
                  {globalResults.userMatches.map((match) => (
                    <li key={match.wallet}>
                      <strong>{match.displayName}</strong>
                      <span>{match.wallet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t.noUsers}</p>
              )}
            </div>
            <div>
              <h4>{t.wallets}</h4>
              {globalResults.ownerMatches.length ? (
                <ul>
                  {globalResults.ownerMatches.map((entry) => (
                    <li key={entry.ownerAddress}>
                      <strong>{entry.ownerAddress}</strong>
                      <span>{t.walletItems(entry.productions)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>{t.noWallets}</p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="card">
        <div className="profile-search">
          <label htmlFor="profileSearch">{t.profileSearchLabel}</label>
          <input
            id="profileSearch"
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            placeholder={t.profileSearchPlaceholder}
          />
        </div>
        <MintedItemList searchTerm={searchTerm} />
      </section>

      
    </div>
  );
};

export default ProfilePage;
