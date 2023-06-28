import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { toggleShowLogin } from "../store/showLogin";
import { user, updateUser } from "../store/user";
import { stringifiedKeypair, setStringifiedKeypair } from "../crypto";

const SigninComponent = () => {
  const [error, setError] = createSignal(null);
  const [fields, setFields] = createStore();

  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };

  const updatePrivateKey = (e) => {
    setStringifiedKeypair("privateKey", e.currentTarget.value);
    console.log("privateKey", stringifiedKeypair.privateKey);
  };

  const submit = async (e) => {
    e.preventDefault();

    updateUser({
      loggedIn: true,
      username: fields.username,
      decryptionKey: stringifiedKeypair.privateKey,
    });
    console.log("logged in: ", user().loggedIn);
  };

  return (
    <div class="flex flex-col justify-between items-center">
      {/* header */}
      <h1 class="text-3xl">Log in</h1>
      <p class="mt-2 text-sm text-center max-w">
        Don't have an account?
        <A
          class="ml-1 font-semibold underline text-blue-400 hover:text-blue-300 hover:border-blue-300"
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
        <label for="username" class="flex justify-between text-gray-300">
          Username:
        </label>
        <input
          name="username"
          id="username"
          type="username"
          placeholder="Username"
          autocomplete="username"
          class="w-full p-2 mt-1 mb-2 sm:mb-4 text-black bg-zinc-300 rounded ring-blue-900"
          required
          onInput={updateField}
        />

        {/* Password */}
        <label for="password" class="flex justify-between text-gray-300">
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
            class="text-lg font-bold text-blue-500 border-blue-500 border shadow-sm drop-shadow-lg w-[70%] py-2 mt-6 rounded hover:text-blue-300 hover:border-blue-300"
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
