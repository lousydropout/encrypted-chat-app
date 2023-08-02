import { Buffer } from "buffer";
import { Show, createSignal } from "solid-js";
import { setBalance } from "../helpers/utils";
import phantomIcon from "../assets/phantom-logo.png";
import logoUrl from "../assets/logo.svg";
import { user } from "../store/user";

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
        border-emerald-500 text-emerald-500
        cursor-pointer
        `}
    >
      <image
        src={phantomIcon}
        class="relative bg-transparent transparent w-6 h-6"
      />
      <div>Not connected</div>
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
      class={`flex items-base justify-end 
      space-x-2 px-4 py-3
      border-2 rounded-lg
      border-emerald-500 text-emerald-500
      `}
    >
      <image
        src={phantomIcon}
        class="relative bg-transparent transparent w-6 h-6"
      />
      <div>{getAbbreviatedPubkey()}</div>
    </div>
  );

  return (
    <div className="flex justify-between items-center mb-12">
      <div class="flex justify-start items-end">
        <h1 class="text-4xl">{props.title}</h1>
        <img src={logoUrl} alt="Encrypted" class="mb-6 w-10" />
      </div>
      <div class="flex justify-between items-center space-x-8">
        <Show when={user().loggedIn}>
          <h3 class="text-xl">{user().username}</h3>
        </Show>
        <Show when={walletPubkey()} fallback={ConnectWallet}>
          <DisconnectWallet />
        </Show>
      </div>
    </div>
  );
}

export { walletPubkey, setWalletPubkey, connectWallet, Header };
