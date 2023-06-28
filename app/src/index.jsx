/* @refresh reload */
import { Show, render } from "solid-js/web";
import App from "./components/App";
import { Header, walletPubkey } from "./components/Header";
import "./index.css";

const root = document.getElementById("root");

const Index = () => (
  <div class="w-11/12 md:w-3/4 mx-auto py-8 relative">
    <Header title="Encrypted" />

    {/* Shows <App /> only when a wallet is connected */}
    <Show when={walletPubkey()}>
      <App />
    </Show>
  </div>
);

render(() => <Index />, root);
