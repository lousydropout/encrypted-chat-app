import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { walletPubkey } from "../components/Header";
import { createSignal } from "solid-js";

const [balance, setBalance] = createSignal(null);

const network = clusterApiUrl("devnet");
const connection = new Connection(network, "processed");

const getProvider = () => {
  const connection = new Connection(network, "processed");
  return new AnchorProvider(connection, window.solana, "processed");
};

const getBalance = async () => {
  const lamports = await connection.getBalance(walletPubkey());
  setBalance(lamports / LAMPORTS_PER_SOL);
};

export { network, connection, getProvider, getBalance, setBalance, balance };
