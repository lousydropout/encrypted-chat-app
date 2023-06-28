import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

const [keypair, setKeypair] = createSignal(null);
const [stringifiedKeypair, setStringifiedKeypair] = createStore({});

/*
  Convert  an ArrayBuffer into a string
  from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/*
  Export the given key and write it into the "exported-key" space.
*/
async function exportPublicKey(key) {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);

  return exportedAsBase64;
  // return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
}

async function exportPrivateKey(key) {
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);

  return exportedAsBase64;
  // return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
}

const generateKey = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      // Consider using a 4096-bit key for systems that require long-term security
      modulusLength: 256,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  setKeypair(keyPair);
};

const stringifyKeypair = async () => {
  if (keypair() === null) await generateKey();
  const publicKey = await exportPublicKey(keypair().publicKey);
  const privateKey = await exportPrivateKey(keypair().privateKey);

  console.log("publicKey: ", publicKey);
  console.log("privateKey: ", privateKey);
  setStringifiedKeypair({ publicKey, privateKey });
};

/*
Import a PEM encoded RSA private key, to use for RSA-PSS signing.
Takes a string containing the PEM encoded key, and returns a Promise
that will resolve to a CryptoKey representing the private key.
*/
function importPrivateKey(pem) {
  // fetch the part of the PEM string between header and footer
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const x = pem.trim();
  const y =
    x.substring(0, pemHeader.length) === pemHeader
      ? x.substring(pemHeader.length)
      : x;
  const z =
    y.substring(y.length - pemFooter.length) === pemFooter
      ? y.substring(0, y.length - pemFooter.length)
      : y;
  const pemContents = z.trim();
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  );
}

function importPublicKey(pem) {
  // fetch the part of the PEM string between header and footer
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const x = pem.trim();
  const y =
    x.substring(0, pemHeader.length) === pemHeader
      ? x.substring(pemHeader.length)
      : x;
  const z =
    y.substring(y.length - pemFooter.length) === pemFooter
      ? y.substring(0, y.length - pemFooter.length)
      : y;
  const pemContents = z.trim();
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

export {
  generateKey,
  keypair,
  setKeypair,
  stringifyKeypair,
  stringifiedKeypair,
  setStringifiedKeypair,
  importPublicKey,
  importPrivateKey,
};
