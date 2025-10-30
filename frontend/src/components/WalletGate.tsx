import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import WalletConnection from "./WalletConnection";
import { useLanguage } from "./LanguageContext";

const WalletGate = ({ children }: PropsWithChildren) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<"idle" | "validating" | "valid" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { language } = useLanguage();

  const translations = {
    en: {
      validationError: "We couldn't validate your wallet. Please try again.",
      validating: "Validating connected wallet...",
      connectPrompt: "Connect your Solana wallet to access the academic minting studio.",
    },
    pt: {
      validationError: "Não foi possível validar a carteira. Tente novamente.",
      validating: "Validando carteira conectada...",
      connectPrompt: "Conecte sua carteira Solana para acessar o estúdio de mintagem acadêmica.",
    },
  } as const;

  const t = translations[language];

  useEffect(() => {
    let cancelled = false;

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
  }, [connection, publicKey, t.validationError]);

  const validationMessage = useMemo(() => {
    if (status === "validating") {
      return t.validating;
    }

    if (status === "error" && errorMessage) {
      return errorMessage;
    }

    return null;
  }, [errorMessage, status, t.validating]);

  if (status !== "valid") {
    return (
      <div className="login-screen">
        <div className="login-grid">
          <div className="login-card">
            <h1>Virtualia</h1>
            <p>{t.connectPrompt}</p>
            <WalletConnection />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WalletGate;
