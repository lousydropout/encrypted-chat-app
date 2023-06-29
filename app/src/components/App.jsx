import {
  fetchRegistryAccounts,
  fetchChatLogs,
  fetchChatLogsByOwner,
  initializeChat,
  sendMessage,
  fetchChatMessages,
} from "../helpers/encryptedChatApp";
import { chatMessages, setChatMessages } from "../store/chatapp";
import { For } from "solid-js";

const test = async () => {
  const registry = await fetchRegistryAccounts();
  console.log("registry: ", registry);
  const chatlogs = await fetchChatLogsByOwner("test2");
  console.log("chatlogs: ", chatlogs);

  // const chatlogs = await initializeChat("test2", "abc");
  // send message
  // const messageResult = await sendMessage(
  //   "abc",
  //   "test2",
  //   new Date().toUTCString(),
  //   "yo. this is a test message."
  // );
  // console.log("messageResult: ", messageResult);

  await fetchChatMessages("test2");
  console.log("fetchChatMessages: ", chatMessages);
};

const App = () => {
  test();
  return (
    <div class="py-8 px-12 w-full h-full rounded-xl bg-zinc-700 overflow-y-scroll">
      <h3 class="text-2xl text-center">Initiate Chat</h3>
      <div class="flex justify-between items-center my-4">
        <input class="p-2 rounded-md w-1/2" type="text"></input>
        <button class="border-2 rounded-md border-green-400 p-2">
          Start chat
        </button>
      </div>

      <h3 class="text-2xl text-center">Send Messsage</h3>
      <div class="flex justify-between items-center my-4">
        <input class="p-2 rounded-md w-1/2" type="text"></input>
        <button class="border-2 rounded-md border-green-400 p-2">Send</button>
      </div>

      <div class="flex justify-center items-center space-x-4">
        <h3 class="text-2xl text-center">Messsages</h3>
        <button class="border-2 border-green-400 rounded-md p-2">
          Refresh
        </button>
      </div>
      <div class="flex flex-col justify-start items-start my-4">
        <For each={chatMessages.accounts}>
          {(message, i) => (
            <div class="border p-2">
              <div># {i}</div>
              <div>author: {message.author}</div>
              <div>datetime: {message.timestamp}</div>
              <div>message: {message.encryptedMessage}</div>
              <div>decrypted: {message.message}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default App;
