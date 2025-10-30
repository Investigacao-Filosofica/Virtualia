import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback } from "react";

const WalletConnection = () => {
  const { wallet, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleDisconnect = useCallback(() => {
    void disconnect();
  }, [disconnect]);

  if (!wallet || !publicKey) {
    return (
      <button type="button" className="wallet-button" onClick={handleConnect}>
        Connect wallet
      </button>
    );
  }

  return (
    <button type="button" className="wallet-button" onClick={handleDisconnect}>
      {publicKey.toBase58().slice(0, 4)}…{publicKey.toBase58().slice(-4)}
    </button>
  );
};

export default WalletConnection;
