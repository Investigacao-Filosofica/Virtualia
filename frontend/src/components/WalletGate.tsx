import clsx from "clsx";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import PitchHighlights from "./PitchHighlights";
import EmailLoginForm from "./EmailLoginForm";
import WalletConnection from "./WalletConnection";
import { useProfile } from "./ProfileContext";

const WalletGate = ({ children }: PropsWithChildren) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { profile, updateProfile } = useProfile();
  const [status, setStatus] = useState<"idle" | "validating" | "valid" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<"wallet" | "email">("wallet");
  const [isEmailAuthenticated, setIsEmailAuthenticated] = useState(false);

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
        console.error("Erro ao validar carteira", error);
        if (!cancelled) {
          setStatus("error");
          setErrorMessage("Não foi possível validar a carteira. Tente novamente.");
        }
      }
    };

    void validateWallet();

    return () => {
      cancelled = true;
    };
  }, [connection, isEmailAuthenticated, publicKey]);

  const validationMessage = useMemo(() => {
    if (status === "validating") {
      return "Validando carteira conectada...";
    }

    if (status === "error" && errorMessage) {
      return errorMessage;
    }

    return null;
  }, [errorMessage, status]);

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
            <p>Escolha como deseja acessar o estúdio de mintagem acadêmica.</p>
            <div className="login-method-toggle" role="tablist" aria-label="Métodos de login">
              <button
                type="button"
                role="tab"
                aria-selected={authMethod === "wallet"}
                className={clsx("toggle-option", { active: authMethod === "wallet" })}
                onClick={() => setAuthMethod("wallet")}
              >
                Carteira Solana
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authMethod === "email"}
                className={clsx("toggle-option", { active: authMethod === "email" })}
                onClick={() => setAuthMethod("email")}
              >
                E-mail institucional
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
          {/* <PitchHighlights /> */}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WalletGate;
