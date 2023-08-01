import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { toggleShowLogin } from "../store/showLogin";
import { user, updateUser } from "../store/user";
import {
  stringifiedKeypair,
  setStringifiedKeypair,
  importPrivateKey,
  importPublicKey,
  setKeypair,
  keypair,
} from "../helpers/crypto";
import idl from "../assets/encrypted.json";
import { program } from "../store/program";
import { web3 } from "@coral-xyz/anchor";
import { connectWallet, walletPubkey } from "./Header";

const SigninComponent = () => {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore();

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const updatePrivateKey = (e) => {
    setStringifiedKeypair((prev) => ({
      ...prev,
      privateKey: e.currentTarget.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!walletPubkey()) connectWallet();

    const [registryAccount, bump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("registry"), Buffer.from(fields.username)],
      new web3.PublicKey(idl.metadata.address)
    );
    let results = await program().account.registryAccount.fetch(
      registryAccount
    );

    const privateKey = await importPrivateKey(stringifiedKeypair().privateKey);
    const publicKey = await importPublicKey(results.messagingPubkey);

    setKeypair({ privateKey, publicKey });

    updateUser({
      loggedIn: true,
      username: fields.username,
      decryptionKey: privateKey,
      encryptionKey: publicKey,
    });

    console.log("user: ", user());
  };

  return (
    <div class="flex flex-col justify-between items-center">
      {/* header */}
      <h1 class="text-3xl">Log in</h1>
      <p class="mt-2 text-sm text-center max-w">
        Don't have an account?
        <A
          class="ml-1 font-semibold underline text-emerald-400 hover:text-emerald-300 hover:border-emerald-300"
          href="#"
          onClick={toggleShowLogin}
          tabIndex="0"
        >
          Register here
        </A>
        .
      </p>
      <hr class="my-2 sm:my-4 border-zinc-400" />

      {/* form */}
      <form
        class="py-4 px-6 sm:px-8 sm:py-10 h-fit xs:w-96 rounded-md bg-zinc-700"
        onSubmit={submit}
      >
        {/* username */}
        <label for="username" class="flex justify-between text-emerald-400">
          Username:
        </label>
        <input
          name="username"
          id="username"
          type="username"
          placeholder="Username"
          autocomplete="username"
          class="w-full p-2 mt-1 mb-2 sm:mb-4 text-black bg-zinc-300 rounded ring-emerald-900"
          required
          onInput={updateField}
        />

        {/* Password */}
        <label for="password" class="flex justify-between text-emerald-400">
          Password:
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          autocomplete="password"
          required
          class="w-full p-2 mt-1 mb-2 sm:mb-4 text-black bg-zinc-300 rounded"
          onInput={updatePrivateKey}
          onBlur={updatePrivateKey}
        />

        {/* Submit button */}
        <div className="flex justify-center">
          <button
            type="submit"
            class="text-lg font-bold text-emerald-500 border-emerald-500 border shadow-sm drop-shadow-lg w-[70%] py-2 mt-6 rounded hover:text-emerald-300 hover:border-emerald-300"
          >
            Log in
          </button>
        </div>

        {/* Show errors */}
        <Show when={error()}>
          <div class="mt-4 flex justify-center text-red-400">{error()}</div>
        </Show>
      </form>
    </div>
  );
};

export default SigninComponent;
