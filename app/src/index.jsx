/* @refresh reload */
import { onMount } from "solid-js";
import { Show, render } from "solid-js/web";
import App from "./components/App";
import { Header, walletPubkey } from "./components/Header";
import "./index.css";
import { showLogin } from "./store/showLogin";
import { hasLoggedIn } from "./store/hasLoggedIn";
import Login from "./components/Login";
import { Router } from "@solidjs/router";
import { Program, web3 } from "@coral-xyz/anchor";
import { getProvider } from "./helpers/utils";
import idl from "./assets/encrypted.json";
import { program, setProgram } from "./store/program";
import { user } from "./store/user";

const root = document.getElementById("root");

onMount(() => {
  const provider = getProvider();
  const programId = idl.metadata.address;
  console.log("programId: ", programId);
  const _program = new Program(idl, programId, provider);
  setProgram(_program);
});

const Index = () => (
  <Router>
    <div class="h-screen w-11/12 md:w-3/4 mx-auto py-8 relative">
      <Header title="Encrypted" />
      {/* Shows <App /> only when a wallet is connected */}
      <Show when={user()?.loggedIn} fallback={Login}>
        <App />
      </Show>
    </div>
  </Router>
);

render(() => <Index />, root);
