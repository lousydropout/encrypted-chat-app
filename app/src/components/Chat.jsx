import {
  fetchRegistryAccounts,
  fetchChatLogsByOwner,
  initializeChat,
  sendMessage,
  fetchChatMessages,
} from "../helpers/encryptedChatApp";
import { chatMessages, registry } from "../store/chatapp";
import { For, onMount } from "solid-js";
import { convoPartner, setConvoPartner } from "../store/convoPartner";
import { user } from "../store/user";
import { createStore } from "solid-js/store";
import { connectWallet, walletPubkey } from "./Header";

const initialize = async () => {
  await fetchRegistryAccounts();
  const chatlogs = await fetchChatLogsByOwner(user().username);
  if (!walletPubkey()) connectWallet();
};

const Home = () => {
  const [fields, setFields] = createStore();
  const updateField = (e) => {
    const name = e.currentTarget.name;
    setFields([name], e.currentTarget.value);
  };
  onMount(async () => initialize());

  return (
    <div class="py-8 px-12 w-full h-full rounded-xl bg-zinc-700 overflow-y-scroll">
      {/* For Chat convo */}
      <div class="flex flex-col">
        <label for="convo_partner" class="flex justify-between text-gray-300 ">
          Select convo partner:
        </label>
        <div class="flex justify-between items-top space-x-4">
          <select
            class="mt-1 mb-4 w-full px-3 py-2 rounded cursor-pointer text-black"
            name="convo_partner"
            id="convo_partner"
            onChange={(e) => {
              setConvoPartner(e.currentTarget.value);
              fetchChatMessages(user().username, e.currentTarget.value);
            }}
          >
            <option value="" disabled selected>
              Select convo partner
            </option>
            <For each={registry.users || []}>
              {(x) => (
                <Show when={x.account.username != user().username}>
                  <option value={x.account.username}>
                    {x.account.username}
                  </option>
                </Show>
              )}
            </For>
          </select>
          <button
            class="border-2 rounded-md border-green-400 p-2"
            onClick={() => initializeChat(user().username, convoPartner())}
          >
            Initialize
          </button>
        </div>
      </div>

      {/* Reads messages*/}
      <div class="flex justify-center items-center space-x-4">
        <h3 class="text-2xl text-center">Messsages</h3>
        <button
          class="border-2 border-green-400 rounded-md p-2"
          onClick={() => fetchChatMessages(user().username, convoPartner())}
        >
          Refresh
        </button>
      </div>

      <div class="flex flex-col max-h-[55%] rounded-md bg-zinc-600 opacity-[99%] p-8 overflow-y-auto justify-start items-start my-4">
        <For each={chatMessages.accounts}>
          {(message, i) => (
            <div
              class="border rounded-md p-3"
              classList={{
                "self-end border-green-400 text-green-300 font-semibold":
                  message.author === user().username,
                "text-zinc-100": message.author !== user().username,
              }}
            >
              {/* <div># {i}</div> */}
              {/* <div>author: {message.author}</div> */}
              <div
                classList={{
                  "text-green-300 opacity-60":
                    message.author === user().username,
                  "text-zinc-400": message.author !== user().username,
                }}
              >
                {message.timestamp}
              </div>
              <div>{message.message}</div>
            </div>
          )}
        </For>
      </div>

      {/* Send message*/}
      <h3 class="text-2xl text-center">Send Messsage</h3>
      <div class="flex justify-between items-center my-4">
        <input
          name="message"
          id="message"
          class="p-2 rounded-md w-1/2"
          type="text"
          onInput={updateField}
        ></input>
        <button
          class="border-2 rounded-md border-green-400 p-2"
          classList={{ "border-zinc-400 text-zinc-400": convoPartner() === "" }}
          disabled={convoPartner() === ""}
          onClick={() => {
            sendMessage(
              user().username,
              convoPartner(),
              new Date().toUTCString(),
              fields.message
            );
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Home;
