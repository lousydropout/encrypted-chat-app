/* @refresh reload */
import { onMount } from "solid-js";
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { Program } from "@coral-xyz/anchor";
import idl from "./assets/encrypted.json";
import App from "./components/App";
import { Header } from "./components/Header";
import { getProvider } from "./helpers/utils";
import { setProgram } from "./store/program";
import "./index.css";
import Nav from "./components/Nav";
import { grabfromCache } from "./store/user";

const root = document.getElementById("root");

// Log out user from all tabs if logged out from one
setInterval(() => {
  const cached = grabfromCache();
  if (!cached && user().loggedIn) logUserOut();
}, 1000);

const Index = () => {
  onMount(() => {
    const provider = getProvider();
    const programId = idl.metadata.address;
    const _program = new Program(idl, programId, provider);
    setProgram(_program);
  });
  return (
    <Router>
      {/* Header */}
      <div class="flex flex-col h-full p-4 bg-transparent overflow-y-hidden">
        <Header title="Encrypted" />

        {/* Center */}
        <div class="grid grid-cols-[15rem_1fr] w-full h-full">
          {/* SideNav */}
          <nav class="flex flex-col h-[90%] justify-between p-6 bg-transparent border-r-2 border-zinc-700 col-span-1">
            <Nav />
          </nav>

          {/* Main */}
          <main class="h-full w-full  p-12 col-span-1 overflow-y-auto">
            <App />
          </main>
        </div>
      </div>
    </Router>
  );
};

render(() => <Index />, root);
