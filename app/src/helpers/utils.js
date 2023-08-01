import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { walletPubkey } from "../components/Header";
import { createSignal } from "solid-js";

const [balance, setBalance] = createSignal(null);

// const network = clusterApiUrl("devnet");
// const connection = new Connection(network, "processed");
const connection = new Connection(
  "https://powerful-boldest-lambo.solana-devnet.discover.quiknode.pro/40adfdae5a4a4466080d9920e9bcf4ad821b92fb/"
);

const getProvider = () => {
  const connection = new Connection(
    "https://powerful-boldest-lambo.solana-devnet.discover.quiknode.pro/40adfdae5a4a4466080d9920e9bcf4ad821b92fb/"
  );
  return new AnchorProvider(connection, window.solana, "processed");
};

const getBalance = async () => {
  const lamports = await connection.getBalance(walletPubkey());
  setBalance(lamports / LAMPORTS_PER_SOL);
};

export { connection, getProvider, getBalance, setBalance, balance };
