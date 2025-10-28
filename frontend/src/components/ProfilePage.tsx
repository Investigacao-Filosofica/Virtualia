import { useMemo, useState } from "react";
import MintedItemList from "./MintedItemList";
import PitchHighlights from "./PitchHighlights";
import { useProfile } from "./ProfileContext";
import { useMintedItems } from "./MintedItemsContext";

interface ProfilePageProps {
  onCreate: () => void;
  onEditProfile: () => void;
  globalSearchTerm: string;
}

const ProfilePage = ({ onCreate, onEditProfile, globalSearchTerm }: ProfilePageProps) => {
  const { profile } = useProfile();
  const { items } = useMintedItems();
  const [localSearch, setLocalSearch] = useState("");

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
      userMatches.push({ displayName: profile.displayName, wallet: items[0]?.ownerAddress ?? "sua carteira" });
    }

    return {
      productionMatches,
      ownerMatches: Array.from(ownerMap.values()),
      userMatches,
    };
  }, [globalSearchTerm, items, profile]);

  const initials = useMemo(() => {
    const [first = "", second = ""] = profile.displayName.split(" ");
    return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
  }, [profile.displayName]);

  return (
    <div className="profile-page">
      <section className="profile-hero card">
        <div className="avatar" aria-hidden>
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar do perfil" /> : <span>{initials}</span>}
        </div>
        <div className="profile-headline">
          <div className="profile-headline-top">
            <h2>{profile.displayName}</h2>
            <div className="profile-actions">
              <button className="outline-button" type="button" onClick={onEditProfile}>
                Editar perfil
              </button>
              <button className="primary-button" type="button" onClick={onCreate}>
                Create
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
          <h3>Resultados globais para “{globalSearchTerm}”</h3>
          <div className="search-results-grid">
            <div>
              <h4>Produções</h4>
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
                <p>Nenhuma produção encontrada.</p>
              )}
            </div>
            <div>
              <h4>Usuários</h4>
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
                <p>Sem usuários correspondentes ainda.</p>
              )}
            </div>
            <div>
              <h4>Carteiras com produções</h4>
              {globalResults.ownerMatches.length ? (
                <ul>
                  {globalResults.ownerMatches.map((entry) => (
                    <li key={entry.ownerAddress}>
                      <strong>{entry.ownerAddress}</strong>
                      <span>{entry.productions} itens</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Mintagens aparecerão aqui.</p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="card">
        <div className="profile-search">
          <label htmlFor="profileSearch">Pesquisar no currículo</label>
          <input
            id="profileSearch"
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            placeholder="Busque por título, instituição ou área"
          />
        </div>
        <MintedItemList searchTerm={searchTerm} />
      </section>

      <section className="card highlights-card">
        <PitchHighlights />
      </section>
    </div>
  );
};

export default ProfilePage;
