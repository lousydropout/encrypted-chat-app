import { Show, createSignal } from "solid-js";
import {
  generateKey,
  importPrivateKey,
  importPublicKey,
  keypair,
  setKeypair,
  stringifiedKeypair,
  stringifyKeypair,
} from "../crypto.js";

const [message, setMessage] = createSignal("");
const [encMessage, setEncMessage] = createSignal("");
const [decMessage, setDecMessage] = createSignal("");
const [prKey, setPrKey] = createSignal("");
const [puKey, setPuKey] = createSignal("");

const importKeys = async () => {
  const priKey = await importPrivateKey(prKey());
  const pubKey = await importPublicKey(puKey());

  setKeypair({ publicKey: pubKey, privateKey: priKey });
};

const encryptMessage = async () => {
  let enc = new TextEncoder();
  let encoded = enc.encode(message());
  let result = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    keypair().publicKey,
    encoded
  );
  setEncMessage(result);
};

const decryptMessage = async () => {
  let dec = new TextDecoder();
  let decrypted = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    keypair().privateKey,
    encMessage()
  );
  let result = dec.decode(decrypted);
  setDecMessage(result);
};

const downloadPem = () => {};

const Example = () => {
  return (
    <>
      <h1>Encrypted</h1>
      <button class="border-2 rounded-md p-4" onClick={generateKey}>
        Generate keypair
      </button>
      <div class="flex justify-around items-center">
        <div class="w-1/2">
          <textarea
            class="h-56 w-full border-2"
            onInput={(e) => setPuKey(e.target.value)}
          />
        </div>
        <div class="w-1/2">
          <textarea
            class="h-56 w-full border-2"
            onInput={(e) => setPrKey(e.target.value)}
          />
        </div>
      </div>
      <button onClick={importKeys} class="border-2 rounded-lg p-4">
        Import keys
      </button>
      <br />
      <h3>Message</h3>
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
          <textarea class="h-56 w-full border-2" value={encMessage()} />
          <button onClick={decryptMessage} class="border-2 rounded-lg p-4">
            Decrypt
          </button>
        </div>
      </div>
      <div class="p-4 border-2 rounded-md h-32 w-full">{decMessage()}</div>
      <br />
      <button onClick={stringifyKeypair} class="border-2 rounded-lg p-4">
        Stringify
      </button>
      <Show when={stringifiedKeypair}>
        <div>{stringifiedKeypair.publicKey}</div>
        <div>{stringifiedKeypair.privateKey}</div>
        <a
          onClick={downloadPem}
          class="border-2 rounded-lg p-4"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
            stringifiedKeypair.privateKey
          )}`}
          download="private"
        >
          Download
        </a>
      </Show>
    </>
  );
};

export { Example };
