import { Buffer } from "buffer";
import { Show, createSignal } from "solid-js";
import { setBalance } from "../utils";
import phantomIcon from "../assets/phantom-logo.png";

window.Buffer = Buffer;
const [walletPubkey, setWalletPubkey] = createSignal(null);

function Header(props) {
  const connectWallet = async () => {
    const { phantom } = window;
    if (phantom) {
      const response = await phantom.solana.connect();
      setWalletPubkey(response.publicKey);
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  };

  const ConnectWallet = () => (
    <div
      onClick={connectWallet}
      class={`flex items-center justify-end 
        space-x-2 px-4 py-3
        border-2 rounded-lg
        bg-violet-600 text-white hover:bg-violet-700
        hover:cursor-pointer
        relative active:top-1`}
    >
      <image
        src={phantomIcon}
        class="relative bg-transparent transparent w-6 h-6"
      />
      <button>Connect wallet</button>
    </div>
  );

  const disconnectWallet = () => {
    setWalletPubkey(null);
    setBalance(null);
  };

  const DisconnectWallet = () => (
    <button
      onClick={disconnectWallet}
      class={`flex items-center justify-end 
        space-x-2 px-4 py-3
        border-2 rounded-lg
        bg-red-600 text-white hover:bg-red-700
        hover:cursor-pointer
        relative active:top-1`}
    >
      Disconnect wallet
    </button>
  );

  return (
    <div className="flex justify-between items-center mb-12">
      <h1 class="text-4xl">{props.title}</h1>
      <Show when={walletPubkey()} fallback={ConnectWallet}>
        <DisconnectWallet />
      </Show>
    </div>
  );
}

export { walletPubkey, setWalletPubkey, Header };
