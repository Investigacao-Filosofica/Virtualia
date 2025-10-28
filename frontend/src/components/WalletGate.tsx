import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import WalletConnection from "./WalletConnection";
import PitchHighlights from "./PitchHighlights";

const WalletGate = ({ children }: PropsWithChildren) => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<"idle" | "validating" | "valid" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  }, [connection, publicKey]);

  const validationMessage = useMemo(() => {
    if (status === "validating") {
      return "Validando carteira conectada...";
    }

    if (status === "error" && errorMessage) {
      return errorMessage;
    }

    return null;
  }, [errorMessage, status]);

  if (status !== "valid") {
    return (
      <div className="login-screen">
        <div className="login-grid">
          <div className="login-card">
            <h1>Virtualia</h1>
            <p>Conecte sua carteira Solana para acessar o estúdio de mintagem acadêmica.</p>
            <WalletConnection />
            {validationMessage && <p className="validation-message">{validationMessage}</p>}
            <ul className="login-benefits">
              <li>Registre artigos, certificados e traduções na blockchain.</li>
              <li>Reúna seu portfólio acadêmico on-chain.</li>
              <li>Distribua recompensas em tokens para colaboradores.</li>
            </ul>
          </div>
          <PitchHighlights />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default WalletGate;
