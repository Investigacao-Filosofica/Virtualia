import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";
import { Virtualia } from "../target/types/virtualia";

describe("virtualia", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Virtualia as Program<Virtualia>;

  const user = anchor.web3.Keypair.generate();

  it("Inicializa perfil do usuário", async () => {
    const [profilePda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), user.publicKey.toBuffer()],
      program.programId
    );

    await provider.connection.requestAirdrop(user.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods
      .initializeUser(bump)
      .accounts({
        authority: user.publicKey,
        profile: profilePda,
      })
      .signers([user])
      .rpc();

    const profileAccount = await program.account.profile.fetch(profilePda);
    expect(profileAccount.owner.toBase58()).to.equal(user.publicKey.toBase58());
    expect(profileAccount.totalMints.toNumber()).to.equal(0);
  });

  it("Registra conteúdo", async () => {
    const [profilePda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("profile"), user.publicKey.toBuffer()],
      program.programId
    );

    const [contentPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("content"), user.publicKey.toBuffer(), Buffer.from(new anchor.BN(0).toArrayLike(Buffer, "le", 8))],
      program.programId
    );

    await program.methods
      .mintContent({
        title: "Prova de Conceito",
        description: "Conteúdo publicado durante o hackaton",
        uri: "https://example.com/poc.pdf",
        contentType: "artigo",
        rewardLamports: new anchor.BN(1_000_000),
      })
      .accounts({
        authority: user.publicKey,
        profile: profilePda,
        content: contentPda,
      })
      .signers([user])
      .rpc();

    const contentAccount = await program.account.content.fetch(contentPda);
    expect(contentAccount.title).to.equal("Prova de Conceito");
    expect(contentAccount.contentType).to.equal("artigo");
  });
});
