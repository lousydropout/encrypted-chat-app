/* @refresh reload */
import { onMount } from "solid-js";
import { Show, render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { Program } from "@coral-xyz/anchor";
import idl from "./assets/encrypted.json";
import App from "./components/App";
import { Header, connectWallet, walletPubkey } from "./components/Header";
import Login from "./components/Login";
import { getProvider } from "./helpers/utils";
import { setProgram } from "./store/program";
import { user } from "./store/user";
import "./index.css";
// import { fetchRegistryAccounts } from "./helpers/encryptedChatApp";

const root = document.getElementById("root");

// const getRegistry = async () => {
//   await fetchRegistryAccounts();
// };

const Index = () => {
  onMount(() => {
    const provider = getProvider();
    const programId = idl.metadata.address;
    const _program = new Program(idl, programId, provider);
    setProgram(_program);
    // getRegistry();
    if (!walletPubkey()) connectWallet();
  });
  return (
    <Router>
      <div class="flex flex-col h-screen w-11/12 md:w-3/4 mx-auto py-8 relative">
        <Header title="Encrypted" />
        <Show when={user().loggedIn} fallback={Login}>
          <App />
        </Show>
      </div>
    </Router>
  );
};

render(() => <Index />, root);
