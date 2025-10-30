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
  displayName: "Anonymous Researcher",
  headline: "Build your verifiable academic résumé",
  bio: "Update your profile to personalize the on-chain résumé and increase academic network discovery.",
  avatarUrl: "",
  location: "Brazil",
  focusAreas: ["Blockchain applied to education", "Scientific citizenship", "University outreach"],
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
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
