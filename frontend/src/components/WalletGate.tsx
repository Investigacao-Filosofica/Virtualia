import clsx from "clsx";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import PitchHighlights from "./PitchHighlights";
import EmailLoginForm from "./EmailLoginForm";
import WalletConnection from "./WalletConnection";
import { useProfile } from "./ProfileContext";
import { useLanguage } from "./LanguageContext";

const WalletGate = ({ children }: PropsWithChildren) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { profile, updateProfile } = useProfile();
  const [status, setStatus] = useState<"idle" | "validating" | "valid" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<"wallet" | "email">("wallet");
  const [isEmailAuthenticated, setIsEmailAuthenticated] = useState(false);
  const { language } = useLanguage();

  const translations = {
    en: {
      validationError: "We couldn't validate your wallet. Please try again.",
      validating: "Validating connected wallet...",
      connectPrompt: "Connect your Solana wallet to access the academic minting studio.",
      chooseMethod: "Choose how you want to access the academic minting studio.",
      walletMethod: "Solana Wallet",
      emailMethod: "Institutional Email",
    },
    pt: {
      validationError: "Não foi possível validar a carteira. Tente novamente.",
      validating: "Validando carteira conectada...",
      connectPrompt: "Conecte sua carteira Solana para acessar o estúdio de mintagem acadêmica.",
      chooseMethod: "Escolha como deseja acessar o estúdio de mintagem acadêmica.",
      walletMethod: "Carteira Solana",
      emailMethod: "E-mail institucional",
    },
  } as const;

  const t = translations[language];

  useEffect(() => {
    let cancelled = false;

    if (isEmailAuthenticated) {
      return () => {
        cancelled = true;
      };
    }

    if (!publicKey) {
      setStatus("idle");
      setErrorMessage(null);
      return () => {
        cancelled = true;
      };
    }

    const validateWallet = async () => {
      setStatus("validating");
      setErrorMessage(null);

      try {
        await connection.getAccountInfo(publicKey);
        if (!cancelled) {
          setStatus("valid");
        }
      } catch (error) {
        console.error("Error validating wallet", error);
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(t.validationError);
        }
      }
    };

    void validateWallet();

    return () => {
      cancelled = true;
    };
  }, [connection, isEmailAuthenticated, publicKey, t.validationError]);

  const validationMessage = useMemo(() => {
    if (status === "validating") {
      return t.validating;
    }

    if (status === "error" && errorMessage) {
      return errorMessage;
    }

    return null;
  }, [errorMessage, status, t.validating]);

  const isAuthenticated = status === "valid" || isEmailAuthenticated;

  const handleEmailLoginSuccess = (rawProfile: Record<string, unknown>) => {
    const asRecord = (value: unknown): Record<string, unknown> | null => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
      }
      return value as Record<string, unknown>;
    };

    const extractString = (value: unknown): string | undefined => {
      if (typeof value !== "string") {
        return undefined;
      }
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    };

    const extractStringArray = (value: unknown): string[] | undefined => {
      if (Array.isArray(value)) {
        const sanitized = value
          .map((item) => extractString(item))
          .filter((item): item is string => Boolean(item));
        return sanitized.length ? sanitized : undefined;
      }

      if (typeof value === "string") {
        const parts = value
          .split(",")
          .map((segment) => segment.trim())
          .filter(Boolean);
        return parts.length ? parts : undefined;
      }

      const record = asRecord(value);
      if (record) {
        const values = Object.values(record)
          .map((item) => extractString(item))
          .filter((item): item is string => Boolean(item));
        return values.length ? values : undefined;
      }

      return undefined;
    };

    const customAttributes = asRecord(rawProfile["customAttributes"]);
    const displayName =
      extractString(rawProfile["name"]) ??
      extractString(rawProfile["email"]) ??
      profile.displayName;
    const headline =
      extractString(customAttributes?.["headline"]) ?? profile.headline;
    const bio = extractString(rawProfile["bio"]) ?? profile.bio;
    const avatarUrl = extractString(rawProfile["avatarUrl"]) ?? profile.avatarUrl;
    const location =
      extractString(customAttributes?.["location"]) ?? profile.location;
    const focusAreas =
      extractStringArray(customAttributes?.["focusAreas"]) ?? profile.focusAreas;

    updateProfile({
      displayName,
      headline,
      bio,
      avatarUrl,
      location,
      focusAreas,
    });

    setIsEmailAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-grid">
          <div className="login-card">
            <h1>Virtualia</h1>
            <p>{t.chooseMethod}</p>
            <div className="login-method-toggle" role="tablist" aria-label="Métodos de login">
              <button
                type="button"
                role="tab"
                aria-selected={authMethod === "wallet"}
                className={clsx("toggle-option", { active: authMethod === "wallet" })}
                onClick={() => setAuthMethod("wallet")}
              >
                {t.walletMethod}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authMethod === "email"}
                className={clsx("toggle-option", { active: authMethod === "email" })}
                onClick={() => setAuthMethod("email")}
              >
                {t.emailMethod}
              </button>
            </div>
            {authMethod === "wallet" ? (
              <>
                <WalletConnection />
                {validationMessage ? <p className="validation-message">{validationMessage}</p> : null}
              </>
            ) : (
              <EmailLoginForm onSuccess={handleEmailLoginSuccess} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WalletGate;
