/* @refresh reload */
import { onMount } from "solid-js";
import { Show, render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { Program } from "@coral-xyz/anchor";
import idl from "./assets/encrypted.json";
import App from "./components/App";
import { Header } from "./components/Header";
import Login from "./components/Login";
import { getProvider } from "./helpers/utils";
import { setProgram } from "./store/program";
import { user } from "./store/user";
import "./index.css";

const root = document.getElementById("root");

onMount(() => {
  const provider = getProvider();
  const programId = idl.metadata.address;
  const _program = new Program(idl, programId, provider);
  setProgram(_program);
});

const Index = () => (
  <Router>
    <div class="flex flex-col h-screen w-11/12 md:w-3/4 mx-auto py-8 relative">
      <Header title="Encrypted" />
      {/* Shows <App /> only when a wallet is connected */}
      <Show when={user()?.loggedIn} fallback={Login}>
        <App />
      </Show>
    </div>
  </Router>
);

render(() => <Index />, root);
