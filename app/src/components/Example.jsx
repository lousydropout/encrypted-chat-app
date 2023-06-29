import { createSignal } from "solid-js";
import { decrypt, encrypt, keypair } from "../helpers/crypto.js";

const [message, setMessage] = createSignal("");
const [encMessage, setEncMessage] = createSignal("");
const [decMessage, setDecMessage] = createSignal("");

const encryptMessage = async () => {
  const result = encrypt(message(), keypair().publicKey);
  setEncMessage(result);
};

const decryptMessage = async () => {
  const result = await decrypt(encMessage(), keypair().privateKey);
  setDecMessage(result);
};

const Example = () => {
  return (
    <>
      <div class="flex justify-around items-center">
        <div class="w-1/2">
          <textarea
            class="h-56 w-full border-2"
            onInput={(e) => setMessage(e.target.value)}
          />
          <button onClick={encryptMessage} class="border-2 rounded-lg p-4">
            Encrypt
          </button>
        </div>
        <div class="w-1/2">
          <textarea
            class="h-56 w-full border-2"
            value={encMessage()}
            onBlur={(e) => setEncMessage(e.target.value)}
            onChange={(e) => setEncMessage(e.target.value)}
            onInput={(e) => setEncMessage(e.target.value)}
          />
          <button onClick={decryptMessage} class="border-2 rounded-lg p-4">
            Decrypt
          </button>
        </div>
      </div>
      <br />
      <div class="p-4 border-2 rounded-md h-32 w-full">{decMessage()}</div>
    </>
  );
};

export { Example };
