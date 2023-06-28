import { createSignal, onMount } from "solid-js";
import { walletPubkey } from "./Header";
import { getProvider } from "../utils";
import idl from "../idl.json";
import { Program, web3 } from "@coral-xyz/anchor";

const Vote = () => {
  const [totalVotes, setTotalVotes] = createSignal({
    voteAccount: null,
    a: 0,
    b: 0,
  });

  const provider = getProvider();
  const programId = "C5YpoSHLaJce7zdQAb2PMGTNp6zDfTvXBHMY1CgjQT5c";
  const program = new Program(idl, programId, provider);

  onMount(() => getVoteAccounts());

  const getVoteAccounts = async () => {
    const voteAccounts = await program.account.votingAccount.all();
    console.log("voteAccounts: ", JSON.stringify(voteAccounts));
    if (voteAccounts.length === 0) return;
    const acc = voteAccounts[0].account;

    setTotalVotes({
      voteAccount: new web3.PublicKey(voteAccounts[0].publicKey),
      a: acc.a.toNumber(),
      b: acc.b.toNumber(),
    });
  };

  const initializeVote = async () => {
    const [voteAccount, bump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("voteAccount")],
      new web3.PublicKey(programId)
    );
    console.log("voteAccount: ", voteAccount);
    console.log("voteAccount: ", voteAccount.toString());

    const txHash = await program.methods
      .initializeVote()
      .accounts({
        voteAccount: voteAccount.toString(),
        signer: walletPubkey().publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
    console.log("txHash: ", txHash.toString());
    await getVoteAccounts();
  };

  const voteA = async () => {
    console.log("signer: ", [walletPubkey(), totalVotes().voteAccount]);
    const txHash = await program.methods
      .castVote(1)
      .accounts({
        voteAccount: totalVotes().voteAccount,
        signer: walletPubkey().publicKey,
      })
      .rpc();
    console.log("txHash: ", txHash.toString());
    await getVoteAccounts();
  };

  const voteB = async () => {
    console.log("signer: ", [walletPubkey(), totalVotes().voteAccount]);
    const txHash = await program.methods
      .castVote(2)
      .accounts({
        voteAccount: totalVotes().voteAccount,
        signer: walletPubkey().publicKey,
      })
      .rpc();

    console.log("txHash: ", txHash.toString());
    await getVoteAccounts();
  };

  return (
    <>
      <div class="flex justify-between items-center">
        <h2 class="text-xl">Vote</h2>
        <button class="px-4 py-3 border-2 rounded-lg" onClick={getVoteAccounts}>
          get vote banks
        </button>
      </div>
      <div>
        <h3>Initialize voting account</h3>
        <button class="px-4 py-3 border-2 rounded-lg" onClick={initializeVote}>
          Initialize
        </button>
      </div>
      <div>
        <h3>A: {totalVotes().a}</h3>
        <button class="px-4 py-3 border-2 rounded-lg" onClick={voteA}>
          Vote A
        </button>
      </div>
      <div>
        <h3>B: {totalVotes().b}</h3>
        <button class="px-4 py-3 border-2 rounded-lg" onClick={voteB}>
          Vote B
        </button>
      </div>
    </>
  );
};

export { Vote };
