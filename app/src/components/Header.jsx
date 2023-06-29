import { Buffer } from "buffer";
import { Show, createSignal } from "solid-js";
import { setBalance } from "../helpers/utils";
import phantomIcon from "../assets/phantom-logo.png";
import logoUrl from "../assets/logo.svg";

window.Buffer = Buffer;
const [walletPubkey, setWalletPubkey] = createSignal(null);

const connectWallet = async () => {
  const { phantom } = window;
  if (phantom) {
    const response = await phantom.solana.connect();
    setWalletPubkey(response.publicKey);
  } else {
    window.open("https://phantom.app/", "_blank");
  }
};

function Header(props) {
  const ConnectWallet = () => (
    <div
      onClick={connectWallet}
      class={`flex items-center justify-end 
        space-x-2 px-4 py-3
        border-2 rounded-lg
        border-blue-400 text-blue-400 hover:border-blue-500 hover:text-blue-500
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

  const getAbbreviatedPubkey = () => {
    let x = walletPubkey().toString();
    return x.slice(0, 4) + "......." + x.slice(x.length - 4, x.length);
  };

  const DisconnectWallet = () => (
    <div
      onClick={disconnectWallet}
      class={`flex items-center justify-end 
      space-x-2 px-4 py-3
      border-2 rounded-lg
      border-blue-500 text-white hover:border-blue-600
      hover:cursor-pointer
      relative active:top-1`}
    >
      <image
        src={phantomIcon}
        class="relative bg-transparent transparent w-6 h-6"
      />
      <button>{getAbbreviatedPubkey()}</button>
    </div>
  );

  return (
    <div className="flex justify-between items-center mb-12">
      <div class="flex justify-start items-end">
        <h1 class="text-4xl">{props.title}</h1>
        <img
          src={logoUrl}
          alt="Neurodeploy logo"
          class="my-2 sm:mb-6 w-10 sm:w-10"
        />
      </div>
      <Show when={walletPubkey()} fallback={ConnectWallet}>
        <DisconnectWallet />
      </Show>
    </div>
  );
}

export { walletPubkey, setWalletPubkey, connectWallet, Header };
