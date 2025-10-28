import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

export interface ProfileData {
  displayName: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  location?: string;
  focusAreas: string[];
}

interface ProfileContextValue {
  profile: ProfileData;
  updateProfile: (input: Partial<ProfileData>) => void;
}

const defaultProfile: ProfileData = {
  displayName: "Pesquisador(a) Anônimo(a)",
  headline: "Construa seu currículo acadêmico verificável",
  bio: "Atualize seu perfil para personalizar o currículo on-chain e facilitar descobertas na rede acadêmica.",
  avatarUrl: "",
  location: "Brasil",
  focusAreas: ["Blockchain aplicada à educação", "Cidadania científica", "Extensão universitária"],
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider = ({ children }: PropsWithChildren) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  const value = useMemo(
    () => ({
      profile,
      updateProfile: (input: Partial<ProfileData>) =>
        setProfile((previous) => ({ ...previous, ...input })),
    }),
    [profile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile deve ser usado dentro de ProfileProvider");
  }
  return context;
};
