import { BN, web3 } from "@coral-xyz/anchor";
import idl from "../assets/encrypted.json";
import { program } from "../store/program";
import { updateUser } from "../store/user";
import { chatLogs, registry, setChatLogs, setRegistry } from "../store/chatapp";

import {
  encrypt,
  importPrivateKey,
  importPublicKey,
  stringifiedKeypair,
  stringifyKeypair,
} from "../helpers/crypto";
import { walletPubkey } from "../components/Header";

const fetchRegistryAccounts = async () => {
  const results = await program().account.registryAccount.all();
  setRegistry("accounts", results);
  console.log("registry: ", registry);

  return results;
};

const fetchChatLogs = async () => {
  const results = await program().account.chatAccount.all();
  setChatLogs("accounts", results);
  console.log("registry: ", chatLogs);

  return results;
};

const fetchChatLogsByOwner = async (owner) => {
  const results = await fetchChatLogs();
  return results.filter((x) => x.account.owner === owner);
};

const initializeChat = async (alice, bob) => {
  const [aliceChatAccount, _] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("chat"), Buffer.from(alice), Buffer.from(bob)],
    new web3.PublicKey(idl.metadata.address)
  );
  const [bobChatAccount, __] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("chat"), Buffer.from(bob), Buffer.from(alice)],
    new web3.PublicKey(idl.metadata.address)
  );

  let results = await program()
    .methods.initChat(alice, bob)
    .accounts({
      aliceChatAccount: aliceChatAccount.toString(),
      bobChatAccount: bobChatAccount.toString(),
      signer: walletPubkey().PublicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();

  console.log("chatlog: ", results);
};

const sendMessage = async (alice, bob, timestamp, message) => {
  const aliceAccount = registry.accounts.filter(
    (x) => x.account.username === alice
  )[0];
  console.log("aliceAccount: ", aliceAccount);
  const registryAccount = aliceAccount.publicKey;
  console.log("registryAccount: ", registryAccount.toString());
  const aliceEncryptionKey = await importPublicKey(
    aliceAccount.account.messagingPubkey
  );
  console.log("aliceEncryptionKey: ", aliceEncryptionKey.toString());

  const bobAccount = registry.accounts.filter(
    (x) => x.account.username === bob
  )[0];
  console.log("bobAccount: ", bobAccount);
  const bobEncryptionKey = await importPublicKey(
    bobAccount.account.messagingPubkey
  );
  console.log("bobEncryptionKey: ", bobEncryptionKey.toString());

  // encrypt message
  const msgForAlice = await encrypt(message, aliceEncryptionKey);
  console.log("msgForAlice: ", msgForAlice);
  const msgForBob = await encrypt(message, bobEncryptionKey);
  console.log("msgForBob: ", msgForBob);

  // chatlogs
  console.log("chatLogs.accounts: ", chatLogs.accounts);
  const aliceChatAccount = chatLogs.accounts.filter(
    (x) => x.account.owner === alice
  )[0];
  console.log("aliceChatAccount: ", aliceChatAccount);
  const aliceChatAccountPubkey = aliceChatAccount.publicKey;
  console.log("aliceChatAccountPubkey: ", aliceChatAccountPubkey);

  const bobChatAccount = chatLogs.accounts.filter(
    (x) => x.account.owner === bob
  )[0];
  console.log("bobChatAccount: ", bobChatAccount);
  const bobChatAccountPubkey = bobChatAccount.publicKey;
  console.log("bobChatAccountPubkey: ", bobChatAccountPubkey);

  // get idx of next message
  const idx = aliceChatAccount.account.idx.toNumber();
  console.log("idx: ", idx);

  // get messageAccounts
  const [aliceMessageAccount, ____] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("message"),
      Buffer.from(alice),
      Buffer.from(bob),
      Buffer.from(new BN(0)),
    ],
    new web3.PublicKey(idl.metadata.address)
  );
  console.log("aliceMessageAccount: ", aliceMessageAccount.toString());
  const [bobMessageAccount, _____] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("message"),
      Buffer.from(bob),
      Buffer.from(alice),
      Buffer.from(new BN(0)),
    ],
    new web3.PublicKey(idl.metadata.address)
  );
  console.log("bobMessageAccount: ", bobMessageAccount.toString());

  let results = await program()
    .methods.sendMessage(alice, bob, timestamp, msgForAlice, msgForBob)
    .accounts({
      registryAccount: registryAccount.toString(),
      aliceChatAccount: aliceChatAccountPubkey.toString(),
      bobChatAccount: bobChatAccountPubkey.toString(),
      aliceMessageAccount: aliceMessageAccount.toString(),
      bobMessageAccount: bobMessageAccount.toString(),
      signer: walletPubkey().PublicKey,
      systemProgram: web3.SystemProgram.programId,
    })
    .rpc();

  console.log("chatlog: ", results);
};

const fetchChatMessages = async () => {
  let results = await program().account.messageAccount.all();
  setChatLogs("accounts", results);
  console.log("registry: ", chatLogs);

  return results;
};

export {
  fetchRegistryAccounts,
  fetchChatLogs,
  fetchChatLogsByOwner,
  initializeChat,
  sendMessage,
};
